import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminContent.css';

export function AdminContent() {
  const [activeTab, setActiveTab] = useState<'subforums' | 'posts' | 'comments'>('subforums');

  return (
    <div className="admin-wrapper">
      <header className="admin-header">
        <Link to="/" className="back-link">← Back to Forum</Link>
        <h1>Admin Panel - Content Management</h1>
      </header>

      <div className="admin-content-panel">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'subforums' ? 'active' : ''}`}
            onClick={() => setActiveTab('subforums')}
          >
            Subforums
          </button>
          <button 
            className={`admin-tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button 
            className={`admin-tab ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Comments
          </button>
        </div>
        
        <table className="content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title/Content</th>
              <th>Author</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {}
          </tbody>
        </table>
      </div>
    </div>
  );
}