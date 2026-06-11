import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import Loader from './Loader';

export default function MessageList({ messages, currentUserId, typingNames, loading, onLoadOlder, hasMore }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingNames]);

  if (loading) {
    return <Loader label="Loading messages..." />;
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 shadow-2xl shadow-slate-950/40 backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <span className="text-sm text-slate-400">Chat history</span>
        {hasMore ? (
          <button type="button" onClick={onLoadOlder} className="text-sm text-sky-400 transition hover:text-sky-300">
            Load older
          </button>
        ) : null}
      </div>
      <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.length === 0 ? (
          <div className="grid h-full place-items-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 text-center text-sm text-slate-500">
            Start the conversation with a message.
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id || message._id} message={message} isMine={String(message.sender?._id || message.sender) === String(currentUserId)} />
          ))
        )}
        <TypingIndicator names={typingNames} />
        <div ref={endRef} />
      </div>
    </div>
  );
}
