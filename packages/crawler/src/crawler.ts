import { RequestQueue, PlaywrightCrawler } from "crawlee"
import { LinkStorage } from "./link_storage.js"
import type { Extractor } from "./extractor.js"

export interface CrawlerOptions {
    baseUrl: string
    selector?: string
    filterTagList?: Array<keyof HTMLElementTagNameMap>
}
interface CrawlerConstructorOptions extends CrawlerOptions {
    extractor: Extractor
}
export class Crawler {
    private requestQueue!: RequestQueue

    private readonly $extractor: Extractor
    private readonly $linkStorage: LinkStorage

    private readonly filterTagList: Array<keyof HTMLElementTagNameMap>
    private readonly baseUrl: string
    private readonly selector: string

    public constructor({
        extractor,
        baseUrl,
        filterTagList = [],
        selector = "body",
    }: CrawlerConstructorOptions) {
        this.$extractor = extractor
        this.$linkStorage = new LinkStorage()

        this.baseUrl = baseUrl
        this.selector = selector
        this.filterTagList = filterTagList
    }

    private isInternalLink(url: URL): boolean {
        return url.hostname === new URL(this.baseUrl).hostname
    }

    // private async getPageHtml(page: Page): Promise<string> {
    //     const html = await page.evaluate((selector) => {
    //         const targetElement = document.querySelector(
    //             selector
    //         ) as HTMLElement | null

    //         this.filterTagList.forEach((tag) => {
    //             targetElement?.querySelectorAll(tag)?.forEach((t) => t.remove())
    //         })

    //         const purifiedHtml = targetElement?.innerHTML.replace(/[\n\t]/g, "")
    //         return purifiedHtml || ""
    //     }, this.selector)

    //     return html
    // }

    private extract(html: string) {
        this.$extractor.setHtml(html)
        return this.$extractor.parse()
    }

    public async crawl(): Promise<void> {
        const crawler = new PlaywrightCrawler({
            // requestQueue: this.requestQueue,
            requestHandler: async ({
                page,
                request,
                log,
                enqueueLinks,
                pushData,
            }) => {
                await page.waitForSelector(this.selector, {
                    timeout: 500,
                })

                const html = await page.$$eval("body", (bodyElements) => {
                    bodyElements.forEach((targetElement) => {
                        this.filterTagList.forEach((tag) => {
                            targetElement
                                ?.querySelectorAll(tag)
                                .forEach((t) => t.remove())
                        })
                    })

                    const purifiedHtml = bodyElements
                        .at(0)
                        ?.innerHTML.replace(/[\n\t]/g, "")

                    // Return the modified HTML
                    return purifiedHtml || ""
                })

                // const html = await this.getPageHtml(page)

                await page.$$eval("a", (element) => {
                    element?.forEach((el) => {
                        const href = el.getAttribute("href")
                        if (!href) return

                        const url: URL = new URL(href, request.loadedUrl)
                        if (!this.isInternalLink(url)) return

                        const urlString = url.toString()

                        if (this.$linkStorage.hasLink(urlString)) return

                        if (this.$linkStorage.addLink(urlString)) {
                            this.requestQueue.addRequest(
                                { url: urlString },
                                { forefront: true }
                            )
                        }
                    })
                })

                log.info(`Crawled ${request.loadedUrl}`)

                await pushData({
                    url: request.loadedUrl,
                    ...this.extract(html),
                })

                await enqueueLinks({
                    requestQueue: this.requestQueue,
                })
            },
        })

        await crawler.run([this.baseUrl])
    }
}
