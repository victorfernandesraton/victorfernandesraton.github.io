import Nullstack from 'nullstack'
import Logo from 'nullstack/logo'
import '../tailwind.css'
import About from './About'
import Blog from './Blog.jsx'
import Home from './Home.jsx'
import Navbar from './Navbar.jsx'
import NotFound from './NotFound.jsx'
import Post from './Post.jsx'
import Loading from './Loading'

class Application extends Nullstack {


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
        <p>Developed with &#128156; by victorfernandesraton</p>
        <a href='https://nullstack.app/'>
          <p>Powered by</p>
          <Logo height={20} light />
        </a>
      </footer>
    )
  }

  renderBody({ children }) {
    return (
      <>
        <Head />
        <Navbar />
        <body class="bg-rosePine-base text-rosePine-text lg:px-0 px-4 h-fulli">
          {children}
        </body>
        <Footer />
      </>
    )
  }

  render({ router, page }) {
    if (page.status == 404) {
      router.path = '/404'
    }

    if (!this.initiated) {
      return (
        <Body>
          <main class="flex items-center justify-center align-middle max-w-[900px] mx-auto py-32">
            <Loading />
          </main>
        </Body>
      )
    }

    return (
      <Body>
        <Home route="/" />
        <Blog route="/blog" />
        <Post route="/blog/:slug" key={router.path} />
        <About route="/me" />
        <NotFound route="/404" />
      </Body>
    )
  }

}

export default Application
