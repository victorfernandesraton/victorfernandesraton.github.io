import Nullstack from 'nullstack'

import Logo from './Logo'

class Navbar extends Nullstack {

  // TODO loading from translation
  tabs = [
    { title: 'Blog', href: '/blog' },
    { title: 'About me', href: '/me' },
  ]

  renderNavItem({ title, href, router }) {
    return (
      <li class={['px-4 pb-2', 'border border-transparent', router.path.includes(href) && 'border-b-rosePine-rose']}>
        <a class="font-semibold" href={href}>
          {title}
        </a>
      </li>
    )
  }

  render() {
    return (
      <nav class="max-w-[900px] m-auto flex content-between gap-8">
        <a href="/" class="flex items-center ">
          <Logo />
        </a>
        <ul class="text-xl ml-auto text-rosePine-rose flex justify-between py-6">
          {this.tabs.map((item) => (
            <NavItem {...{ ...item }} />
          ))}
        </ul>
        <div class="w-24 flex flex-row items-center justify-between mr-4">
          <a target="_blank" href="https://github.com/victorfernandesraton">
            <i class="fab fa-github text-rosePine-foam" />
          </a>
        </div>
      </nav>
    )
  }

}

export default Navbar
