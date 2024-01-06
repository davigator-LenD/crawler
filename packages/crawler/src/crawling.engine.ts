import { Crawler } from "./crawler.js"

export interface CrawlerConstructorOptions {
    deepParse: boolean
    engine: Crawler
}
const defaultCrawlerConstructorOptions: CrawlerConstructorOptions = {
    deepParse: false,
    engine: new Crawler({}),
}
export class CrawlingEngine {
    constructor({
        deepParse,
    }: CrawlerConstructorOptions = defaultCrawlerConstructorOptions) {
        this.deepParse = deepParse
    }

    private deepParse: boolean
}
