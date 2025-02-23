import { writeFileSync } from "fs"
import { DataNode, Generator, Parser, Tokenizer } from "../index.js"
import { extractTxt } from "../utils/extractTxt.js"
import { lg } from "../utils/logger.js"
import { TextPreprocessor } from "../generator/text_preprocessor.js"

const prettify = (data: unknown) => JSON.stringify(data, null, 2)

export const generatorTestSuite = (fineName: string): DataNode[] => {
    const html = extractTxt(`packages/generator/src/__mocks__/${fineName}.html`)
    if (html.success === false) {
        throw new Error("html 파일을 읽어오는데 실패했습니다.")
    }

    const saveRoot = `suites/${fineName}`
    // setup tokenizer
    const tokenizer = new Tokenizer()
    tokenizer.init(html.data)
    const tokens = tokenizer.tokenize()
    // writeFileSync(`${saveRoot}_token.json`, prettify(tokens))

    // setup parser
    const parser = new Parser()
    parser.init(tokens)
    const ast = parser.parse()
    writeFileSync(`${saveRoot}_ast.json`, prettify(ast))

    // generate data nodes
    const tokenPreprocessor = new TextPreprocessor({
        duplicatedCriterion: 50,
    })
    const generator = new Generator({
        tokenPreprocessor,
        useContentsNode: false,
        useActionNode: false,
        nodeCombination: {
            nodeDepth: 5,
            nodeDistance: 2,
        },
        useTokens: false,
    })
    generator.init(ast)
    const dataNodeList = generator.generate()
    writeFileSync(
        `${saveRoot}_token.json`,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        prettify(generator.$text.getRemovedTokenTable())
    )
    writeFileSync(`${saveRoot}_main.json`, prettify(dataNodeList))
    lg.success(`Generated ${fineName} dataNodeList`)
    lg.log(`Saved at ${saveRoot}`)
    lg.log(`dataNodeList length: ${dataNodeList.nodes.length}`)

    return dataNodeList.nodes
}
