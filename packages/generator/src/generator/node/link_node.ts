import { DataNode, DataNodeChildConstructorOption } from "./data_node.js"

export interface LinkNodeConstructorOptions
    extends DataNodeChildConstructorOption {
    href: string
}
export class LinkNode extends DataNode {
    public readonly href: string
    public constructor({
        text,
        selector,
        relevance,
        href,
    }: LinkNodeConstructorOptions) {
        super({
            text,
            selector,
            relevance,
            node_type: "link",
        })
        this.href = href
    }

    public static override Tags: Set<string> = new Set(["a"])
    public static override is(tagName: string): tagName is "a" {
        return LinkNode.Tags.has(tagName)
    }
}
