import { withDefaultConfig } from "./engine.js"
import { Extractor } from "./extractor.js"
import { PuppeteerCrawler, Dataset } from "crawlee"

export const createCrawler = async (url: string): Promise<PuppeteerCrawler> => {
    const extractor = Extractor.create(withDefaultConfig(url).extractorOptions)

    const core = new PuppeteerCrawler({
        async requestHandler({ request, page, enqueueLinks, log }) {
            log.info(`Crawl start ${request.url}`)

            const html = await page.$eval("html", (element) => {
                element.querySelectorAll("script").forEach((e) => e.remove())
                element.querySelectorAll("style").forEach((e) => e.remove())
                element.querySelectorAll("link").forEach((e) => e.remove())
                return element.innerHTML.replace(/[\n\t]/g, "")
            })

            // const links = await page.$$eval("a", (element) => {
            //     return element.map((el) => {
            //         const href = el.getAttribute("href")
            //         if (!href) return ""

            //         const url: URL = new URL(href, location.href)
            //         return url.href
            //     })
            // })

            log.info(`> html crawled`)

            extractor.setHtml(html)
            const result = extractor.parse()

            await Dataset.pushData({
                url: request.url,
                ...result,
            })

            await enqueueLinks({
                globs: [`${url}/**`],
            })
        },
    })

    await core.addRequests([url])
    return core
}
