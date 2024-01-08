interface DataNodeConstructorOptions {
    text: string
    relevance: readonly [number, number]
    selector: string | undefined
    node_type: string
}
export type DataNodeChildConstructorOption = Omit<
    DataNodeConstructorOptions,
    "node_type"
>
export abstract class DataNode {
    /**
     * @description text data
     */
    public readonly text: string
    /**
     * @description unique selector for tag node
     */
    public readonly selector: string | undefined
    /**
     * @description `[node_index, node_depth]`
     */
    public readonly relevance: readonly [number, number]
    /**
     * @description `TEXT` | `ACTION` | `CONTENTS` | `LINK`
     */
    public readonly node_type: string
    public constructor(option: DataNodeConstructorOptions) {
        this.text = option.text
        this.selector = option.selector
        this.relevance = option.relevance
        this.node_type = option.node_type
    }

    /**
     * @description category of data node tags
     */
    public static readonly Tags: string[]
    /**
     * @description get current tagName is in data node category
     */
    public static readonly is: (tagName: string) => boolean
}
