import Nullstack from 'nullstack';
import PostList from './PostList';

class Home extends Nullstack {
  
  render() {
    return (
      <main class='max-w-[900px] mx-auto'>
        <h1 class='text-5xl font-bold my-16'>
          Home
        </h1>
        <PostList persistent />
      </main>
    )
  }

}

export default Home;
