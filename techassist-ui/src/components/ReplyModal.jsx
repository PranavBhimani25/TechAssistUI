import React from "react";

export default function ReplyModal({ onClose, onSend, reply, setReply }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-slate-900 w-full max-w-md rounded-xl border border-slate-800 p-5">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-blue-400">
            Add Comment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Textarea */}
        <textarea
          rows={4}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write your message..."
          className="w-full bg-slate-800 p-3 rounded-lg resize-none text-sm"
        />

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
