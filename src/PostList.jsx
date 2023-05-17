import { readdir } from "node:fs/promises"
import Nullstack from "nullstack";
import Post from "./Post";
class PostList extends Nullstack {
    postList = []
    static async getPostTree({ locale }) {
        const files = await readdir(`public/posts/${locale}`, { withFileTypes: true });

        const filesList = files.filter(file => file.isDirectory()).map(file => file.name);

        const contentData = filesList.map(i => Post.getPost({ locale, key: i }))

        const posts = await Promise.all(contentData)
        return posts.sort((a,b) => new Date(a.created_at) > new Date(b.created_at))
    }



    async prepare({ page }) {
        this.postList = await this.getPostTree({ locale: page.locale })
    }

    renderPostLink({ name, title }) {
        return (
           <li>
                <a href={`/blog/${name}`}>{title}</a>
           </li>
        )
    }

    render() {
        if (!this.initiated) {
            return <h1>Loading</h1>
        }

        return (

            <ul>
                {this.postList.map(i => <PostLink {...{ ...i }} />)}
            </ul>
        )
    }
}

export default PostList