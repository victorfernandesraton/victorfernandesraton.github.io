import Nullstack from 'nullstack'

import PostList from './PostList'

class Blog extends Nullstack {

  prepare({ page, project }) {
    page.title = `${project.name} - Blog`
    page.description = "Some posts write by me"
  }

  render() {
    return (
      <section class="max-w-[900px] mx-auto">
        <h1 class="text-5xl font-bold mt-8 mb-16">Posts</h1>
        <PostList persistent limit={3} />
      </section>
    )
  }

}

export default Blog
