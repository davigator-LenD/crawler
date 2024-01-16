import { type PlaywrightCrawlerOptions } from "crawlee"
import { Extractor, type ExtractorOptions } from "./extractor.js"
import { Crawler, type CrawlerOptions } from "./crawler.js"

type PlaywrightCrawlerEngineOptions = Omit<
    PlaywrightCrawlerOptions,
    "requestHandler"
>
export interface EngineOptions {
    extractorOptions: ExtractorOptions
    crawlerOptions: CrawlerOptions
    playwrightOptions: PlaywrightCrawlerEngineOptions
}
export const withDefaultConfig = (baseUrl: string) =>
    ({
        extractorOptions: {
            generatorOptions: {
                useActionNode: false,
                useContentsNode: false,
                useTokens: false,
            },
            textPreprocessorOptions: {
                duplicatedCriterion: 100,
            },
        },
        crawlerOptions: {
            baseUrl,
            filterTagList: ["script", "style", "noscript"],
            selector: "body",
        },
        playwrightOptions: {
            headless: true,
        },
    }) as const satisfies EngineOptions

export const createEngine = ({
    crawlerOptions,
    extractorOptions,
    // playwrightOptions,
}: EngineOptions): Crawler => {
    const extractor = Extractor.create(extractorOptions)
    const crawler = new Crawler({
        ...crawlerOptions,
        extractor,
    })

    return crawler
}
