import Nullstack from 'nullstack';
import PostList from './PostList';

class Blog extends Nullstack {

    prepare({ page }) {
        page.title = "RatonDev - Blog"
    }
    render() {
        return (
            <div>
                <h1>
                    Blog
                </h1>
                <PostList />
            </div>
        )
    }

}

export default Blog;