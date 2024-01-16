import { CheerioCrawler, RequestQueue, Dataset } from "crawlee"
import { LinkStorage } from "./link_storage.js"
import { Extractor } from "./extractor.js"

export interface CrawlerOptions {}

export class HttpCrawler {
    private requestQueue!: RequestQueue
    private $linkStorage: LinkStorage
    private $extractor: Extractor
    private baseUrl: string

    constructor(baseUrl: string, extractor: Extractor) {
        this.baseUrl = baseUrl
        this.$linkStorage = new LinkStorage()
        this.$extractor = extractor
    }
    private isInternalLink(url: URL): boolean {
        return url.origin === new URL(this.baseUrl).origin
    }

    private extract(html: string) {
        this.$extractor.setHtml(html)
        return this.$extractor.parse()
    }

    public async crawl(): Promise<void> {
        this.requestQueue = await RequestQueue.open()
        await this.requestQueue.addRequest({ url: this.baseUrl })

        const crawler = new CheerioCrawler({
            requestQueue: this.requestQueue,
            requestHandler: async ({ request, $, log, body }) => {
                const links: string[] = []

                $("a").each((index, element) => {
                    const href = $(element).attr("href")
                    if (href) {
                        const url = new URL(href, request.loadedUrl)

                        if (this.isInternalLink(url)) {
                            const urlString = url.toString()
                            if (this.$linkStorage.hasLink(urlString)) return

                            if (this.$linkStorage.addLink(urlString)) {
                                links.push(urlString)
                                this.requestQueue.addRequest(
                                    { url: urlString },
                                    { forefront: true }
                                )
                            }
                        }
                    }
                })

                log.info(
                    `Found ${links.length} links, Crawled ${request.loadedUrl}`
                )

                const html = body.toString().replace(/[\n\t]g/, "")
                const contents = this.extract(html)

                await Dataset.pushData({
                    url: request.loadedUrl,
                    ...contents,
                })
            },
        })

        await crawler.run()
    }
}
