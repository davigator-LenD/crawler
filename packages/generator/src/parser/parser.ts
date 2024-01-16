import { TagNode } from "./tag_node.js"
import { Token } from "./tokenizer.js"

//TODO: upgrade error handling
class SyntaxError extends Error {
    public constructor(message: string) {
        super(message)
    }
}

export class Parser {
    public constructor() {}

    private tokenStream: Token[] = []
    private pointer: number = -1
    private nodeIndex = 0
    private parentStack: TagNode[] = []
    private ast: TagNode[] = []

    public init(tokenStream: Token[]) {
        this.reset()
        this.tokenStream = tokenStream
    }

    private reset(): void {
        this.pointer = -1
        this.nodeIndex = 0
        this.depth = 0
        this.parentStack = []
        this.ast = []
    }

    private top(): TagNode | undefined {
        return this.parentStack[this.parentStack.length - 1]
    }
    private pop(): void {
        this.parentStack.pop()
    }
    private push(tagNode: TagNode): void {
        this.parentStack.push(tagNode)
    }
    private depth: number = 0
    private increaseDepth(): void {
        this.depth++
    }
    private decreaseDepth(): void {
        this.depth--
    }

    private increaseNodeIndex(): void {
        this.nodeIndex++
    }

    private get isEOF(): boolean {
        return this.pointer >= this.tokenStream.length - 1
    }

    private token(increase: number = 0): Token | undefined {
        this.pointer += increase
        return this.tokenStream[this.pointer]
    }

    private getNextToken(): Token | undefined {
        const nextToken = this.token(1)
        this.pointer--
        return nextToken
    }
    private getPrevToken(): Token | undefined {
        const prevToken = this.token(-1)
        this.pointer++
        return prevToken
    }
    private findUntil(target: Token["type"]): Token {
        while (this.isEOF === false) {
            const token = this.token(1)
            if (token?.type === target) {
                return token
            }
        }
        throw new SyntaxError(`Expect ${target}, but reached EOF`)
    }
    private findUntilTargetRange(targetList: Set<Token["type"]>): Token {
        while (this.isEOF === false) {
            const token = this.token(1)
            if (targetList.has(token?.type as Token["type"])) {
                return token!
            }
        }
        throw new SyntaxError(`Expect ${targetList}, but reached EOF`)
    }

    private pushChildren(): void {
        const children = this.top()
        if (children) {
            const parent = this.parentStack[this.parentStack.length - 2]
            if (parent) {
                parent.addChild(children)

                this.decreaseDepth()
                this.pop()
            }
        }
    }

    /**
     * @description Parse `HTML` AST
     */
    public parse(): TagNode {
        while (this.isEOF === false) {
            this.TAG_OPEN()
        }
        this.generateAST()
        const ast = this.ast[0]
        if (ast === undefined) {
            throw new SyntaxError("Empty AST")
        }
        return ast
    }

    private generateAST(): void {
        const combinedAST = this.ast.reduceRight<TagNode>(
            (acc, curr, i, tot) => {
                const nextParent = tot[i - 1]
                if (nextParent) {
                    nextParent.addChild(curr)
                }
                return acc
            },
            this.ast[0] as TagNode
        )

        this.ast = [combinedAST]
    }

    /**
     * ```html
     * <TAG_OPEN> :
     *     | <ATTR>
     *     | <TAG_PAIR>
     *     | <TAG_SELF_CLOSE>
     * ```
     */
    private TAG_OPEN() {
        const openTag = this.findUntil("TAG_OPEN")
        if (openTag.value === "") return

        const tagNode = new TagNode({
            tagName: openTag.value,
            depth: this.depth,
            index: this.nodeIndex,
        })
        this.push(tagNode)

        this.increaseNodeIndex()
        this.increaseDepth()

        const nextToken = this.getNextToken()
        switch (nextToken?.type) {
            case "TEXT": {
                this.ATTR()
                break
            }
            case "TAG_PAIR": {
                this.TAG_PAIR()
                break
            }
            case "TAG_SELF_CLOSE": {
                this.TAG_SELF_CLOSE()
                break
            }
        }
    }

