"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Design } from "@/lib/types";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking) return null;
  return user ? <Dashboard onLogout={() => signOut(auth)} /> : <Login />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Incorrect email or password.");
    }
    setLoading(false);
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <h1>Owner sign in</h1>
        <p>Sign in to add and manage designs on the site.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn-block" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const q = query(collection(db, "designs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setDesigns(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Design)));
    });
    return () => unsub();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const priceNum = Number(price);
    if (!title.trim() || !description.trim() || !imageUrl.trim() || !priceNum) {
      setFormError("Fill in every field with a valid price.");
      return;
    }
    setSaving(true);
    await addDoc(collection(db, "designs"), {
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      price: priceNum,
      likeCount: 0,
      createdAt: serverTimestamp(),
    });
    setTitle("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this design from the site?")) return;
    await deleteDoc(doc(db, "designs", id));
  }

  return (
    <>
      <div className="admin-bar">
        <h1>Wear Chimsol — owner dashboard</h1>
        <button className="admin-logout" onClick={onLogout}>
          Sign out
        </button>
      </div>

      <div className="admin-main">
        <div className="form-card">
          <h2>Add a new design</h2>
          <form onSubmit={handleAdd}>
            <div className="field">
              <label>Design name</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Price (USD)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Image URL</label>
              <input
                placeholder="Paste a link to the photo (e.g. uploaded to Google Photos, imgur)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            {formError && <p className="error-text">{formError}</p>}
            <button className="btn-block" disabled={saving}>
              {saving ? "Adding..." : "Add design"}
            </button>
          </form>
        </div>

        <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 14 }}>
          Current designs ({designs.length})
        </h2>
        <div className="admin-list">
          {designs.map((d) => (
            <div className="admin-row" key={d.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.imageUrl} alt={d.title} />
              <div className="admin-row-body">
                <h4>{d.title}</h4>
                <p>
                  ${d.price} · {d.likeCount ?? 0} likes
                </p>
              </div>
              <div className="admin-row-actions">
                <button
                  className="icon-btn danger"
                  onClick={() => handleDelete(d.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
