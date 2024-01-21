import {
    Tokenizer,
    Parser,
    TextPreprocessor,
    Generator,
    type GeneratorSpec,
    type GeneratorConstructorOption,
    type TextPreprocessorConstructorOption,
} from "@lend/generator"

import { Logger } from "@lend/logger"

export interface ExtractorOptions {
    generatorOptions: GeneratorConstructorOption
    textPreprocessorOptions: TextPreprocessorConstructorOption
}
interface ExtractorSpec extends GeneratorSpec {
    href: string | null
}
export class Extractor {
    private readonly $tokenizer: Tokenizer
    private readonly $parser: Parser
    private readonly $generator: Generator
    private readonly $lg: Logger

    private result: ExtractorSpec = {
        nodes: [],
        meta: null,
        href: null,
    }

    private isHtmlSet: boolean = false

    private static instance: Extractor
    public static create(options: ExtractorOptions): Extractor {
        if (!Extractor.instance) {
            Extractor.instance = new Extractor(options)
        }
        return Extractor.instance
    }

    public static setOptions(options: ExtractorOptions): void {
        Extractor.instance = new Extractor(options)
    }

    private constructor(options: ExtractorOptions) {
        this.$tokenizer = new Tokenizer(true)
        this.$parser = new Parser()

        const tokenPreprocessor = new TextPreprocessor({
            ...options.textPreprocessorOptions,
        })
        this.$generator = new Generator({
            ...options.generatorOptions,
            tokenPreprocessor,
        })

        this.$lg = new Logger({
            name: "Extractor",
        })
    }

    public setHtml(html: string): void {
        this.reset()

        this.$tokenizer.init(html)
        const tokens = this.$tokenizer.tokenize()
        this.$parser.init(tokens)
        const ast = this.$parser.parse()
        this.$generator.init(ast)

        this.isHtmlSet = true
        this.$lg.log("HTML is set")
    }

    private reset(): void {
        this.isHtmlSet = false
        this.result = {
            nodes: [],
            meta: null,
            href: null,
        }
    }

    public parse(
        { meta, href }: { meta?: string | null; href: string | null } = {
            meta: null,
            href: null,
        }
    ): ExtractorSpec {
        if (!this.isHtmlSet) {
            this.$lg.error("HTML is not set")
            return { ...this.result, href: null }
        }

        try {
            const generated = this.$generator.generate()

            this.$lg.success("Generation success")
            this.$lg.log(`Node length: ${generated.nodes.length}`)

            const result: ExtractorSpec = {
                nodes: generated.nodes,
                meta: generated.meta || (meta ?? null),
                href: href ?? null,
            }
            this.result = result
            return this.result
        } catch (e) {
            if (e instanceof Error) {
                this.$lg.error(e.message)
            }
            return this.result
        }
    }
}
