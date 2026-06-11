export default function EmptyState({ title, description }) {
  return (
    <div className="grid h-full min-h-[420px] place-items-center rounded-3xl border border-dashed border-slate-800 bg-slate-950/50 px-6 text-center">
      <div>
        <div className="text-lg font-semibold text-white">{title}</div>
        <div className="mt-2 text-sm text-slate-400">{description}</div>
      </div>
    </div>
  );
}
