
import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import './App.css';

interface ChatUser {
  id: string;
  username: string;
}

interface PrivateMessage {
  id: string;
  senderId: string;
  recipientId: string;
  username: string;
  message: string;
  timestamp: string;
}

function App() {
  const socket = useRef<Socket | null>(null);

  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<ChatUser | null>(null);

  // Each user's conversation is stored separately.
  const [conversations, setConversations] =
    useState<Record<string, PrivateMessage[]>>({});

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const s = io('http://localhost:3000');
    socket.current = s;

    s.on('connect', () => setConnected(true));

    s.on('disconnect', () => {
      setConnected(false);
      setJoined(false);
      setUsers([]);
      setSelectedUser(null);
    });

    s.on('usersUpdate', (data: ChatUser[]) => {
      setUsers(data);
    });

    s.on(
      'privateHistory',
      (data: {
        recipientId: string;
        messages: PrivateMessage[];
      }) => {
        setConversations((previous) => ({
          ...previous,
          [data.recipientId]: data.messages,
        }));
      },
    );

    s.on(
      'privateMessageReceived',
      (chatMessage: PrivateMessage) => {
        const myId = s.id;

        const partnerId =
          chatMessage.senderId === myId
            ? chatMessage.recipientId
            : chatMessage.senderId;

        setConversations((previous) => ({
          ...previous,
          [partnerId]: [
            ...(previous[partnerId] ?? []),
            chatMessage,
          ],
        }));
      },
    );

    s.on('chatError', (text: string) => setError(text));

    return () => {
      s.removeAllListeners();
      s.disconnect();
      socket.current = null;
    };
  }, []);

  const joinChat = (event: React.FormEvent) => {
    event.preventDefault();

    const cleanName = username.trim();

    if (!cleanName || !socket.current?.connected) return;

    setError('');
    socket.current.emit('joinChat', cleanName);
    setJoined(true);
  };

  const openConversation = (user: ChatUser) => {
    setSelectedUser(user);
    setError('');

    socket.current?.emit('getPrivateHistory', user.id);
  };

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !message.trim() ||
      !selectedUser ||
      !socket.current?.connected
    ) {
      return;
    }

    socket.current.emit('privateMessage', {
      recipientId: selectedUser.id,
      message: message.trim(),
    });

    setMessage('');
  };

  if (!joined) {
    return (
      <main className="join-page">
        <form className="join-card" onSubmit={joinChat}>
          <h1>💬 Private Chat</h1>
          <p>Enter your username to continue.</p>

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            maxLength={30}
            required
          />

          {error && <p className="error">{error}</p>}

          <button disabled={!connected || !username.trim()}>
            {connected ? 'Join Chat' : 'Connecting...'}
          </button>
        </form>
      </main>
    );
  }

  const currentMessages = selectedUser
    ? conversations[selectedUser.id] ?? []
    : [];

  return (
    <main className="chat-layout">
      <aside className="sidebar">
        <h2>Private Chat</h2>

        <p className="connection">
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </p>

        <h3>Online users ({users.length})</h3>

        {users
          .filter((user) => user.id !== socket.current?.id)
          .map((user) => (
            <button
              className={`user-item ${
                selectedUser?.id === user.id ? 'active' : ''
              }`}
              key={user.id}
              onClick={() => openConversation(user)}
            >
              <span className="online-dot" />
              {user.username}
            </button>
          ))}

        {users.length <= 1 && (
          <p className="hint">Waiting for another user...</p>
        )}
      </aside>

      <section className="chat-panel">
        {selectedUser ? (
          <>
            <header className="chat-top">
              <h2>{selectedUser.username}</h2>
              <p>Private conversation</p>
            </header>

            <div className="messages">
              {currentMessages.length === 0 && (
                <p className="empty">
                  No messages yet. Say hello! 👋
                </p>
              )}

              {currentMessages.map((item) => {
                const mine =
                  item.senderId === socket.current?.id;

                return (
                  <article
                    className={`message ${mine ? 'mine' : ''}`}
                    key={item.id}
                  >
                    <div className="message-info">
                      <strong>
                        {mine ? 'You' : item.username}
                      </strong>
                      <time>{item.timestamp}</time>
                    </div>

                    <p>{item.message}</p>
                  </article>
                );
              })}
            </div>

            <form
              className="message-form"
              onSubmit={sendMessage}
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Message ${selectedUser.username}...`}
                maxLength={1000}
                required
              />

              <button
                disabled={!connected || !message.trim()}
              >
                Send
              </button>
            </form>

            {error && <p className="error">{error}</p>}
          </>
        ) : (
          <div className="empty-chat">
            <h2>Select a user</h2>
            <p>Choose someone online to start a private chat.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
