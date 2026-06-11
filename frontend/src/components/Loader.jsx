export default function Loader({ fullScreen = false, label = 'Loading...' }) {
  const content = (
    <div className="flex items-center gap-3 text-slate-300">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-sky-400" />
      <span className="text-sm">{label}</span>
    </div>
  );

  if (fullScreen) {
    return <div className="grid min-h-screen place-items-center bg-slate-950">{content}</div>;
  }

  return content;
}
