import Nullstack from 'nullstack'
import Logo from 'nullstack/logo'
import '../tailwind.css'
import About from './About'
import Blog from './Blog.jsx'
import Home from './Home.jsx'
import Navbar from './Navbar.jsx'
import NotFound from './NotFound.jsx'
import Post from './Post.jsx'

class Application extends Nullstack {

  links = [
    {"name": "github", "link": "https://github.com/victorfernandesraton"},
    {"name": "linkedin", "link": "https://linkedin.com/in/vraton"},
    {"name": "mastodon", "link": "https://mastodon.social/@ratondev"}
  ]
  prepare({ page, project }) {
    page.title = project.name
  }

  renderHead() {
    return (
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      </head>
    )
  }

  renderFooter() {
    return (
      <footer class='pt-6 flex flex-col max-w-[900px] mx-auto my-8 inset-x-0 bottom-0 lg:items-start items-center gap-4 text-center lg:text-start border-t-rosePine-surface border-t-[1px]'>
        <h3>Developer with &#128156; by victorfernandesraton</h3>
        <div class="flex flex-row items-center justify-between mr-4 gap-x-4 text-2xl">
          {this.links.map(({link, name}) => (
            <a target="_blank" href={link}>
              <i class={["fab text-rosePine-foam",`fa-${name}`]} />
            </a>
          ))}

        </div>
        <a href='https://nullstack.app/'>
          <h3>Powered by</h3>
          <Logo height={20} light />
        </a>
      </footer>
    )
  }

  render({router, page}) {
    if(page.status == 404) {
      router.path = '/404'
    }

    return (
      <>
        <Head />
        <Navbar />
        <body class="bg-rosePine-base text-rosePine-text lg:px-0 px-4">
          <Home route="/" />
          <Blog route="/blog" />
          <Post route="/blog/:slug" />
          <About route="/me" />
          <NotFound route="/404" />
        </body>
        <Footer />
      </>
    )
  }

}

export default Application
