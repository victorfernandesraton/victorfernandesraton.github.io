import Nullstack from 'nullstack'

import PostList from './PostList'

class Blog extends Nullstack {

  prepare({ page, project }) {
    page.title = `${project.name} - Blog`
  }

  render() {
    return (
      <section class="px-4 md:px-0 max-w-[900px] mx-auto">
        <h1 class="text-5xl font-bold my-16">Posts</h1>
        <PostList limit={3} />
      </section>
    )
  }

}

export default Blog
