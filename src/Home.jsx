import Nullstack from 'nullstack'

import Post from './Post'
import PostItem from './PostItem'
class Home extends Nullstack {

    links = [
        { name: 'github', link: 'https://github.com/victorfernandesraton' },
        { name: 'linkedin', link: 'https://linkedin.com/in/vraton' },
        { name: 'mastodon', link: 'https://fosstodon.org/@v_raton' },
    ]

    description = 'Wellcome to my personal chaos'

    postList = []
    prepare(context) {
        context.page.title = `${context.project.shortName} - Home`
        context.page.description = this.description
    }

    async initiate() {
        const data = await Post.getAllPost()
        this.postList = data.sort((a, b) => b.published_at >= a.published_at).slice(0, 3)
    }

    render() {
        return (
            <main class="max-w-[900px] mx-auto">
                <div class="flex flex-col-reverse md:flex-row gap-x-16">
                    <div class="flex flex-col">
                        <h1 class="text-3xl font-bold mt-8 mb-8 sm:mb-16">{this.description}</h1>
                        <p class="my-2">
                            Hello guys, I'm Victor Raton, a full-stack developer since 2019, a staunch advocate of open source, and an
                            excellent creator of bugs in JavaScript.
                        </p>
                        <div class="flex mt-8 flex-row items-center self-center md:self-auto justify-between md:justify-start w-1/2">
                            {this.links.map(({ link, name }) => (
                                <a aria-label={`link to my ${name}`} target="_blank" href={link} rel='me'>
                                    <i class={['fab text-rosePine-rose mr-4 text-3xl', `fa-${name}`]} />
                                </a>
                            ))}
                        </div>
                    </div>
                    <img
                        src="assets/img/profile.webp"
                        alt="Victor Raton image face"
                        width={64}
                        height={64}
                        class="md:w-64 w-40 self-center border border-rosePine-rose border-b-4 border-r-4 rounded-full"
                    />
                </div>
                <h2 class="text-xl font-bold text-rosePine-text my-8">What I've been up to lately.</h2>
                <ul>
                    {this.postList.map((item) => (
                        <li>
                            <PostItem {...{ ...item }} />
                        </li>
                    ))}
                </ul>
            </main>
        )
    }

}

export default Home
