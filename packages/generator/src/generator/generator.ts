import type { TagNode } from "../parser/tag_node.js"
import {
    LinkNode,
    TextNode,
    ActionNode,
    ContentsNode,
    type DataNode,
} from "./index.js"
import { TextPreprocessor } from "./text_preprocessor.js"

export interface GeneratorConstructorOption {
    nodeCombination?: {
        nodeDepth: number
        nodeDistance: number
    }
    useLinkNode?: boolean
    useTextNode?: boolean
    useActionNode?: boolean
    useContentsNode?: boolean
    useTokens?: boolean
}
export interface GeneratorSpec {
    nodes: DataNode[]
    meta: string | null
}
interface GeneratorConstructor extends GeneratorConstructorOption {
    tokenPreprocessor: TextPreprocessor
}
export class Generator {
    public constructor(options: GeneratorConstructor) {
        this.$text = options.tokenPreprocessor

        this.nodeCombination = options?.nodeCombination

        this.useTokens = options.useTokens ?? true

        this.useLinkNode = options.useLinkNode ?? true
        this.useTextNode = options.useTextNode ?? true
        this.useActionNode = options.useActionNode ?? true
        this.useContentsNode = options.useContentsNode ?? true
    }

    private readonly nodeCombination:
        | GeneratorConstructor["nodeCombination"]
        | undefined
    private readonly $text: GeneratorConstructor["tokenPreprocessor"]

    private get isNodeCombinationEnabled(): boolean {
        return this.nodeCombination !== undefined
    }

    private readonly useTokens: boolean
    private readonly useLinkNode: boolean
    private readonly useTextNode: boolean
    private readonly useActionNode: boolean
    private readonly useContentsNode: boolean

    private ast: TagNode | undefined

    private dataNodeList: DataNode[] = []
    private meta: string | null = null
    private push(dataNode: DataNode): void {
        this.dataNodeList.push(dataNode)
    }
    private pop(): void {
        this.dataNodeList.pop()
    }
    private top(): DataNode | undefined {
        return this.dataNodeList[this.dataNodeList.length - 1]
    }

    private getSelectorFromAttributes(
        attributes: Record<string, string>
    ): string | null {
        const targetField = "id" as const
        const id = attributes[targetField]
        return id ? id : null
    }

    private MetaData({ tagName, innerText, attributes }: TagNode): void {
        if (this.meta !== null) return

        const metaTags = new Map([
            ["title", 1],
            ["meta", 2],
        ])
        const picked = metaTags.get(tagName)
        if (!picked) return

        if (this.isValidText(innerText) === false) return

        const isTitle = picked === 1
        if (isTitle) {
            const metaData = this.$text.getPurifiedTextToken(innerText)

            if (metaData.text === null) return
            this.meta = metaData.text
            return
        }

        const getMetaData = (
            attributes: Record<string, string>
        ): string | null => {
            const name = attributes.name
            const property = attributes.property

            const content = attributes.content
            if (!content) return null

            if (property === "og:title" || property === "twitter:title") {
                return content
            }

            if (
                name === "description" ||
                property === "og:description" ||
                property === "twitter:description"
            ) {
                return content
            }

            return null
        }

        const metaData = getMetaData(attributes)
        if (metaData === null) return

        this.meta = metaData
    }

    /**
     * @description Combine nodes by relevance
     * @example
     * ```html
        <a href="link url">text<div>inner text</div></a>
        <div>text</div>
        <div text2</div>
     * ```
     * @param prevNode
     * @param currNode
     */
    private combineNode(
        prevNode: DataNode | undefined,
        currNode: DataNode
    ): DataNode | undefined {
        if (prevNode === undefined) {
            return currNode
        }

        const prevRelevance = prevNode.relevance
        const currRelevance = currNode.relevance

        const getCombinableState = (
            currRelevance: readonly [number, number],
            prevRelevance: readonly [number, number]
        ): boolean => {
            const [curr_index, curr_depth] = currRelevance
            const [prev_index, prev_depth] = prevRelevance

            const isDepthValid =
                Math.abs(curr_depth - prev_depth) <=
                this.nodeCombination!.nodeDepth
            const isDistanceValid =
                Math.abs(curr_index - prev_index) <=
                this.nodeCombination!.nodeDistance

            return isDepthValid && isDistanceValid
        }

        if (getCombinableState(currRelevance, prevRelevance)) {
            const isCurrAfterNode =
                currRelevance[0] > prevRelevance[0] &&
                currRelevance[1] > prevRelevance[1]

            const text = isCurrAfterNode
                ? (currNode.text ?? "") + " " + (prevNode.text ?? "")
                : (prevNode.text ?? "") + " " + (currNode.text ?? "")

            const id = currNode.selector ?? prevNode.selector ?? null
            const tokens: string[] = this.useTokens
                ? [
                      ...new Set([
                          ...(currNode.tokens ?? []),
                          ...(prevNode.tokens ?? []),
                      ]),
                  ]
                : []

            if (
                (prevNode.node_type === "link" ||
                    currNode.node_type === "link") &&
                prevNode.node_type !== currNode.node_type
            ) {
                this.pop()

                const href = (currNode as LinkNode).href
                    ? (currNode as LinkNode).href
                    : (prevNode as LinkNode).href
                const action = (currNode as LinkNode).action
                    ? (currNode as LinkNode).action
                    : (prevNode as LinkNode).action

                const linkNode = new LinkNode({
                    text,
                    href,
                    selector: id,
                    relevance: currRelevance,
                    action,
                    tokens,
                })
                return linkNode
            }

            if (
                prevNode.node_type === "text" &&
                currNode.node_type === "text"
            ) {
                this.pop()

                const textNode = new TextNode({
                    relevance: currRelevance,
                    selector: id,
                    text,
                    tokens,
                })
                return textNode
            }
        }

        return currNode
    }

