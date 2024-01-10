import { lg } from "../utils/index.js"

//TODO: refactor for each token logics
export type Token =
    | {
          type: "TAG_OPEN"
          value: string // tagName
      }
    | {
          type: "TAG_CLOSE"
          value: string // tagName
      }
    | {
          type: "TAG_PAIR"
          value: ">"
      }
    | {
          type: "TAG_SELF_CLOSE"
          value: "/>"
      }
    | {
          type: "TEXT"
          value: string
      }
    | {
          type: "ATTRIBUTE"
          value: string
      }
    | {
          type: "ASSIGNMENT"
          value: "="
      }

export class Tokenizer {
    private rawString: string
    private pointer: number
    private tokenStream: Token[] = []

    constructor(private readonly logOff: boolean = true) {
        this.rawString = ""
        this.pointer = -1
    }

    private log(message: string): void {
        if (!this.logOff) lg.log(message)
    }

    public init(input: string) {
        this.log("initializing")
        this.rawString = input.replace(/\n/g, "")
        this.log("initializing succeed")
    }

    private char(increase: number = 0): string {
        this.pointer += increase
        return this.rawString[this.pointer] ?? ""
    }

    private getNextToken(): Token | undefined {
        const char = this.char(1)

        if (char === "<") {
            if (this.char(1) === "/") {
                this.pointer++
                this.log("Closing tag </")
                return {
                    type: "TAG_CLOSE",
                    value: this.TagName(),
                }
            }
            if (this.char() === "!") {
                let char: string = this.char(1)
                while (char !== ">") {
                    char = this.char(1)
                }
                this.log("Comment <!--")
                return undefined
            }
            this.log("Opening tag <")
            return {
                type: "TAG_OPEN",
                value: this.TagName(),
            }
        }
        if (char === ">") {
            if (this.char(-1) === "/") {
                this.pointer++
                // /> self closing tag
                this.log("Self closing tag />")
                return {
                    type: "TAG_SELF_CLOSE",
                    value: "/>",
                }
            }
            this.pointer++
            this.log("Closing tag >")
            return {
                type: "TAG_PAIR",
                value: ">",
            }
        }

        if (char === "=") {
            this.log("Assignment")
            return {
                type: "ASSIGNMENT",
                value: "=",
            }
        }

        const attributeRegex = /['"]/
        if (attributeRegex.test(char)) {
            let text: string = ""
            let innerChar: string = this.char(1)
            while (
                !attributeRegex.test(innerChar) &&
                innerChar !== ";" &&
                innerChar !== ">" &&
                innerChar !== "<"
            ) {
                text += innerChar
                innerChar = this.char(1)
            }
            text = text.trim()
            this.log(`Attribute, ${text}`)
            return {
                type: "ATTRIBUTE",
                value: text,
            }
        }

        const Text = /[^<>/=]/
        if (Text.test(char)) {
            let text: string = ""
            let innerChar: string = char
            while (Text.test(innerChar)) {
                text += innerChar
                innerChar = this.char(1)
            }
            if (text !== "") this.pointer--
            text = text.trim()

            if (text === "") return undefined
            text = this.removeExtraSpaces(text)
            this.log(`Text, ${text}`)
            return {
                type: "TEXT",
                value: text.trim(),
            }
        }
        return undefined
    }

    private removeExtraSpaces(text: string): string {
        // This regular expression matches one or more spaces
        const regex = /\s+/g
        return text.replace(regex, " ")
    }

    public tokenize(): Token[] {
        while (this.pointer < this.rawString.length) {
            const nextToken = this.getNextToken()
            if (nextToken) this.tokenStream.push(nextToken)
        }
        return this.tokenStream
    }

    private TagName(): string {
        let tagName: string = ""
        let char: string = this.char(0)

        while (
            !this.IsSpace &&
            this.pointer < this.rawString.length &&
            char !== ">"
        ) {
            tagName += char
            char = this.char(1)
        }
        this.pointer--
        return tagName
    }

    private get IsSpace(): boolean {
        const space = /\s/
        return space.test(this.char())
    }
}
