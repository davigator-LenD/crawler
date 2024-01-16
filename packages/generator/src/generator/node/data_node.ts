type NullableString = string | null
interface DataNodeConstructorOptions {
    text: NullableString
    relevance: readonly [number, number]
    selector: NullableString
    node_type: string
    tokens: string[] | null
}
export type DataNodeChildConstructorOption = Omit<
    DataNodeConstructorOptions,
    "node_type"
>

export abstract class DataNode {
    /**
     * @description text data
     */
    public readonly text: DataNodeConstructorOptions["text"]
    /**
     * @description unique selector for tag node
     */
    public readonly selector: DataNodeConstructorOptions["selector"]
    /**
     * @description `[node_index, node_depth]`
     */
    public readonly relevance: DataNodeConstructorOptions["relevance"]
    /**
     * @description `TEXT` | `ACTION` | `CONTENTS` | `LINK`
     */
    public readonly node_type: DataNodeConstructorOptions["node_type"]
    /**
     * @description text search tokens
     */
    public readonly tokens: DataNodeChildConstructorOption["tokens"]

    public constructor(option: DataNodeConstructorOptions) {
        this.text = option.text

        this.tokens = option.tokens

        this.selector = option.selector
        this.relevance = option.relevance
        this.node_type = option.node_type
    }

    /**
     * @description category of data node tags
     */
    public static readonly Tags: Set<string>
    /**
     * @description get current tagName is in data node category
     */
    public static readonly is: (tagName: string) => boolean
}
