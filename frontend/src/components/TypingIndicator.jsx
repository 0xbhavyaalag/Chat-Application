export default function TypingIndicator({ names = [] }) {
  if (!names.length) {
    return null;
  }

  return (
    <div className="mx-4 mb-3 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-100">
      {names.join(', ')} {names.length > 1 ? 'are' : 'is'} typing...
    </div>
  );
}
