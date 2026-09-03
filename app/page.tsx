"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Design } from "@/lib/types";
import DesignCard from "@/components/DesignCard";
import OrderModal from "@/components/OrderModal";
import ReviewForm from "@/components/ReviewForm";
import { ADDRESS, BUSINESS_NAME, ECOCASH_NUMBER, waLink } from "@/lib/constants";

export default function Home() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderMode, setOrderMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "designs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setDesigns(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Design)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function removeSelected(id: string) {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  function toggleOrderMode() {
    setOrderMode((v) => !v);
    if (orderMode) setSelectedIds([]);
  }

  const selectedDesigns = useMemo(
    () => designs.filter((d) => selectedIds.includes(d.id)),
    [designs, selectedIds]
  );

  return (
    <>
      <header>
        <nav>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Wear Chimsol" style={{ height: 44 }} />
          <a
            className="nav-cta"
            target="_blank"
            rel="noopener noreferrer"
            href={waLink("Hi Wear Chimsol, I'd like to consult about a design.")}
          >
            Chat on WhatsApp
          </a>
        </nav>
      </header>

      <main>
        <section className="hero hero-watermark">
          <div className="stitch">
            <span /><span /><span /><span />
          </div>
          <h1>Tailored to you, made to last.</h1>
          <p>
            {BUSINESS_NAME} designs and sews made-to-order pieces at{" "}
            {ADDRESS.line2}, {ADDRESS.line1}, {ADDRESS.city}. Every piece is
            cut for your shape, not the other way around — bring us your idea,
            and we'll bring it to life.
          </p>
          <div className="hero-actions">
            <a
              className="btn-wine"
              target="_blank"
              rel="noopener noreferrer"
              href={waLink(
                "Hi Wear Chimsol, I'd like to consult about a custom design."
              )}
            >
              Consult on WhatsApp
            </a>
            <a className="btn-outline" href="#designs">
              View designs
            </a>
          </div>
        </section>

        <section id="designs">
          <div className="wrap">
            <div className="section-head">
              <h2>Our designs</h2>
              <p>Like a piece, leave a comment, order one, or order many at once.</p>
              <button className="btn-outline order-many-toggle" onClick={toggleOrderMode}>
                {orderMode ? "Cancel selecting" : "Order many"}
              </button>
            </div>

            {loading && <p className="empty">Loading designs...</p>}

            {!loading && designs.length === 0 && (
              <p className="empty">
                No designs yet — check back soon, we're adding new pieces
                regularly.
              </p>
            )}

            <div className="grid">
              {designs.map((d) => (
                <DesignCard
                  design={d}
                  key={d.id}
                  orderMode={orderMode}
                  selected={selectedIds.includes(d.id)}
                  onToggleSelect={toggleSelect}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="inspire">
          <div className="wrap">
            <div className="stitch"><span /><span /><span /><span /></div>
            <h2>Your style deserves a perfect fit.</h2>
            <p>
              Off-the-rack was never made for everyone. When you work with us,
              you're not choosing from what's left on a shelf — you're getting
              a piece built around you, from the fabric to the final stitch.
              Let's make something that's truly yours.
            </p>
          </div>
        </section>

        <section className="reviews">
          <div className="wrap">
            <div className="section-head">
              <h2>Tell us what you think</h2>
              <p>Your feedback goes straight to us — it helps us do better.</p>
            </div>
            <ReviewForm />
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-col">
          <div className="footer-row">
            <span>© {new Date().getFullYear()} {BUSINESS_NAME}</span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={waLink("Hi Wear Chimsol, I'd like to consult about a design.")}
            >
              WhatsApp: 077 517 8065
            </a>
          </div>
          <div className="footer-row footer-sub">
            <span>{ADDRESS.line2}, {ADDRESS.line1}, {ADDRESS.city}, {ADDRESS.country}</span>
            <span>EcoCash: {ECOCASH_NUMBER}</span>
          </div>
        </div>
      </footer>

      {orderMode && selectedIds.length > 0 && (
        <button className="order-bar" onClick={() => setShowOrderModal(true)}>
          {selectedIds.length} selected — Review order →
        </button>
      )}

      {showOrderModal && (
        <OrderModal
          designs={selectedDesigns}
          onRemove={removeSelected}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </>
  );
}