    private walk(node: TagNode): void {
        const walkChildren = (node: TagNode) => {
            const { children } = node
            const childrenLength: number = children.length
            const shouldVisitChildren = childrenLength !== 0
            if (shouldVisitChildren) {
                for (const child of children) {
                    this.walk(child)
                }
            }
        }

        const { tagName } = node

        if (TextNode.is(tagName) && this.useTextNode) {
            this.TextNode(node)
        } else if (ActionNode.is(tagName) && this.useActionNode) {
            this.ActionNode(node)
        } else if (LinkNode.is(tagName) && this.useLinkNode) {
            this.LinkNode(node)
        } else if (ContentsNode.is(tagName) && this.useContentsNode) {
            this.ContentsNode(node)
        }

        this.MetaData(node)

        walkChildren(node)
    }

    private isValidText(text: string | null): text is string {
        if (text === null) return false

        const isUselessNode: boolean = /^\s+$/.test(text) || !text
        return !isUselessNode
    }

    private TextNode({ innerText, relevance, attributes }: TagNode): void {
        if (this.isValidText(innerText)) {
            const { text, tokens } = this.$text.getPurifiedTextToken(innerText)

            if (text !== null) {
                const textNode = new TextNode({
                    text,
                    tokens: this.useTokens ? tokens : [],
                    relevance,
                    selector: this.getSelectorFromAttributes(attributes),
                })
                if (this.isNodeCombinationEnabled) {
                    const combined = this.combineNode(this.top(), textNode)
                    if (combined !== undefined) this.push(combined)
                } else {
                    this.push(textNode)
                }
            }
        }
    }

    private LinkNode({ attributes, innerText, relevance }: TagNode): void {
        const validateUrl = (url: string | null | undefined): boolean => {
            if (url === null || url === undefined) return false

            const urlRegex =
                /^(https?):\/\/([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)(\/[a-zA-Z0-9-_/]*)(\?[a-zA-Z0-9-_&=]*)?(#[a-zA-Z0-9-_]*)?$|^\/[a-zA-Z0-9-_/]*(\?[a-zA-Z0-9-_&=]*)?(#[a-zA-Z0-9-_]*)?$/

            return urlRegex.test(url)
            //TODO: [ HOW_TO ] internal link like #id
            // || url.startsWith("#")
        }

        const href = attributes.href

        if (validateUrl(href) && this.isValidText(innerText)) {
            const action = attributes.onclick ?? null
            const { text, tokens } = this.$text.getPurifiedTextToken(innerText)

            if (text !== null) {
                const linkNode = new LinkNode({
                    text,
                    action,
                    tokens: this.useTokens ? tokens : [],
                    href: href!,
                    relevance,
                    selector: this.getSelectorFromAttributes(attributes),
                })
                if (this.isNodeCombinationEnabled) {
                    const combined = this.combineNode(this.top(), linkNode)
                    if (combined !== undefined) this.push(combined)
                } else {
                    this.push(linkNode)
                }
            }
        }
    }

    private ContentsNode({ attributes, relevance }: TagNode): void {
        const src = attributes.src
        if (src) {
            const alt = attributes.alt
            const contentsNode = new ContentsNode({
                relevance: relevance,
                selector: this.getSelectorFromAttributes(attributes),
                src,
                text: alt === "" ? null : alt ?? null,
                tokens: [],
            })
            this.push(contentsNode)
        }
    }

    private ActionNode({
        tagName,
        attributes,
        innerText,
        relevance,
    }: TagNode): void {
        const getDescription = () => {
            const placeholder = attributes.placeholder
            const title = attributes.title
            const ariaLabel = attributes["aria-label"]

            if (innerText) {
                return innerText
            } else if (placeholder) {
                return placeholder
            } else if (title) {
                return title
            } else if (ariaLabel) {
                return ariaLabel
            }
            return null
        }

        const selector = this.getSelectorFromAttributes(attributes)
        const shouldIncluded = attributes.type !== "hidden" && selector !== null

        if (shouldIncluded) {
            const actionNode = new ActionNode({
                text: getDescription(),
                relevance,
                selector,
                type: tagName as
                    | "button"
                    | "input"
                    | "textarea"
                    | "select"
                    | "option"
                    | "form",
                tokens: [],
            })
            this.push(actionNode)
        }
    }
    private reset(): void {
        this.ast = undefined
        this.dataNodeList = []
        this.meta = null
    }

    public init(ast: TagNode) {
        this.reset()
        this.ast = ast
    }

    public generate(): GeneratorSpec {
        if (!this.ast) {
            throw new Error("ast가 초기화되지 않았습니다.")
        }

        this.walk(this.ast)

        return {
            nodes: this.dataNodeList,
            meta: this.meta,
        }
    }
}
