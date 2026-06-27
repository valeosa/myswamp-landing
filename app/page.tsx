"use client";

import Image from "next/image";
import { useState } from "react";

type SubmitState = "idle" | "submitting" | "pending" | "confirmed" | "error";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setMessage("enter a valid email address.");
      setSubmitState("error");
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const result = (await response.json()) as {
        status?: "pending" | "confirmed";
        message?: string;
      };

      if (!response.ok || !result.status) {
        throw new Error("Waitlist submission failed");
      }

      setSubmitState(result.status);
      setMessage(result.message ?? "");
    } catch {
      setSubmitState("error");
      setMessage("something went swampy. try again.");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  };

  const isWaiting = submitState === "submitting";
  const isDone = submitState === "pending" || submitState === "confirmed";

  return (
    <main className="landing-page">
      <section className="landing-shell" aria-label="mySwamp waitlist">
        <header className="brand-row">
          <Image
            src="/swamp-favicon.png"
            alt=""
            width={48}
            height={48}
            priority
            className="brand-mark"
          />
          <span className="brand-name">mySwamp</span>
        </header>

        <div className="hero-copy">
          <h1>
           you have enough decisions today.{"\u00a0"}
            <em>picking your next task shouldn’t be one of them.</em>
          </h1>
        
          <p>
             to-do apps give you a place to neatly put everything and leave the hardest part to you: 
             picking what actually matters right now. mySwamp does that part. 
             Dump everything in, get back the one to do next.
          </p>

          <p>
            two options: done or not yet. either way, it sinks out of sight, 
           leaving your mind clearer. 
 </p>

        </div>

        <section className="access-card" aria-label="early access">
          <div className="access-heading">
            <div className="mail-mark" aria-hidden="true">
              @
            </div>
            <div>
              <h2>{isDone ? "Thanks for joining the waitlist" : "one less decision every day."}</h2>
              <p>
                {isDone
                  ? "check your email to confirm your spot. In the meantime, pass the waterline to someone who needs one frog."
                  : "no priority sorting. no tagging. no deciding which list to open first. just one frog."}
              </p>
            </div>
          </div>

          {!isDone ? (
            <form onSubmit={handleSubmit} noValidate className="waitlist-form">
              <input
                type="email"
                placeholder="you@somewhere.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (submitState === "error") {
                    setSubmitState("idle");
                    setMessage("");
                  }
                }}
                aria-label="Email address"
                aria-describedby={message ? "waitlist-message" : undefined}
                disabled={isWaiting}
              />

              <button type="submit" disabled={isWaiting}>
                {isWaiting ? "sending..." : "get early access."}
              </button>
            </form>
          ) : (
            <button className="copy-link" type="button" onClick={copyLink}>
              {copyState === "copied"
                ? "copied"
                : copyState === "error"
                  ? "copy failed"
                  : "copy link"}
            </button>
          )}

          {message && (
            <p
              className={submitState === "error" ? "form-message error" : "form-message"}
              id="waitlist-message"
              role={submitState === "error" ? "alert" : "status"}
            >
              {message}
            </p>
          )}
        </section>

        <footer className="landing-footer">
          <span>mySwamp © 2026</span>
        </footer>
      </section>
    </main>
  );
}
