import { DataNode, type DataNodeChildConstructorOption } from "./data_node.js"

export class TextNode extends DataNode {
    public constructor({
        text,
        selector,
        relevance,
    }: DataNodeChildConstructorOption) {
        super({ text, selector, relevance, node_type: "text" })
    }
    public static override Tags: Set<string> = new Set([
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "div",
        "span",
    ])
    public static override is(
        tagName: string
    ): tagName is
        | "p"
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6"
        | "div"
        | "span" {
        return TextNode.Tags.has(tagName)
    }
}
