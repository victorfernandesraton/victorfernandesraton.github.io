import Nullstack from 'nullstack'
import Post from './Post.jsx'
import NotFound from './NotFound.jsx'
import Home from './Home.jsx'
import Blog from './Blog.jsx'

class Application extends Nullstack {

  prepare({ page }) {
    page.locale = "en-US"
    page.title = "RatonDev"
  }

  renderHead() {
    return (
      <head>
      </head>
    )
  }

  render() {
    return (
      <body>
        <Head />
        <nav>
          <ul>
            <li><a href='/'>Home </a></li>
            <li><a href='/blog'>Blog</a></li>
            <li><a href='/about'>Sobre</a></li>
            <li><a href='/contact'>Contato</a></li>
          </ul>
        </nav>
        <Home route='/' />
        <Blog route='/blog' />
        <Post route='/blog/:slug' />
        <NotFound route='/404' />
      </body>
    )
  }

}

export default Application
