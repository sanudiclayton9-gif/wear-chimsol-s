"use client";

import { useState } from "react";
import { Design } from "@/lib/types";
import { ECOCASH_NUMBER, waLink } from "@/lib/constants";

export default function OrderModal({
  designs,
  onRemove,
  onClose,
}: {
  designs: Design[];
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  const [measurements, setMeasurements] = useState("");

  const total = designs.reduce((sum, d) => sum + d.price, 0);

  function handleSend() {
    const lines = designs.map(
      (d, i) => `${i + 1}. ${d.title} — $${d.price.toFixed(0)}`
    );
    const photoLines = designs.map(
      (d, i) => `${i + 1}. ${d.imageUrl}`
    );

    const message = [
      `Hi Wear Chimsol, I'd like to order the following designs:`,
      ``,
      ...lines,
      ``,
      `Total: $${total.toFixed(0)} for ${designs.length} item${designs.length === 1 ? "" : "s"}`,
      measurements.trim() ? `` : null,
      measurements.trim() ? `My measurements: ${measurements.trim()}` : null,
      ``,
      `I'll pay via EcoCash to ${ECOCASH_NUMBER}.`,
      ``,
      `Photos of the designs:`,
      ...photoLines,
    ]
      .filter((l) => l !== null)
      .join("\n");

    window.open(waLink(message), "_blank");
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Your order ({designs.length})</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {designs.length === 0 ? (
          <p style={{ color: "var(--ink-soft)", padding: "20px 0" }}>
            No designs selected yet — tap the + on any design to add it.
          </p>
        ) : (
          <>
            <div className="modal-list">
              {designs.map((d) => (
                <div className="modal-item" key={d.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.imageUrl} alt={d.title} />
                  <div className="modal-item-body">
                    <span>{d.title}</span>
                    <b>${d.price.toFixed(0)}</b>
                  </div>
                  <button
                    className="modal-item-remove"
                    onClick={() => onRemove(d.id)}
                    aria-label={`Remove ${d.title}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="modal-total">
              <span>Total</span>
              <b>${total.toFixed(0)}</b>
            </div>

            <div className="field">
              <label>Your measurements (optional)</label>
              <textarea
                placeholder="e.g. Bust 34in, Waist 28in, Hips 38in, Height 5'6&quot;"
                value={measurements}
                onChange={(e) => setMeasurements(e.target.value)}
              />
            </div>

            <p className="modal-note">
              We'll open WhatsApp with your order, total, and a link to each
              design's photo. Pay via EcoCash to <b>{ECOCASH_NUMBER}</b>.
            </p>

            <button className="btn-block" onClick={handleSend}>
              Send order via WhatsApp
            </button>
          </>
        )}
      </div>
    </div>
  );
}
