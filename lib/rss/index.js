import RSS from "rss"
import path from "node:path"
import {writeFileSync} from "node:fs"
export class Feed {
    constructor(feed) {
        this.feed = feed
    }

    parseContent(data = []) {
        this.data = data
        
    }

    toXML() {

        for (const post of this.data) {
            this.feed.item({...post, date: post.published_at})
        }
        return this.feed.xml()
    }

    writeInFile(filename) {
        writeFileSync(filename,this.toXML())
    }

    static _start(params) {
        const rss = new RSS(params)
        return new Feed(rss)
    }
}

