import { useState } from 'react';

export default function MessageComposer({ onSend, onTyping, onStopTyping, disabled }) {
  const [value, setValue] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const content = value.trim();
    if (!content) {
      return;
    }

    onSend(content);
    setValue('');
    onStopTyping?.();
  }

  function handleChange(event) {
    setValue(event.target.value);
    if (event.target.value.trim()) {
      onTyping?.();
    } else {
      onStopTyping?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-3 shadow-xl shadow-slate-950/20">
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
          }
        }}
        placeholder={disabled ? 'Select a chat to start messaging' : 'Write a message...'}
        disabled={disabled}
        rows={1}
        className="max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-500"
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
