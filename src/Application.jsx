import Nullstack from 'nullstack'

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

  render() {
    return (
      <body class="bg-rosePine-base text-rosePine-text">
        <Head />
        <Navbar />
        <Home route="/" />
        <Blog route="/blog" />
        <Post route="/blog/:slug" />
        <About route="/me" />
        <NotFound route="/404" />
      </body>
    )
  }

}

export default Application
