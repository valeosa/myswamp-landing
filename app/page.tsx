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
            modern software is becoming a third space.{"\u00a0"}
            <em>so why don&apos;t more productivity apps feel like it?</em>
          </h1>

          <p>
            I didn&apos;t want to build another tool so I&apos;m building a place:
            mySwamp.
          </p>

          <p>
            instead of just tracking habits, you dump your tasks into the swamp,
            and out of it comes the slimy, undeniable &lsquo;frog&rsquo;: the
            exact thing you need to do next.
          </p>

          <p>
            two options; done or not yet. either way, it sinks into your memory,
            just like sediment. no tags. no dashboards. no streaks.
          </p>
        </div>

        <section className="access-card" aria-label="early access">
          <div className="access-heading">
            <div className="mail-mark" aria-hidden="true">
              @
            </div>
            <div>
              <h2>{isDone ? "Thanks for joining the waitlist" : "No second brain. A second place."}</h2>
              <p>
                {isDone
                  ? "Check your email to confirm your spot. In the meantime, pass the waterline to someone who needs one frog."
                  : "Get early access and confirm your spot when mySwamp opens."}
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

        <footer className="landing-footer">
          <span>mySwamp © 2026</span>
        </footer>
      </section>
    </main>
  );
}