    /**
     * ```html
     * <ATTR> :
     *    | <TEXT><ASSIGNMENT><ATTRIBUTE><ATTR>
     *    | <TEXT><ASSIGNMENT><ATTRIBUTE><TAG_PAIR>
     *    | <TEXT><ASSIGNMENT><ATTRIBUTE><TAG_SELF_CLOSE>
     * ```
     */
    private ATTR(): void {
        const key: string = this.TEXT()
        this.ASSIGNMENT()
        const value: string = this.ATTRIBUTE()

        this.top()?.addAttribute(key, value)

        const nextToken = this.getNextToken()

        switch (nextToken?.type) {
            case "TEXT": {
                this.ATTR()
                break
            }
            case "TAG_PAIR": {
                this.TAG_PAIR()
                break
            }
            case "TAG_SELF_CLOSE": {
                this.TAG_SELF_CLOSE()
                break
            }
        }
    }

    /**
     * ```html
     * <TAG_PAIR>
     *      | ><TAG_INNER>
     * ```
     */
    private TAG_PAIR(): void {
        this.findUntil("TAG_PAIR")
        const prevToken = this.getPrevToken()
        if (prevToken?.type === "TAG_CLOSE") {
            if (this.isEOF) {
                this.ast = this.parentStack
                return
            }
            this.pushChildren()
        }

        // ----> exception = <div> >>>> </div> skip contiguous TAG_PAIR
        let nextTokenForError = this.token(1)
        while (nextTokenForError?.type === "TAG_PAIR") {
            nextTokenForError = this.token(1)
        }
        this.pointer--

        this.TAG_INNER()
    }

    /**
     * ```html
     * <TAG_CLOSE>
     *      | </
     * ```
     */
    private TAG_CLOSE(): void {
        this.findUntil("TAG_CLOSE")
        this.TAG_PAIR()
    }

    /**
     * ```html
     * <TAG_SELF_CLOSE>
     *      | /><TAG_INNER>
     * ```
     */
    private TAG_SELF_CLOSE(): void {
        this.findUntil("TAG_SELF_CLOSE")
        if (this.isEOF) {
            this.ast = this.parentStack
            return
        }
        this.pushChildren()
        this.TAG_INNER()
    }

    private TAG_INNER_VALID_TOKEN_LIST = new Set<Token["type"]>([
        "TEXT",
        "TAG_OPEN",
        "TAG_CLOSE",
    ])
    /**
     * ```html
     * <TAG_INNER>
     *     | <TAG_OPEN>
     *     | <TEXT><TAG_INNER>
     *     | <TAG_CLOSE>
     *     | ℇ
     * ```
     */
    private TAG_INNER(): void {
        const nextToken = this.getNextToken()

        switch (nextToken?.type) {
            case "TEXT": {
                const text = this.TEXT()
                this.top()?.addInnerText(text)
                this.TAG_INNER()
                break
            }
            case "TAG_OPEN": {
                this.TAG_OPEN()
                break
            }
            case "TAG_CLOSE": {
                this.TAG_CLOSE()
                break
            }
            case "ASSIGNMENT": {
                // ----> exception = <div> =hello </div>
                this.findUntilTargetRange(this.TAG_INNER_VALID_TOKEN_LIST)
                this.pointer--
                this.TAG_INNER()
                break
            }
            default: {
                break // ℇ
            }
        }
    }

    /**
     * ```html
     * <TEXT> -> string
     * ```
     */
    private TEXT(): string {
        const text = this.findUntil("TEXT")

        // ----> exception = <div> h===el>>==>>lo </div>
        let nextTokenForError = this.token(1)
        while (nextTokenForError?.type === "TAG_PAIR") {
            nextTokenForError = this.token(1)
        }
        this.pointer--

        return text.value
    }
    /**
     * ```html
     * <ASSIGNMENT> -> =
     * ```
     */
    private ASSIGNMENT(): void {
        this.findUntil("ASSIGNMENT")
        // ----> exception = <div id======"hello"> </div>
        let nextTokenForError = this.token(1)
        while (nextTokenForError?.type === "ASSIGNMENT") {
            nextTokenForError = this.token(1)
        }
        this.pointer--
    }
    /**
     * ```html
     * <ATTRIBUTE> -> string
     * ```
     */
    private ATTRIBUTE(): string {
        const attribute = this.findUntil("ATTRIBUTE")
        let attributeValue = attribute.value
        // ----> exception = <a href="https://naver.com?Category=name?label=text" />
        let nextTokenForError = this.token(1)
        while (nextTokenForError?.type === "ASSIGNMENT") {
            attributeValue += nextTokenForError.value
            nextTokenForError = this.token(1)
        }
        this.pointer--
        return attributeValue
    }
}
