import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Messaging.css';

export function Messaging() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {

  }, []);

  return (
    <div className="messaging-wrapper">
      <header className="messaging-header">
        <Link to="/" className="back-link">← Back to Forum</Link>
        <h1>Messages</h1>
      </header>

      <div className="messaging-container">
        <aside className="contacts-sidebar">
          <h3 className="contacts-title">Contacts</h3>
          <ul className="contact-list">
            {}
          </ul>
        </aside>
        
        <main className="chat-area">
          <div className="chat-header">
            <h3>{selectedContact ? 'Chat' : 'Select a contact to start messaging'}</h3>
          </div>
          <div className="chat-messages">
            {}
          </div>
          <div className="chat-input-area">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button className="chat-send-btn">Send</button>
          </div>
        </main>
      </div>
    </div>
  );
}