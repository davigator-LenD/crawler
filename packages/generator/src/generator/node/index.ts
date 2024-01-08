import type { ActionNode } from "./action_node.js"
import type { ContentsNode } from "./contents_node.js"
import type { LinkNode } from "./link_node.js"
import type { TextNode } from "./text_node.js"

export * from "./action_node.js"
export * from "./contents_node.js"
export * from "./data_node.js"
export * from "./link_node.js"
export * from "./text_node.js"

/**
 * @description Data node for generator
 */
export type DataNode = TextNode | ActionNode | LinkNode | ContentsNode
