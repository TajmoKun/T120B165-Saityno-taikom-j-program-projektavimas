import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SubForumsList } from "../components/SubforumsList";
import { PostsList } from "../components/PostsList";
import { AuthModal } from "../components/AuthModal";
import { UserPanel } from "../components/UserPanel";
import { useGlobal } from "../context/GlobalContext";
import { logout } from "../api/auth";
import "./MainPage.css";

function MainPage() {
  const [selectedSubforumId, setSelectedSubforumId] = useState<number>(-1);
  const [selectedPostId, setSelectedPostId] = useState<number>(-1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, token, setUser, setToken, host, isLoggedIn,refreshToken,setRefreshToken } = useGlobal();
  const isAdmin = user?.role === 'admin';
  
  useEffect(() => {
    setSelectedPostId(-1);
  }, [selectedSubforumId]);

  const handleLogout = async () => {
    try {
      if (token) {
        await logout(host, token);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="forum-layout">
      <header className="forum-header">
        {isAdmin && (
          <Link to="/admin" className="admin-link">🛡️ Admin</Link>
        )}
        <h1>Veddit</h1>
        <div className="header-actions">
          {isLoggedIn ? (
            <div className="user-info">
              <span>Welcome, {user?.username}</span>
              <Link to="/messages" className="messages-link">💬 Messages</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="login-btn">
              Login / Register
            </button>
          )}
        </div>
      </header>

      <div className="forum-content">
        <aside className="forum-sidebar">
          {isLoggedIn && (
            <UserPanel onSelectSubforum={setSelectedSubforumId} />
          )}
          <SubForumsList key={refreshKey} onSelect={setSelectedSubforumId} />
        </aside>

        <main className="forum-main">
          {selectedSubforumId === -1 ? (
            <div className="welcome-message">
              <h2>Welcome to the Forum!</h2>
              <p>Select a subforum to view posts</p>
              {!isLoggedIn && (
                <p className="login-prompt">
                  <span onClick={() => setShowAuthModal(true)}>Login</span> to create your own subforums, posts, and comments!
                </p>
              )}
            </div>
          ) : (
            <PostsList
              subforumId={selectedSubforumId}
              selectedPostId={selectedPostId}
              onSelect={setSelectedPostId}
              onRefresh={handleRefresh}
            />
          )}
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default MainPage;