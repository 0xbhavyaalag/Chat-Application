import clsx from 'clsx';
import PresenceBadge from './PresenceBadge';
import ThemeToggle from './ThemeToggle';

function ListItem({ active, title, subtitle, status, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'w-full rounded-2xl border px-4 py-3 text-left transition',
        active ? 'border-sky-500/60 bg-sky-500/10' : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-slate-100">{title}</div>
          <div className="mt-1 text-xs text-slate-400">{subtitle}</div>
        </div>
        {status ? <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{status}</div> : null}
      </div>
    </button>
  );
}

export default function Sidebar({ currentUser, users, rooms, active, onSelectUser, onSelectRoom, onCreateRoom, onLogout }) {
  return (
    <aside className="flex h-full w-full max-w-[360px] flex-col rounded-3xl border border-slate-800 bg-slate-950/75 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur lg:max-w-[380px]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-400">Realtime Chat</p>
          <h1 className="mt-1 text-xl font-semibold text-white">{currentUser?.username}</h1>
        </div>
        <ThemeToggle />
      </div>

      <div className="mb-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.username || 'User')}`}
            alt={currentUser?.username}
            className="h-12 w-12 rounded-2xl border border-slate-700 object-cover"
          />
          <div>
            <div className="font-medium text-slate-100">{currentUser?.username}</div>
            <div className="text-sm text-slate-400">{currentUser?.email}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <PresenceBadge online={currentUser?.isOnline} lastSeen={currentUser?.lastSeen} />
          <button type="button" onClick={onLogout} className="text-sm text-rose-300 transition hover:text-rose-200">
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-2 text-sm">
        <div className="rounded-xl bg-slate-950 px-3 py-2 text-center text-slate-200">People</div>
        <div className="rounded-xl bg-slate-950 px-3 py-2 text-center text-slate-200">Rooms</div>
      </div>

      <div className="scrollbar-thin mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
        <div className="space-y-2">
          <div className="px-1 text-xs uppercase tracking-[0.2em] text-slate-500">Direct Messages</div>
          {users.map((user) => (
            <ListItem
              key={user.id}
              active={active?.type === 'user' && active.id === user.id}
              title={user.username}
              subtitle={user.isOnline ? 'Online now' : user.lastSeen || 'Offline'}
              status={user.isOnline ? 'Live' : 'Away'}
              onClick={() => onSelectUser(user)}
            />
          ))}
        </div>

        <div className="space-y-2">
          <div className="px-1 text-xs uppercase tracking-[0.2em] text-slate-500">Rooms</div>
          {rooms.map((room) => (
            <ListItem
              key={room.id}
              active={active?.type === 'room' && active.id === room.id}
              title={room.roomName}
              subtitle={`${room.members?.length || 0} members`}
              status="Room"
              onClick={() => onSelectRoom(room)}
            />
          ))}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const roomName = String(formData.get('roomName') || '').trim();
          if (roomName) {
            onCreateRoom(roomName);
            event.currentTarget.reset();
          }
        }}
        className="mt-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-3"
      >
        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">Create room</label>
        <div className="flex gap-2">
          <input
            name="roomName"
            placeholder="Team alpha"
            className="min-w-0 flex-1 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
          />
          <button type="submit" className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Create
          </button>
        </div>
      </form>
    </aside>
  );
}
