import Nullstack from 'nullstack';
import PostList from './PostList';

class Home extends Nullstack {
  
  render() {
    return (
      <div>
        <h1>Home</h1>
        <PostList />
      </div>
    )
  }

}

export default Home;