import Nullstack from 'nullstack'

import Blog from './Blog.jsx'
import Home from './Home.jsx'
import NotFound from './NotFound.jsx'
import Post from './Post.jsx'
import Navbar from './Navbar.jsx'
import "./Application.css"
import "../tailwind.css"
class Application extends Nullstack {

  prepare({ page }) {
    page.locale = 'en-US'
    page.title = 'RatonDev'
  }

  renderHead() {
    return <head />
  }

  render() {
    return (
      <body class='w-full bg-red-100'>
        <Head />
        <Navbar />
        <Home route="/" />
        <Blog route="/blog" />
        <Post route="/blog/:slug" />
        <NotFound route="/404" />
      </body>
    )
  }

}

export default Application
