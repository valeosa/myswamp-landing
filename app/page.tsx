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
      await navigator.clipboard.writeText("https://myswamp.space");
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
            width={58}
            height={58}
            priority
            className="brand-mark"
          />
          <span className="brand-name">mySwamp</span>
        </header>

        <div className="hero-copy">
          <h1>
            what matters is
            <br />
            <em>what you do next.</em>
          </h1>

          <p>
            mySwamp turns a messy task dump into the exact thing you need to do
            next: the frog.
          </p>

          <p>
            two options: done, or not yet. either way, it sinks into your
            water&apos;s memory. no tags. no dashboards. no streaks.
          </p>
        </div>

        <div className="signal-card" aria-label="mySwamp promise">
          <Image src="/swamp-favicon.png" alt="" width={44} height={44} />
          <div>
            <div className="signal-title">One frog. No second brain.</div>
            <p>Dump the noise. Let the swamp surface what comes next.</p>
          </div>
          <span aria-hidden="true">now</span>
        </div>

        <section className="access-card" aria-label="early access">
          <div className="access-heading">
            <div className="mail-mark" aria-hidden="true">
              @
            </div>
            <div>
              <h2>{isDone ? "Thanks for joining the waitlist" : "Be first into the swamp"}</h2>
              <p>
                {isDone
                  ? "Check your email to confirm your spot. In the meantime, pass the waterline to someone who needs one frog."
                  : "Get early access and confirm your spot when mySwamp opens."}
              </p>
            </div>
            <span aria-hidden="true">now</span>
          </div>

          {!isDone ? (
            <form onSubmit={handleSubmit} noValidate className="waitlist-form">
              <input
                type="email"
                placeholder="myswamp@somewhere.com"
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

              <button type="submit" disabled={isWaiting || !email.trim()}>
                {isWaiting ? "sending..." : "get early access"}
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

        <p className="closing-line">because one meaningful thing is enough.</p>

        <footer className="landing-footer">
          <span>mySwamp © 2026</span>
          <nav aria-label="legal links">
            <a href="/terms">terms</a>
            <span>·</span>
            <a href="/privacy">privacy</a>
            <span>·</span>
            <a href="https://threads.net/@myswamp" rel="noreferrer">
              threads
            </a>
          </nav>
        </footer>
      </section>
    </main>
  );
}
