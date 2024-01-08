import { describe, expect, it } from "vitest"
import { Tokenizer } from "../tokenizer.js"
import { extractTxt } from "../../utils/extractTxt.js"

const basePath = "packages/generator/src/__mocks__/" as const
const testFileNames = [
    "정부24_1",
    "정부24_2",
    "네이버_뉴스",
    "네이버_메인",
] as const
const htmlList: string[] = testFileNames.reduce<string[]>((acc, name) => {
    const res = extractTxt(`${basePath}${name}.html`)
    if (res.success) {
        acc.push(res.data)
        return acc
    }
    return acc
}, [])

const tokenizer = new Tokenizer()

describe("Tokenizer", () => {
    it("should tokenize a simple string", () => {
        htmlList.forEach((html) => {
            tokenizer.init(html)
            const tokens = tokenizer.tokenize()
            expect(tokens).toMatchSnapshot()
        })
    })
})
