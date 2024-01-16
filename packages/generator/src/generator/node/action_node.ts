import { DataNode, type DataNodeChildConstructorOption } from "./data_node.js"

export interface ActionNodeConstructorOptions
    extends DataNodeChildConstructorOption {
    type: "button" | "input" | "textarea" | "select" | "option" | "form"
}
export class ActionNode extends DataNode {
    public constructor({
        text,
        selector,
        relevance,
        type,
        tokens,
    }: ActionNodeConstructorOptions) {
        super({
            tokens,
            text,
            selector,
            relevance,
            node_type: "action",
        })
        this.type = type
    }
    public type: "button" | "input" | "textarea" | "select" | "option" | "form"

    public static override Tags: Set<string> = new Set([
        "button",
        "input",
        "textarea",
        "select",
        "option",
        "form",
    ])
    public static override is(tagName: string): tagName is ActionNode["type"] {
        return ActionNode.Tags.has(tagName)
    }
}
