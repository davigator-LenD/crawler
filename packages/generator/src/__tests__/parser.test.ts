import { describe, expect, it } from "vitest"
import { Tokenizer } from "../parser/tokenizer.js"
import { Parser } from "../parser/parser.js"
import { extractTxt } from "../utils/extractTxt.js"

describe("Parser", () => {
    it("Should parse 네이버_뉴스 HTML ast", () => {
        const html = extractTxt(
            "packages/generator/src/__mocks__/네이버_메인.html"
        )

        if (html.success === false) {
            throw new Error("html 파일을 읽어오는데 실패했습니다.")
        }
        // setup tokenizer
        const tokenizer = new Tokenizer()
        tokenizer.init(html.data)
        const tokens = tokenizer.tokenize()
        // setup parser
        const parser = new Parser()
        parser.init(tokens)
        const ast = parser.parse()
        expect(ast).toMatchSnapshot()
    })
})
