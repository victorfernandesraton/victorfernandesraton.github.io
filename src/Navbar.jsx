import Nullstack from 'nullstack'

import Logo from './Logo'

class Navbar extends Nullstack {

    // TODO loading from translation
    tabs = [
        { title: 'Blog', href: '/blog' },
        { title: 'About me', href: '/me' },
    ]

    showDropdown = false

    prepare(context) {
        context.page.locale = 'en-US'
    }

    renderNavItem({ title, href, router }) {
        return (
            <li class={['px-4 pb-2', 'border border-transparent', router.path.includes(href) && 'border-b-rosePine-rose']}>
                <a class="font-semibold" href={href}>
                    {title}
                </a>
            </li>
        )
    }

    renderRssIcon() {
        return (
            <a aria-label="RSS feed" target="_blank" href="/assets/feed.xml">
                <i class="fas text-rosePine-gold px-4 pb-2 md:fa-md fa-sm fa-rss fa-solid" />
            </a>
        )
    }

    render() {
        return (
            <nav class="sticky bg-rosePine-base top-0 max-w-[900px] m-auto flex justify-between content-between gap-8 py-6 border-b-rosePine-surface border-b-[1px]">
                <div class="flex md:flex-col flex-row flex-wrap  w-full justify-between">
                    <div class="flex items-center ">
                        <a href="/" aria-label="Go to homepage" class="flex items-center ">
                            <Logo />
                        </a>
                        <ul class="hidden text-xl ml-auto text-rosePine-rose md:flex justify-between">
                            {this.tabs.map((item) => (
                                <NavItem {...{ ...item }} />
                            ))}
                            <RssIcon />
                        </ul>

                    </div>
                    <details class='flex list-none open:w-full flex-col'>

                        <summary
                            class=" flex rounded-md p-4 text-rosePine-text focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rosePine-shiny md:hidden"
                        >

                            <svg
                                class="block h-6 w-6 text-rosePine-rose"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>

                            <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </summary>
                        <ul class={['md:hidden text-xl ml-auto text-rosePine-rose justify-between']}>
                            {this.tabs.map((item) => (
                                <NavItem {...{ ...item }} />
                            ))}
                            <RssIcon />
                        </ul>
                    </details>
                </div>
            </nav>
        )
    }

}

export default Navbar
