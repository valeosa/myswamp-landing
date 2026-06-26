"use client";

import { useEffect, useState } from "react";

type SubmitState = "idle" | "submitting" | "pending" | "confirmed" | "error";

function logEvent(name: string, properties?: Record<string, unknown>) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, properties }),
  }).catch(() => {});
}

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setMessage("enter a valid email address.");
      setSubmitState("error");
      return;
    }

    logEvent("waitlist_submit_attempt");
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
      logEvent("waitlist_submit_success", { status: result.status });
      setMessage(result.message ?? "");
    } catch {
      setSubmitState("error");
      setMessage("something went swampy. try again.");
    }
  };

  const formDone = submitState === "pending" || submitState === "confirmed";

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black: #07100b;
          --deep: #0b1710;
          --green-dark: #1a2a1a;
          --green-muted: #4a6b4a;
          --green-pale: #8aab8a;
          --cream: #d4c9b0;
          --cream-dim: #a09080;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--cream);
          font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
        }

        a { color: var(--green-pale); }

        .wrap {
          max-width: 640px;
          margin: 0 auto;
          padding: 0 clamp(1.5rem, 6vw, 2.5rem);
        }

        .topbar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 2.5rem 0 0;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 1s ease, transform 1s ease;
        }
        .topbar.visible { opacity: 1; transform: translateY(0); }

        .mark {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: var(--green-dark);
          border: 1px solid var(--green-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .mark svg { width: 18px; height: 18px; }

        .wordmark {
          font-size: 0.95rem;
          letter-spacing: -0.01em;
        }

        .hero {
          padding: clamp(3.5rem, 10vw, 6rem) 0 1rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1.1s ease 0.15s, transform 1.1s ease 0.15s;
           text-align: center;
        }
        .hero.visible { opacity: 1; transform: translateY(0); }

        .hero-headline {
          font-size: clamp(2.4rem, 6vw, 3.6rem);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: var(--cream);
        }

        .hero-headline em {
          font-style: italic;
          color: var(--green-pale);
        }

        .hero-lede {
          margin-top: 1.5rem;
          max-width: 30rem;
          font-size: 1rem;
          line-height: 1.7;
          color: #c4b89f;
margin-left: auto;
margin-right: auto;
        }

        .hero-lede + .hero-lede { margin-top: 0.9rem; }

     
        .divider {
          height: 1px;
          background: var(--green-dark);
          margin: clamp(3rem, 8vw, 4.5rem) 0;
        }

        .section-label {
          font-size: 0.65rem;
          letter-spacing: 0.28em;
          color: var(--green-muted);
          text-transform: uppercase;
          margin-bottom: 1.6rem;
        }

       .cta-group {
  margin-top: 2rem;
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  align-items: center;
}

.cta-primary {
  font-family: inherit;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  color: var(--black);
  background: var(--cream);
  border: none;
  padding: 0.95rem 2.1rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  border-radius: 2px;
  width: 100%;
  text-align: center;
}
.cta-primary:disabled {
  opacity: 0.55;
  cursor: default;
}

.cta-secondary {
  font-family: inherit;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--green-pale);
  text-decoration: none;
  opacity: 0.8;
}

        .capture {
          background: var(--deep);
          border: 1px solid var(--green-dark);
          border-radius: 4px;
          padding: clamp(1.75rem, 5vw, 2.5rem);
text-align: center;
        }

        .capture-line {
          font-size: clamp(1.3rem, 3.4vw, 1.7rem);
          font-weight: 300;
          
          line-height: 1.4;
          margin-bottom: 1.5rem;
        }

        input {
          width: 100%;
          background: transparent;
          border: 1px solid var(--green-pale);
          color: var(--cream);
          font-family: inherit;
          font-size: 0.9rem;
          padding: 1.1rem;
          margin-bottom: 1rem;
          outline: none;
          border-radius: 2px;
        }
        input::placeholder { color: var(--cream-dim); opacity: 0.65; }
        input:disabled { opacity: 0.6; }

        .capture-message {
          margin-top: 1rem;
          font-size: 0.95rem;
          font-style: italic;
          color: var(--green-pale);
          line-height: 1.6;
        }
        .capture-message.is-error { color: #c98a6b; }

        footer {
          padding: clamp(3rem, 8vw, 4.5rem) 0 3rem;
          text-align: center;
        }

        .tagline {
          font-size: 1rem;
          font-style: italic;
          color: var(--cream-dim);
        }

        .meta {
          margin-top: 1rem;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          color: var(--green-muted);
        }

        @media (max-width: 480px) {
          .step { grid-template-columns: 28px 1fr; gap: 1rem; }
        }
      `}</style>

     

        <section className={`hero ${visible ? "visible" : ""}`}>
          <h1 className="hero-headline">
            less planning.
            <br />
            <em>more movement.</em>
          </h1>

         <p className="hero-lede">
  mySwamp turns a messy task dump into the exact thing you need to do next.
</p>

<p className="hero-lede">
  just one frog surfaced. two options: done, or not yet. 
  either way, it sinks into your water&apos;s memory. no tags. no dashboards. no streaks. 
</p>

        
        </section>
 <div className="wrap">
        <div className={`topbar ${visible ? "visible" : ""}`}>
          <div className="mark">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="8" cy="7" rx="2.4" ry="2.7" fill="#d4c9b0" />
              <ellipse cx="16" cy="7" rx="2.4" ry="2.7" fill="#d4c9b0" />
              <circle cx="8" cy="6.6" r="1" fill="#0b1710" />
              <circle cx="16" cy="6.6" r="1" fill="#0b1710" />
              <path d="M4 13c0-2.2 3.6-4 8-4s8 1.8 8 4-3.6 5-8 5-8-2.8-8-5Z" fill="#d4c9b0" />
            </svg>
          </div>
          <div className="wordmark">mySwamp</div>
        </div>
        
        <div className="divider" />

        <section className="capture" id="notify">
          {!formDone ? (
            <>
              <p className="capture-line">
                your first frog? leave your email to get notified below.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <input
                  type="email"
                  placeholder="you@somewhere.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                  aria-describedby={message ? "waitlist-message" : undefined}
                  disabled={submitState === "submitting"}
                />

                <button
                  className="cta-primary"
                  type="submit"
                  disabled={submitState === "submitting"}
                >
                  {submitState === "submitting" ? "entering..." : "get early access"}
                </button>
              </form>

              {message && (
                <p
                  className={`capture-message ${
                    submitState === "error" ? "is-error" : ""
                  }`}
                  id="waitlist-message"
                  role="alert"
                >
                  {message}
                </p>
              )}
            </>
          ) : (
            <p className="capture-message" role="status">
              {message}
            </p>
          )}
        </section>

        <footer>
       
          <p className="meta">mySwamp © 2026</p>
        </footer>
      </div>
    </>
  );
}