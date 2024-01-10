import type { TagNode } from "../parser/tag_node.js"
import {
    LinkNode,
    TextNode,
    ActionNode,
    ContentsNode,
    type DataNode,
} from "./index.js"

export class Generator {
    public constructor() {}

    private ast: TagNode | undefined = undefined
    private readonly dataNodeList: DataNode[] = []
    private push(dataNode: DataNode): void {
        this.dataNodeList.push(dataNode)
    }
    private pop(): void {
        this.dataNodeList.pop()
    }
    private at(index: number): DataNode | undefined {
        return this.dataNodeList[index]
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

    private purifyText(htmlString: string): string {
        const filterPattern = /&nbsp;|&gt;|&lt;|\t|\r?\n|\r/g

        const replaceWith = (match: string): string => {
            switch (match) {
                case "&nbsp;":
                    return " " // Replace &nbsp; with space
                case "&gt;":
                    return ">" // Replace &gt; with >
                case "&lt;":
                    return "<" // Replace &lt; with <
                case "\t":
                    return "" // Replace tab with nothing
                case "\r": // Fall through
                case "\n": // Fall through
                case "\r\n":
                    return "" // Replace newlines with nothing
                default:
                    return match
            }
        }
        return htmlString.replace(filterPattern, replaceWith).trim()
    }

    /**
     * @description
     * @example
     * ```html
        // <a href="link url">text<div>inner text</div></a>
        // <div>text</div>
        // <div text2</div>
     * ```
     * @param prevNode
     * @param currNode
     * @returns
     */
    private combineNode(
        prevNode: DataNode | undefined,
        currNode: DataNode
    ): DataNode {
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
            const isDepthValid = Math.abs(curr_depth - prev_depth) <= 1
            const isIndexValid = curr_index - prev_index === 1

            return isDepthValid && isIndexValid
        }

        if (getCombinableState(currRelevance, prevRelevance)) {
            const isCurrAfterNode =
                currRelevance[0] > prevRelevance[0] &&
                currRelevance[1] > prevRelevance[1]
            const text = isCurrAfterNode
                ? (currNode.text ?? "") + (prevNode.text ?? "")
                : (prevNode.text ?? "") + (currNode.text ?? "")

            const id = currNode.selector ?? prevNode.selector ?? null
            const avgRelevance = [
                (prevRelevance[0] + currRelevance[0]) / 2,
                (prevRelevance[1] + currRelevance[1]) / 2,
            ] as const

            if (
                prevNode.node_type === "link" ||
                currNode.node_type === "link"
            ) {
                this.pop()

                const linkNode = new LinkNode({
                    text,
                    selector: id,
                    relevance: avgRelevance,
                    href: (prevNode as LinkNode).href,
                })
                return linkNode
            }
            if (
                prevNode.node_type === "text" &&
                currNode.node_type === "text"
            ) {
                this.pop()

                const textNode = new TextNode({
                    relevance: avgRelevance,
                    selector: id,
                    text,
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

        const { tagName, innerText, attributes, relevance } = node
        const id = this.getSelectorFromAttributes(attributes)

        if (TextNode.is(tagName)) {
            if (innerText !== null) {
                const textNode = new TextNode({
                    relevance,
                    selector: id,
                    text: this.purifyText(innerText),
                })
                const combined = this.combineNode(this.top(), textNode)
                this.push(combined)
            }
        } else if (ActionNode.is(tagName)) {
            const description = () => {
                const placeholder = attributes.placeholder
                const title = attributes.title
                const innerText = node.innerText
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
            const shouldSkip = attributes.type === "hidden"
            if (shouldSkip === false) {
                const actionNode = new ActionNode({
                    relevance,
                    selector: id,
                    text: description(),
                    type: tagName,
                })
                this.push(actionNode)
            }
        } else if (LinkNode.is(tagName)) {
            const href = attributes.href
            if (href) {
                const linkNode = new LinkNode({
                    text: innerText ? this.purifyText(innerText) : null,
                    selector: id,
                    relevance,
                    href,
                })
                const combined = this.combineNode(this.top(), linkNode)
                this.push(combined)
            }
        } else if (ContentsNode.is(tagName)) {
            const src = attributes.src
            if (src) {
                const alt = attributes.alt
                //TODO: inject image description by image model
                const contentsNode = new ContentsNode({
                    relevance,
                    selector: id,
                    src,
                    text: alt ?? null,
                })
                this.push(contentsNode)
            }
        }

        walkChildren(node)
    }

    public init(ast: TagNode) {
        this.ast = ast
    }

    public generate(): DataNode[] {
        if (this.ast === undefined) {
            throw new Error("ast가 초기화되지 않았습니다.")
        }
        this.walk(this.ast)
        return this.dataNodeList
    }
}
