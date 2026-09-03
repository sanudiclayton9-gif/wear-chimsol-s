"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Design, Comment } from "@/lib/types";
import { waLink } from "@/lib/constants";

export default function DesignCard({
  design,
  orderMode,
  selected,
  onToggleSelect,
}: {
  design: Design;
  orderMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const likedKey = `liked:${design.id}`;
    setLiked(localStorage.getItem(likedKey) === "1");
  }, [design.id]);

  useEffect(() => {
    if (!showComments) return;
    const q = query(
      collection(db, "designs", design.id, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment))
      );
    });
    return () => unsub();
  }, [showComments, design.id]);

  async function handleLike() {
    const likedKey = `liked:${design.id}`;
    const alreadyLiked = localStorage.getItem(likedKey) === "1";
    const ref = doc(db, "designs", design.id);
    if (alreadyLiked) {
      await updateDoc(ref, { likeCount: increment(-1) });
      localStorage.removeItem(likedKey);
      setLiked(false);
    } else {
      await updateDoc(ref, { likeCount: increment(1) });
      localStorage.setItem(likedKey, "1");
      setLiked(true);
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setPosting(true);
    await addDoc(collection(db, "designs", design.id, "comments"), {
      name: name.trim(),
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
    setText("");
    setPosting(false);
  }

  const priceLabel = `$${design.price.toFixed(0)}`;

  return (
    <div className={`card ${selected ? "card-selected" : ""}`}>
      <div className="card-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={design.imageUrl} alt={design.title} loading="lazy" />
        {orderMode && (
          <button
            type="button"
            className={`select-badge ${selected ? "on" : ""}`}
            onClick={() => onToggleSelect?.(design.id)}
            aria-pressed={selected}
            aria-label={selected ? "Remove from order" : "Add to order"}
          >
            {selected ? "✓" : "+"}
          </button>
        )}
      </div>
      <div className="card-body">
        <h3>{design.title}</h3>
        <p className="desc">{design.description}</p>
        <div className="price">{priceLabel}</div>

        <div className="card-actions">
          <button
            className={`like-btn ${liked ? "liked" : ""}`}
            onClick={handleLike}
            aria-pressed={liked}
          >
            {liked ? "♥" : "♡"} {design.likeCount ?? 0}
          </button>
          <button
            className="comment-toggle"
            onClick={() => setShowComments((v) => !v)}
          >
            {showComments ? "Hide comments" : `Comments (${comments.length || ""})`}
          </button>
          {!orderMode && (
            <a
              className="order-btn"
              target="_blank"
              rel="noopener noreferrer"
              href={waLink(
                `Hi Wear Chimsol, I'd like to order/consult about "${design.title}" (${priceLabel}).`
              )}
            >
              Order on WhatsApp
            </a>
          )}
        </div>

        {showComments && (
          <div className="comments">
            {comments.length === 0 && (
              <p style={{ color: "var(--ink-soft)", fontSize: 13 }}>
                No comments yet — be the first to say something.
              </p>
            )}
            {comments.map((c) => (
              <div className="comment" key={c.id}>
                <b>{c.name}</b> <span>— {c.text}</span>
              </div>
            ))}
            <form className="comment-form" onSubmit={handleComment}>
              <input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <textarea
                placeholder="Add a comment"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
              <button type="submit" disabled={posting}>
                {posting ? "Posting..." : "Post comment"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
