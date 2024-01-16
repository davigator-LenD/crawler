import { createCrawler } from "./create_crawler.js"

const target = {
    govern24: "https://www.gov.kr/portal",
    kb: "https://www.kbstar.com", // -> enqueueLinks가 동작하지 않는 문제
    governPolicy: "https://www.korea.kr",
} as const

const instance = await createCrawler(target.governPolicy)
await instance.run()
