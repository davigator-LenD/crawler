import { describe, expect, it } from "vitest"
import { generatorTestSuite } from "./generator_test_suite.js"

describe("Generator", () => {
    it("Should generate dataNode from script tag removed 네이버_메인", () => {
        const res = generatorTestSuite("네이버_메인")
        expect(res).toMatchSnapshot()
    })
    it("Should generate dataNode from script tag removed 정부24_1", () => {
        const res = generatorTestSuite("정부24_1")
        expect(res).toMatchSnapshot()
    })
    it("Should generate dataNode from script tag removed 정부24_2", () => {
        const res = generatorTestSuite("정부24_2")
        expect(res).toMatchSnapshot()
    })
    it("Should generate dataNode from script tag removed 정부24_3", () => {
        const res = generatorTestSuite("정부24_3")
        expect(res).toMatchSnapshot()
    })
})
