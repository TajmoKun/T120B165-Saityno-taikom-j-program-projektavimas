import { useState, useEffect } from "react";
import { SubForumsList } from "../components/SubforumsList";
import { PostsList } from "../components/PostsList";
import "./MainPage.css";

function MainPage() {
  const [selectedSubforumId, setSelectedSubforumId] = useState<number>(-1);
  const [selectedPostId, setSelectedPostId] = useState<number>(-1);

  useEffect(() => {
    setSelectedPostId(-1);
  }, [selectedSubforumId]);

  return (
    <div className="forum-layout">
      <header className="forum-header">
        <h1>Forum App</h1>
      </header>

      <div className="forum-content">
        <aside className="forum-sidebar">
          <SubForumsList onSelect={setSelectedSubforumId} />
        </aside>

        <main className="forum-main">
          {selectedSubforumId === -1 ? (
            <div className="welcome-message">
              <h2>Welcome to the Forum!</h2>
              <p>Select a subforum to view posts</p>
            </div>
          ) : (
            <PostsList
              subforumId={selectedSubforumId}
              selectedPostId={selectedPostId}
              onSelect={setSelectedPostId}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default MainPage;