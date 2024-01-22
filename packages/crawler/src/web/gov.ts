import puppeteer from "puppeteer"
import fs from "fs"
import { Extractor } from "../extractor.js"
import { lg } from "../utils/log.js"

const extractor = Extractor.create({
    generatorOptions: {
        nodeCombination: {
            nodeDepth: 5,
            nodeDistance: 2,
        },
        useTokens: false,
        useTextNode: true,
        useLinkNode: true,
        useActionNode: false,
        useContentsNode: false,
    },
    textPreprocessorOptions: {
        duplicatedCriterion: 50,
    },
})

type WaitForSelectorListResult =
    | {
          success: true
          selector: string
      }
    | {
          success: false
          selector: never
      }

const waitForSelectorList = async (
    page: puppeteer.Page,
    selectors: string[]
): Promise<WaitForSelectorListResult> =>
    (
        await Promise.allSettled(
            selectors.map(
                async (selector) =>
                    await page.waitForSelector(selector, { timeout: 500 })
            )
        )
    ).reduce<WaitForSelectorListResult>(
        (acc, cur, i) => {
            const selector = selectors[i]
            if (cur.status === "fulfilled" && typeof selector === "string") {
                acc.success = true
                acc.selector = selector
            }
            return acc
        },
        { selector: [], success: false } as WaitForSelectorListResult
    )

async function crawlGovernment({
    page,
    pageIndex,
}: {
    pageIndex: number
    page: puppeteer.Page
}) {
    const BASE_URL = "https://www.gov.kr"
    const url = `${BASE_URL}/search/applyMw?Mcode=11166&pageIndex=${pageIndex}`

    lg.enter("----------------------------------------")
    lg.info(`Crawl start: ${url}`)
    await page.goto(url)

    // Extract .result_cont_list > ul innerHTML
    const resultContList = await page.$eval(".result_cont_list > ul", (ul) => {
        ul.querySelectorAll("script, style").forEach((e) => e.remove())
        return ul.innerHTML.replace(/[\n\t]/g, "")
    })

    extractor.setHtml(resultContList)
    try {
        const title = await page.title()
        const result = extractor.parse({
            href: url,
            meta: title,
        })
        await fs.promises.writeFile(
            `./result/gov/${pageIndex}.json`,
            JSON.stringify(result, null, 2),
            {
                encoding: "utf-8",
            }
        )
    } catch (e) {
        if (e instanceof Error) {
            lg.error(e.message)
        } else {
            lg.error("Unknown error")
        }
    }

    lg.log(`Page ${pageIndex} - saved to ./result/gov/${pageIndex}.json`)

    // Find all <a> tags and their hrefs
    const links = await page.$$eval(
        ".result_cont_list > ul > li > div > a",
        (as) =>
            as.reduce<string[]>((acc, a) => {
                const BASE_URL = "https://www.gov.kr"
                const href = a.getAttribute("href")
                const link = `${BASE_URL}${href}`

                const exceptionList = [
                    "https://www.gov.kr/minwon/AA040_elec_self_cnfirm_guide.jsp",
                    "https://www.gov.kr/main?a=AA020InfoSidoCappViewApp&HighCtgCD=&CappBizCD=64100000001&tp_seq=",
                    "/main?a=AA020InfoSidoCappViewApp&HighCtgCD",
                ]
                const isException = exceptionList.some((e) => link.includes(e))
                if (
                    href?.includes("#") ||
                    href?.startsWith("http") ||
                    href?.startsWith("https") ||
                    href?.startsWith("javascript") ||
                    isException
                ) {
                    return acc
                }
                acc.push(link)
                return acc
            }, [])
    )

    let linkCount = 1
    for (const link of links) {
        lg.info(`Crawling sub_list: ${link}`)
        await page.goto(link)

        const { success, selector } = await waitForSelectorList(page, [
            ".cont_inner",
            ".contents",
            ".service-lf",
        ])
        if (!success) {
            lg.error(`${link} failed`)
            continue
        }
        const content = await page.$eval(selector, (div) => {
            // Remove script and style tags
            div.querySelectorAll("script, style").forEach((e) => e.remove())
            return div.innerHTML.replace(/[\n\t]/g, "")
        })
        const title = await page.title()

        extractor.setHtml(content)
        try {
            const result = extractor.parse({ href: link, meta: title })

            await fs.promises.writeFile(
                `./result/gov/${pageIndex}_${linkCount}.json`,
                JSON.stringify(result, null, 2)
            )
            linkCount++
            lg.log(
                `Page ${pageIndex}_${linkCount} - saved to ./result/gov/${pageIndex}_${linkCount}.json`
            )
        } catch (e) {
            if (e instanceof Error) {
                lg.error(e.message)
            } else {
                lg.error("Unknown error")
            }
        }
        // Process content or save it here
        await page.goBack()
    }
}

export async function gov() {
    let pageIndex = 1

    const browser = await puppeteer.launch({
        headless: true,
    })
    const page = await browser.newPage()
    await page.setViewport({
        width: 1500,
        height: 1000,
    })

    await fs.promises.mkdir("./result/gov", { recursive: true })

    while (pageIndex < 1250) {
        await crawlGovernment({ page, pageIndex })
        pageIndex++
    }

    lg.success("Crawling completed.")
}
