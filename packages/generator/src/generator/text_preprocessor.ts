export interface TextPreprocessorConstructorOption {
    duplicatedCriterion: number
}
export class TextPreprocessor {
    private readonly duplicatedCriterion: TextPreprocessorConstructorOption["duplicatedCriterion"]
    public constructor(option: TextPreprocessorConstructorOption) {
        this.duplicatedCriterion = option.duplicatedCriterion
    }

    private tokenTable: Map<string, number> = new Map<string, number>()
    private josaSet: Set<string> = new Set([
        "가",
        "과",
        "을",
        "를",
        "이",
        "야",
        "나",
        "에",
        "게",
        "께",
        "아",
        "로",
        "여",
        "와",
        "고",
        "의",
        "랑",
        "은",
        "는",
        "도",
        "만",
        "뿐",
        "다",
        "시",
        "어",
        "이다",
        "으로",
        "에서",
        "에게",
        "이여",
        "로써",
        "보다",
        "라고",
        "하고",
        "이랑",
        "대로",
        "수가",
        "부터",
        "마다",
        "까지",
        "조차",
        "말로",
        "이야",
        "이나",
        "나마",
        "니다",
        "시면",
        "든지",
        "던지",
        "세요",
        "해요",
        "아요",
    ])

    private getDecodedToken(tokens: Array<string>): Array<string> {
        const decodedTokens: string[] = tokens.reduce<Array<string>>(
            (res, curr) => {
                const currLength: number = curr.length
                const lastChar: string = curr.substring(currLength - 1)
                const lastTwoChars: string = curr.substring(currLength - 2)

                if (this.josaSet.has(lastChar)) {
                    const josaRemovedToken = curr.substring(0, currLength - 1)
                    res.push(josaRemovedToken)
                } else if (this.josaSet.has(lastTwoChars)) {
                    const josaRemovedToken = curr.substring(0, currLength - 2)
                    res.push(josaRemovedToken)
                } else {
                    res.push(curr)
                }
                return res
            },
            []
        )
        return decodedTokens
    }

    private registerToken(tokens: Array<string>): void {
        for (const token of tokens) {
            if (this.tokenTable.has(token)) {
                const count = this.tokenTable.get(token)
                if (!count) throw new Error(`Count of ${token} is undefined.`)
                const updatedCount = count + 1
                this.tokenTable.set(token, updatedCount)
            } else {
                this.tokenTable.set(token, 1)
            }
        }
    }

    private combineTokens(tokens: Array<string>): string {
        return tokens.join(" ")
    }

    private transformText(noisedText: string): string {
        const filterPattern = /&nbsp;|&gt;|&lt;|\t|\r?\n|\r/g

        const replaceWith = (match: string): string => {
            switch (match) {
                case "&nbsp;":
                    return " " // Replace &nbsp; with space
                case "&gt;":
                    return ">" // Replace &gt; with >
                case "&lt;":
                    return "<" // Replace &lt; with <
                case "&middot;":
                    return "·" // Replace &middot; with ·
                case "\t":
                    return "" // Replace tab with nothing
                case "\r": // Fall through
                case "\n": // Fall through
                case "\r\n":
                    return "" // Replace newlines with nothing
                default:
                    return match
            }
        }
        return noisedText.replace(filterPattern, replaceWith).trim()
    }

    private isValidText(text: string | null): text is string {
        if (text === null) return false

        const isUselessNode: boolean =
            /^\s+$/.test(text) || !text || text.length <= 1

        return !isUselessNode
    }

    public getPurifiedTextToken(pureText: string): {
        text: string | null
        tokens: Array<string>
    } {
        const transformedText: string = this.transformText(pureText)
        const tokens: Array<string> = transformedText.split(" ")
        const decodedTokens: Array<string> = this.getDecodedToken(tokens)

        this.registerToken(tokens)

        type Purified = {
            textTokens: Array<string>
            searchTokens: Array<string>
        }
        const purified: Purified = decodedTokens.reduce<Purified>(
            (res, curr, i) => {
                const duplicatedCount: number = this.tokenTable.get(curr) ?? 0
                if (duplicatedCount < this.duplicatedCriterion) {
                    const originalToken = tokens[i]!
                    res.textTokens.push(originalToken)
                    res.searchTokens.push(curr)
                }
                return res
            },
            { textTokens: [], searchTokens: [] }
        )

        const purifiedText: string = this.combineTokens(purified.textTokens)
        const isValidText: boolean = this.isValidText(purifiedText)

        return {
            text: isValidText ? purifiedText : null,
            tokens: purified.searchTokens,
        }
    }

    public getRemovedTokenTable(): Record<string, number> {
        return Object.entries(Object.fromEntries(this.tokenTable)).reduce<
            Record<string, number>
        >((res, [key, value]) => {
            if (value < this.duplicatedCriterion) return res
            res[key] = value
            return res
        }, {})
    }
}
