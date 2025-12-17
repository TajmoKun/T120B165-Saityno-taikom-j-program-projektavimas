import { useState, useEffect } from "react";
import { getPosts } from "../api/posts";
import { useGlobal } from "../context/GlobalContext";
import { CreateForm } from "./CreateForm";
import { CommentsList } from "./Comments";
import "./Posts.css";

type PostsListProps = {
  subforumId: number;
  selectedPostId: number;
  onSelect: (id: number) => void;
  onRefresh?: () => void;
};

export function PostsList({ subforumId, selectedPostId, onSelect, onRefresh }: PostsListProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { host, isLoggedIn, user } = useGlobal();

  const fetchPosts = () => {
    getPosts(host, subforumId).then(data => setPosts(data));
  };

  useEffect(() => {
    fetchPosts();
  }, [host, subforumId, refreshKey]);

  const handlePostCreated = () => {
    fetchPosts();
    if (onRefresh) onRefresh();
  };

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1 className="posts-title">Posts</h1>
        {isLoggedIn && (
          <button
            className="create-post-btn"
            onClick={() => setShowCreatePost(!showCreatePost)}
          >
            {showCreatePost ? 'Cancel' : '+ New Post'}
          </button>
        )}
      </div>

      {showCreatePost && (
        <CreateForm
          type="post"
          subforumId={subforumId}
          onSuccess={handlePostCreated}
          onClose={() => setShowCreatePost(false)}
        />
      )}

      <ul className="posts-list">
        {posts.length === 0 ? (
          <li className="no-posts">No posts yet. Be the first to post!</li>
        ) : (
          posts.map((item) => (
            <li key={item.id} className="post-wrapper">
              <div
                className={`posts-item ${selectedPostId === item.id ? 'posts-item-selected' : ''}`}
                onClick={() => onSelect(selectedPostId === item.id ? -1 : item.id)}
              >
                <div className="post-content">
                  <span>{item.title}</span>
                </div>
              </div>

              <div className="rating-container">
                <button className="rating-btn">
                  <span>YEAH!</span>
                  <span className="rating-count">0</span>
                </button>
                <button className="rating-btn">
                  <span>NAURRR</span>
                  <span className="rating-count">0</span>
                </button>
              </div>

              {isLoggedIn && user?.id === item.userid && (
                <div className="item-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </div>
              )}

              {selectedPostId === item.id && (
                <div className="comments-wrapper">
                  <CommentsList
                    subforumId={subforumId}
                    postId={item.id}
                  />
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}