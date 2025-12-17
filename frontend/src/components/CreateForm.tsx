import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { fetchWithAuth } from '../api/fetchWithAuth';
import './CreateForm.css';

type CreateFormProps = {
  type: 'subforum' | 'post' | 'comment';
  subforumId?: number;
  postId?: number;
  onSuccess: () => void;
  onClose: () => void;
};

export function CreateForm({ type, subforumId, postId, onSuccess, onClose }: CreateFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { host, token, setRefreshToken,setToken,refreshToken } = useGlobal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if(!token||!refreshToken){
      setError("You must be logged in");
      return;
    }

    try {
      let url = '';
      let body = {};

      if (type === 'subforum') {
        url = `${host}/api/subforums/create`;
        body = { title, description: content };
      } else if (type === 'post') {
        url = `${host}/api/subforums/${subforumId}/posts/create`;
        body = { title, content };
      } else if (type === 'comment') {
        url = `${host}/api/subforums/${subforumId}/${postId}/comments/create`;
        body = { content };
      }

    const response = await fetchWithAuth(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      token,
      refreshToken,
      host,
      (newToken, newRefreshToken) => {
        setToken(newToken);
        setRefreshToken(newRefreshToken);
      }
    );

    if (!response.ok) throw new Error('Failed to create');

    onSuccess();
    onClose();
  } catch (err: any) {
    setError(err.message || 'Something went wrong');
  }
  };

  return (
    <div className="create-form-container">
      <h3>Create {type.charAt(0).toUpperCase() + type.slice(1)}</h3>

      {error && <div className="create-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {type !== 'comment' && (
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        )}
        <textarea
          placeholder={type === 'subforum' ? 'Description' : 'Content'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="create-form-buttons">
          <button type="submit" className="create-submit">Create</button>
          <button type="button" className="create-cancel" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}