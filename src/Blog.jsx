import Nullstack from 'nullstack'

import PostList from './PostList'

class Blog extends Nullstack {
  prepare({ page, project }) {
    page.title = `${project.name} - Blog`
    page.description = "Some posts write by me"
  }

  render() {
    return (
      <section class="flex-col max-w-[900px] mx-auto">
        <h1 class="text-5xl font-bold mt-8 mb-16">Posts</h1>
        <p class="text-xl mt-2 mb-8">This is a bunch of content with i produce, someones is a full messy, so... </p>
        <PostList persistent tagList />
      </section>
    )
  }

}

export default Blog
