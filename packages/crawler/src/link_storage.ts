export class LinkStorage {
    private visitedLinks: Set<string>

    public constructor() {
        this.visitedLinks = new Set<string>()
    }

    public addLink(url: string): boolean {
        if (this.visitedLinks.has(url)) {
            return false
        } else {
            this.visitedLinks.add(url)
            return true
        }
    }

    public hasLink(url: string): boolean {
        return this.visitedLinks.has(url)
    }
}
