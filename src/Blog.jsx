import Nullstack from 'nullstack';
import PostList from './PostList';

class Blog extends Nullstack {

  prepare({ page }) {
    page.title = "RatonDev - Blog"
  }
  render() {
    return (
      <section class='max-w-[900px] mx-auto'>
        <h1>
          Blog
        </h1>
        <PostList />
      </section>
    )
  }

}

export default Blog;
