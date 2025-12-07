import React, { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import { useGlobal } from "../context/GlobalContext";
import { CommentsList } from "./comments";
import "./Posts.css";

type PostsListProps = {
  subforumId: number;
  selectedPostId: number;
  onSelect: (id: number) => void;
};

export function PostsList({ subforumId, selectedPostId, onSelect }: PostsListProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const { host } = useGlobal();

  useEffect(() => {
    getPosts(host, subforumId).then(data => setPosts(data));
  }, [host, subforumId]);

  return (
    <div className="posts-container">
      <h1 className="posts-title">Posts</h1>
      <ul className="posts-list">
        {posts.map((item) => (
          <li key={item.id} className="post-wrapper">
            <div
              className={`posts-item ${selectedPostId === item.id ? 'posts-item-selected' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              {item.title}
            </div>
            {selectedPostId === item.id && (
              <div className="comments-wrapper">
                <CommentsList subforumId={subforumId} postId={item.id} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}