import clsx from 'clsx';
import { formatMessageTime } from '../utils/formatters';

export default function MessageBubble({ message, isMine }) {
  return (
    <div className={clsx('flex message-fade', isMine ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[82%] rounded-3xl px-4 py-3 shadow-lg',
          isMine
            ? 'bg-gradient-to-br from-sky-500 to-cyan-400 text-slate-950'
            : 'border border-slate-800 bg-slate-900/90 text-slate-100'
        )}
      >
        <div className="mb-1 flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] opacity-70">
          <span>{isMine ? 'You' : message.sender?.username || 'Member'}</span>
          <span>{formatMessageTime(message.createdAt)}</span>
        </div>
        <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p>
        <div className="mt-2 text-right text-[11px] opacity-70">{message.status}</div>
      </div>
    </div>
  );
}
