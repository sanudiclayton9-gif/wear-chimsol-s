"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    await addDoc(collection(db, "reviews"), {
      name: name.trim(),
      message: message.trim(),
      createdAt: serverTimestamp(),
    });
    setName("");
    setMessage("");
    setSending(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="review-sent">
        <p>Thank you — your feedback has been sent to us. 🙏</p>
      </div>
    );
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Your name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label>What did you think of our service?</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <button className="btn-wine" disabled={sending}>
        {sending ? "Sending..." : "Send feedback"}
      </button>
    </form>
  );
}
