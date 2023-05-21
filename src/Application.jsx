import Nullstack from 'nullstack'
import {useTheme} from 'nullwind'
import "../tailwind.css"
import Blog from './Blog.jsx'
import Home from './Home.jsx'
import NotFound from './NotFound.jsx'
import Post from './Post.jsx'
import Navbar from './Navbar.jsx'


const theme = {
  "button": {
    "base": 'rounded-none',
    "color": {
      "primary": "text-rosePine-surface bg-rosePine-rose hover:bg-rosePine-rose disabled:hover:bg-rosePine-muted",
      "secondary": "text-rosePine-text bg-rosePine-surface hover:bg-rosePine-surface disabled:hover:bg-rosePie-muted",
    },
    "active": {
      "primary": "bg-primary-600",
      "secondary": "bg-secondary-600",
      "info": "bg-info-600",
      "success": "bg-success-600",
      "warning": "bg-warning-600",
      "danger": "bg-danger-600"
    },
    "outline": {
     
      "primary": "text-rosePine-rose bg-rosePine-surface disabled:hover:bg-rosePine-muted",
      "secondary": "text-rosePine-iris bg-rosePine-surface disabled:hover:bg-rosePie-muted",
    }

  },

};


class Application extends Nullstack {

  initiate(context) {
    context.useTheme = useTheme(theme);
  }
  prepare({ page }) {
    page.locale = 'en-US'
    page.title = 'RatonDev'
  }

  renderHead() {
    return <head />
  }

  render(context) {
    if (!context.useTheme) return false;
    return (
      <body class="bg-rosePine-base text-rosePine-text">
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
