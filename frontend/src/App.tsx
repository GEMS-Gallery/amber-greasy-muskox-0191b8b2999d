import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import { backend } from 'declarations/backend';
import PostList from './components/PostList';
import NewPostForm from './components/NewPostForm';

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://images.unsplash.com/photo-1579623261984-41f9a81d4044?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjUzODA2MjR8&ixlib=rb-4.0.3)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8, 0, 6),
  marginBottom: theme.spacing(4),
}));

const App: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = async (title: string, body: string, author: string) => {
    setLoading(true);
    try {
      await backend.createPost(title, body, author);
      await fetchPosts();
      setShowNewPostForm(false);
    } catch (error) {
      console.error('Error creating new post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <HeroSection>
        <Container maxWidth="sm">
          <Typography component="h1" variant="h2" align="center" gutterBottom>
            Crypto Blog
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Explore the latest insights and discussions in the world of cryptocurrency.
          </Typography>
        </Container>
      </HeroSection>

      <Container maxWidth="md">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowNewPostForm(true)}
          >
            Create New Post
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <PostList posts={posts} />
        )}

        <NewPostForm
          open={showNewPostForm}
          onClose={() => setShowNewPostForm(false)}
          onSubmit={handleNewPost}
        />
      </Container>
    </div>
  );
};

export default App;
