import { DataNode, type DataNodeChildConstructorOption } from "./data_node.js"

interface TagNodeConstructorOptions extends DataNodeChildConstructorOption {
    src: string
}
export class ContentsNode extends DataNode {
    public constructor({
        text,
        selector,
        relevance,
        src,
        tokens,
    }: TagNodeConstructorOptions) {
        super({
            text,
            tokens,
            selector,
            relevance,
            node_type: "contents",
        })
        this.src = src
    }
    public readonly type: "img" = "img" as const
    public readonly src: string

    public static override Tags: Set<string> = new Set(["img"])
    public static override is(tagName: string): tagName is "img" {
        return ContentsNode.Tags.has(tagName)
    }
}
