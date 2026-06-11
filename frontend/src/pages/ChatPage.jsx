import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useChatSocket } from '../hooks/useChatSocket';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageComposer from '../components/MessageComposer';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import { getLastSeenLabel } from '../utils/formatters';

export default function ChatPage() {
  const { user, token, logout, setUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingNames, setTypingNames] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const activeRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketHandlersRef = useRef(null);

  const { socketRef, connected } = useChatSocket(token);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    setConnectionStatus(connected);
  }, [connected]);

  useEffect(() => {
    async function loadData() {
      const [usersResponse, roomsResponse] = await Promise.all([api.get('/users'), api.get('/rooms')]);
      setUsers(usersResponse.data.users.map((item) => ({ ...item, lastSeen: item.lastSeen ? getLastSeenLabel(item.lastSeen) : 'Offline' })));
      setRooms(roomsResponse.data.rooms.map((room) => ({
        id: room._id,
        roomName: room.roomName,
        members: room.members || [],
        createdBy: room.createdBy,
      })));
    }

    loadData().catch(() => {});
  }, []);

  useEffect(() => {
    if (!connected || !socketRef.current) {
      return undefined;
    }

    const socket = socketRef.current;

    const handleReceiveMessage = (message) => {
      const current = activeRef.current;
      const isRoomMatch = current?.type === 'room' && String(message.roomId?._id || message.roomId) === String(current.id);
      const isPrivateMatch = current?.type === 'user' && (
        String(message.sender?._id || message.sender) === String(current.id) ||
        String(message.receiver?._id || message.receiver) === String(current.id)
      );

      if (isRoomMatch || isPrivateMatch) {
        setMessages((currentMessages) => [...currentMessages, message]);
      }
    };

    const handleTyping = ({ userId, username, roomId }) => {
      const current = activeRef.current;
      const matchesRoom = current?.type === 'room' && String(current.id) === String(roomId);
      const matchesUser = current?.type === 'user' && String(current.id) === String(userId);
      if (matchesRoom || matchesUser) {
        setTypingNames((currentNames) => (currentNames.includes(username) ? currentNames : [...currentNames, username]));
      }
    };

    const handleStoppedTyping = ({ username }) => {
      setTypingNames((currentNames) => currentNames.filter((name) => name !== username));
    };

    const handlePresence = (presence) => {
      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          String(item.id) === String(presence.userId)
            ? { ...item, isOnline: presence.isOnline, lastSeen: presence.lastSeen ? getLastSeenLabel(presence.lastSeen) : item.lastSeen }
            : item
        )
      );
      if (String(user?.id) === String(presence.userId)) {
        setUser((currentUser) => (currentUser ? { ...currentUser, isOnline: presence.isOnline, lastSeen: presence.lastSeen || currentUser.lastSeen } : currentUser));
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleTyping);
    socket.on('user_stopped_typing', handleStoppedTyping);
    socket.on('user_online', handlePresence);
    socket.on('user_offline', handlePresence);

    socketHandlersRef.current = {
      handleReceiveMessage,
      handleTyping,
      handleStoppedTyping,
      handlePresence,
    };

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleTyping);
      socket.off('user_stopped_typing', handleStoppedTyping);
      socket.off('user_online', handlePresence);
      socket.off('user_offline', handlePresence);
    };
  }, [connected, user?.id, setUser]);

  async function selectUser(selectedUser) {
    setActive({
      type: 'user',
      id: selectedUser.id,
      name: selectedUser.username,
      avatar: selectedUser.avatar,
      isOnline: selectedUser.isOnline,
      lastSeen: selectedUser.lastSeen,
      subtitle: selectedUser.email,
    });
    setMessages([]);
    setTypingNames([]);
    setPage(1);
    setLoadingMessages(true);

    try {
      const response = await api.get(`/messages/private/${selectedUser.id}`);
      setMessages(response.data.items);
      setHasMore(response.data.total > response.data.items.length);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function selectRoom(selectedRoom) {
    setActive({
      type: 'room',
      id: selectedRoom.id,
      roomName: selectedRoom.roomName,
      members: selectedRoom.members,
      avatar: selectedRoom.avatar,
    });
    setMessages([]);
    setTypingNames([]);
    setPage(1);
    setLoadingMessages(true);

    try {
      await api.post(`/rooms/${selectedRoom.id}/join`);
      socketRef.current?.emit('join_room', { roomId: selectedRoom.id });
      const response = await api.get(`/messages/room/${selectedRoom.id}`);
      setMessages(response.data.items);
      setHasMore(response.data.total > response.data.items.length);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleCreateRoom(roomName) {
    const response = await api.post('/rooms', { roomName });
    const nextRoom = {
      id: response.data.room._id,
      roomName: response.data.room.roomName,
      members: response.data.room.members || [],
      createdBy: response.data.room.createdBy,
    };
    setRooms((currentRooms) => [nextRoom, ...currentRooms]);
    await selectRoom(nextRoom);
  }

  async function sendMessage(content) {
    if (!active) {
      return;
    }

    const payload = active.type === 'room'
      ? { roomId: active.id, content }
      : { receiverId: active.id, content };

    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit('send_message', payload, (response) => {
        if (response?.success && activeRef.current) {
          setMessages((currentMessages) => [...currentMessages, response.message]);
        }
      });
      return;
    }

    const response = await api.post('/messages', payload);
    setMessages((currentMessages) => [...currentMessages, response.data.message]);
  }

  async function loadOlderMessages() {
    if (!active) {
      return;
    }

    const nextPage = page + 1;
    setLoadingMessages(true);
    try {
      const response = active.type === 'room'
        ? await api.get(`/messages/room/${active.id}`, { params: { page: nextPage } })
        : await api.get(`/messages/private/${active.id}`, { params: { page: nextPage } });
      setMessages((currentMessages) => [...response.data.items, ...currentMessages]);
      setPage(nextPage);
      setHasMore(response.data.total > nextPage * response.data.limit);
    } finally {
      setLoadingMessages(false);
    }
  }

  function handleTyping() {
    if (!active) {
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    socket.emit('typing', active.type === 'room' ? { roomId: active.id } : { receiverId: active.id });
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', active.type === 'room' ? { roomId: active.id } : { receiverId: active.id });
    }, 1200);
  }

  function handleStopTyping() {
    if (!active || !socketRef.current) {
      return;
    }

    socketRef.current.emit('stop_typing', active.type === 'room' ? { roomId: active.id } : { receiverId: active.id });
  }

  const activeTitle = useMemo(() => active?.name || active?.roomName || '', [active]);

  if (!user) {
    return <Loader fullScreen label="Preparing chat..." />;
  }

  return (
    <div className="min-h-screen px-3 py-3 md:px-5 md:py-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-7xl gap-4 lg:grid-cols-[360px_1fr]">
        <Sidebar
          currentUser={user}
          users={users}
          rooms={rooms}
          active={active}
          onSelectUser={selectUser}
          onSelectRoom={selectRoom}
          onCreateRoom={handleCreateRoom}
          onLogout={logout}
        />

        <main className="flex min-h-0 flex-col gap-4">
          <ChatHeader
            active={active}
            connectionStatus={connectionStatus}
            onJoinRoom={() => active?.type === 'room' && socketRef.current?.emit('join_room', { roomId: active.id })}
            onLeaveRoom={() => active?.type === 'room' && socketRef.current?.emit('leave_room', { roomId: active.id })}
          />

          <div className="grid min-h-0 flex-1 gap-4 lg:grid-rows-[1fr_auto]">
            {active ? (
              <>
                <MessageList
                  messages={messages}
                  currentUserId={user.id}
                  typingNames={typingNames}
                  loading={loadingMessages}
                  onLoadOlder={loadOlderMessages}
                  hasMore={hasMore}
                />
                <MessageComposer onSend={sendMessage} onTyping={handleTyping} onStopTyping={handleStopTyping} disabled={!activeTitle} />
              </>
            ) : (
              <EmptyState title="No conversation selected" description="Pick a user or room from the sidebar to load chat history and start messaging." />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
