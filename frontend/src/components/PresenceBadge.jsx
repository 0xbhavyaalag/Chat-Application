import clsx from 'clsx';

export default function PresenceBadge({ online, lastSeen }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <span
        className={clsx('h-2.5 w-2.5 rounded-full', online ? 'bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]' : 'bg-slate-500')}
      />
      <span>{online ? 'Online' : lastSeen || 'Offline'}</span>
    </div>
  );
}
