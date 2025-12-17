import React, { useEffect, useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { CreateForm } from './CreateForm';
import './UserPanel.css';

type UserPanelProps = {
  onSelectSubforum: (id: number) => void;
};

export function UserPanel({ onSelectSubforum }: UserPanelProps) {
  const [userSubforums, setUserSubforums] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { host, user, token } = useGlobal();

  const fetchUserSubforums = async () => {
    try {
      const response = await fetch(`${host}/api/subforums`);
      const data = await response.json();
      const filtered = data.filter((sf: any) => sf.userid === user?.id);
      setUserSubforums(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserSubforums();
    }
  }, [user, host]);

  const handleCreateSuccess = () => {
    fetchUserSubforums();
  };

  if (!user) return null;

  return (
    <div className="user-panel">
      <h3>My Subforums</h3>

      <button className="create-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Cancel' : '+ Create Subforum'}
      </button>

      {showCreateForm && (
        <CreateForm
          type="subforum"
          onSuccess={handleCreateSuccess}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      <ul className="user-subforums-list">
        {userSubforums.length === 0 ? (
          <li className="no-subforums">You haven't created any subforums yet</li>
        ) : (
          userSubforums.map((sf) => (
            <li key={sf.id}>
              <button onClick={() => onSelectSubforum(sf.id)}>{sf.title}</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}