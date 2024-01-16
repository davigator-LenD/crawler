import { DataNode, DataNodeChildConstructorOption } from "./data_node.js"

export interface LinkNodeConstructorOptions
    extends DataNodeChildConstructorOption {
    href: string
    action: string | null
}
export class LinkNode extends DataNode {
    public readonly href: string
    public readonly action: string | null = null
    public constructor({
        text,
        selector,
        relevance,
        href,
        tokens,
        action,
    }: LinkNodeConstructorOptions) {
        super({
            tokens,
            text,
            selector,
            relevance,
            node_type: "link",
        })
        this.href = href
        this.action = action
    }

    public static override Tags: Set<string> = new Set(["a"])
    public static override is(tagName: string): tagName is "a" {
        return LinkNode.Tags.has(tagName)
    }
}
