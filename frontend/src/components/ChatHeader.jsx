import PresenceBadge from './PresenceBadge';

export default function ChatHeader({ active, connectionStatus, onJoinRoom, onLeaveRoom }) {
  if (!active) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 px-5 py-4 text-sm text-slate-400 shadow-2xl shadow-slate-950/40 backdrop-blur">
        Select a user or room to start chatting.
      </div>
    );
  }

  const isRoom = active.type === 'room';

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 px-5 py-4 shadow-2xl shadow-slate-950/40 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <img
          src={active.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(active.name || active.roomName || 'Chat')}`}
          alt={active.name || active.roomName}
          className="h-12 w-12 rounded-2xl border border-slate-700 object-cover"
        />
        <div>
          <div className="text-lg font-semibold text-white">{active.name || active.roomName}</div>
          <div className="text-sm text-slate-400">{isRoom ? `${active.members?.length || 0} members` : active.subtitle}</div>
          {!isRoom ? <PresenceBadge online={active.isOnline} lastSeen={active.lastSeen} /> : null}
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span>{connectionStatus ? 'Connected' : 'Reconnecting...'}</span>
        {isRoom ? (
          <>
            <button type="button" onClick={onJoinRoom} className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-sky-400">
              Join
            </button>
            <button type="button" onClick={onLeaveRoom} className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-rose-400">
              Leave
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
