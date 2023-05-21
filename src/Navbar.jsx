import Nullstack from "nullstack"
import {Button} from 'nullwind'

class Navbar extends Nullstack {
  render() {
    return (
      <nav class="md:max-w-[900px] m-auto flex content-between gap-4">
        <div class='w-36 bg-rosePine-rose'></div>
        <ul class='text-xl ml-auto text-rosePine-rose flex justify-between py-6'>
          <li class="px-4"><a href="/">Home </a></li>
          <li class="px-4"><a href="/blog">Blog </a></li>
          <li class="px-4"><a href="/me">About me </a></li>
        </ul>
        <div class='w-36'></div>
      </nav>
    )
  }
}

export default Navbar
