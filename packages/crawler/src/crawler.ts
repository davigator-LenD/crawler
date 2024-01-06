export interface CrawlerOptions {}

export class Crawler {
    public constructor(options: CrawlerOptions) {
        console.log("Crawler constructor")
        console.log(options)
    }
}
