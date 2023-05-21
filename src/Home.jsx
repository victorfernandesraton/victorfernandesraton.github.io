import Nullstack from 'nullstack';
import PostList from './PostList';

class Home extends Nullstack {
  
  render() {
    return (
      <main class='max-w-[900px] mx-auto'>
        <h1>Home</h1>
        <PostList />
      </main>
    )
  }

}

export default Home;
