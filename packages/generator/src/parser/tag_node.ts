export interface TagNodeConstructorOptions {
    tagName: string
    index: number
    depth: number
}
export class TagNode {
    public constructor({ tagName, index, depth }: TagNodeConstructorOptions) {
        this.tagName = tagName
        this.relevance = [index, depth]
    }

    public readonly attributes: Record<string, string> = {}
    public innerText: string | null = null
    public readonly children: TagNode[] = []
    public readonly tagName: string
    public readonly relevance: readonly [number, number]

    public addAttribute(key: string, value: string) {
        this.attributes[key] = value
    }
    public addChild(child: TagNode) {
        this.children.push(child)
    }
    public addInnerText(text: string) {
        const space = " " as const
        if (this.innerText === null) this.innerText = text
        else this.innerText += space + text
    }
}
