import { useState, useEffect } from "react";
import { useGlobal } from "../context/GlobalContext";
import { getComments } from "../api/comments";
import { CreateForm } from "./CreateForm";
import "./Comments.css";

type CommentProps = {
  postId: number;
  subforumId: number;
};

export function CommentsList({ postId, subforumId }: CommentProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [showCreateComment, setShowCreateComment] = useState(false);
  const { host, isLoggedIn, user } = useGlobal();

  const fetchComments = () => {
    getComments(host, subforumId, postId).then(data => setComments(data));
  };

  useEffect(() => {
    fetchComments();
  }, [host, subforumId, postId]);

  const handleCommentCreated = () => {
    fetchComments();
  };

  return (
    <div className="comments-container">
      <div className="comments-header">
        <h2 className="comments-title">Comments</h2>
        {isLoggedIn && (
          <button
            className="create-comment-btn"
            onClick={() => setShowCreateComment(!showCreateComment)}
          >
            {showCreateComment ? 'Cancel' : '+ Add Comment'}
          </button>
        )}
      </div>

      {showCreateComment && (
        <CreateForm
          type="comment"
          subforumId={subforumId}
          postId={postId}
          onSuccess={handleCommentCreated}
          onClose={() => setShowCreateComment(false)}
        />
      )}

      <ul className="comments-list">
        {(comments ?? []).length === 0 ? (
          <li className="no-comments">No comments yet. Be the first to comment!</li>
        ) : (
          (comments ?? []).map((item) => (
            <li className="comments-item" key={item.id}>
              <div>{item.content}</div>
              
              <div className="rating-container">
                <button className="rating-btn">
                  <span>👍</span>
                  <span className="rating-count">0</span>
                </button>
                <button className="rating-btn">
                  <span>👎</span>
                  <span className="rating-count">0</span>
                </button>
              </div>

              {isLoggedIn && user?.id === item.userid && (
                <div className="item-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}