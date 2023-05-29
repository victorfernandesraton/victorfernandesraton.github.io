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
      <footer class='max-w-[900px] mx-auto my-8 inset-x-0 bottom-0'>
        <h3>Developer with &#128156; by victorfernandesraton</h3>
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
        <body class="bg-rosePine-base text-rosePine-text">
          <Head />
          <Navbar />
          <Home route="/" />
          <Blog route="/blog" />
          <Post route="/blog/:slug" />
          <About route="/me" />
          <NotFound route="/404" />
          <Footer />
        </body>
      </>
    )
  }

}

export default Application
