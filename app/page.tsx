"use client";

import { useEffect, useState } from "react";

type SubmitState = "idle" | "submitting" | "pending" | "confirmed" | "error";

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black: #080a08;
          --deep: #0d120d;
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
          font-family: 'Cormorant Garamond', Georgia, serif;
          overflow-x: hidden;
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: clamp(2rem, 8vw, 6rem);
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('/swamp.jpg');
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 3s ease;
          filter: brightness(0.25) saturate(0.8);
        }

        .hero-bg.visible { opacity: 1; }

        .hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 30% 50%,
            transparent 20%,
            rgba(8,10,8,0.7) 70%,
            var(--black) 100%
          );
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 720px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 1.2s ease 0.8s, transform 1.2s ease 0.8s;
        }

        .hero-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

       
        .hero-headline {
          font-size: clamp(2.8rem, 7vw, 6rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--cream);
          margin-bottom: 1rem;
        }

        .hero-headline em {
          font-style: italic;
          color: var(--green-pale);
        }

        .hero-subline {
          font-size: clamp(1rem, 2vw, 1.3rem);
          font-weight: 300;
          color: var(--cream-dim);
          margin-bottom: 3rem;
          font-style: italic;
          line-height: 1.6;
        }

        .cta-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .cta-primary {
          font-family: 'Space Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.14em;
          color: var(--black);
          background: var(--cream);
          border: none;
          padding: 0.95rem 2.3rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }

        .cta-secondary {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          color: var(--green-pale);
          text-decoration: none;
          opacity: 0.75;
          border-bottom: 1px solid currentColor;
          padding-bottom: 2px;
        }

        

        .how {
          min-height: 100vh;
          padding: clamp(5rem, 12vw, 10rem) clamp(2rem, 8vw, 6rem);
          max-width: 900px;
          margin: 0 auto;
        }

        .section-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: var(--green-muted);
          text-transform: uppercase;
          margin-bottom: 4rem;
        }

        .steps {
          display: flex;
          flex-direction: column;
        }

        .step {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 2rem;
          padding: 2.5rem 0;
          border-bottom: 1px solid var(--green-dark);
        }

        .step:last-child { border-bottom: none; }

        .step-num {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          color: var(--green-muted);
          letter-spacing: 0.1em;
          padding-top: 0.35rem;
        }

        .step h3 {
          font-size: clamp(1.25rem, 2.5vw, 1.7rem);
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 0.75rem;
          font-style: italic;
        }

        .step p {
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          color: var(--cream-dim);
          line-height: 1.8;
          font-weight: 300;
        }

        .modal {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0, 0, 0, 0.86);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .modal-inner {
          width: 100%;
          max-width: 520px;
          position: relative;
        }

        .back-button {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: var(--green-pale);
          background: none;
          border: none;
          margin-bottom: 2rem;
          cursor: pointer;
          letter-spacing: 0.12em;
          opacity: 0.8;
        }

        .modal-line {
          font-size: clamp(2rem, 6vw, 3.6rem);
          font-weight: 300;
          font-style: italic;
          margin-bottom: 1rem;
        }

        .modal-sub {
          font-size: 1.1rem;
          color: var(--cream-dim);
          font-style: italic;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        input {
          width: 100%;
          background: transparent;
          border: 1px solid var(--green-pale);
          color: var(--cream);
          font-family: 'Space Mono', monospace;
          font-size: 0.9rem;
          padding: 1.2rem;
          margin-bottom: 1rem;
          outline: none;
        }

        input::placeholder {
          color: var(--cream-dim);
          opacity: 0.65;
        }

        @media (max-width: 640px) {
          .step {
            grid-template-columns: 40px 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>

      <section className="hero">
        <div className={`hero-bg ${visible ? "visible" : ""}`} />
        <div className="hero-vignette" />

        <div className={`hero-content ${visible ? "visible" : ""}`}>
          

          <h1 className="hero-headline">
            all that matters is
  
            <em> what you do next.</em>
          </h1>

          <p className="hero-subline">
            one action per moment. the most meaningful one.
          </p>

          <div className="cta-group">
            <button className="cta-primary" onClick={() => setShowModal(true)}>
              start here.
            </button>

            <a href="#how" className="cta-secondary">
              how it works
            </a>
          </div>
        </div>

        
</section>
      <section className="how" id="how">
        <p className="section-label">how it works</p>

        <div className="steps">
          <div className="step">
            <span className="step-num">01</span>
            <div>
              <h3>dump your tasks</h3>
              <p>
                everything in your head from the urgent, to the trivial, to the overdue.
                no categories. no priority levels. just what’s there.
              </p>
            </div>
          </div>

          <div className="step">
            <span className="step-num">02</span>
            <div>
              <h3>the frog surfaces</h3>
              <p>one small thing. not the most appealing. the most meaningful.</p>
            </div>
          </div>

          <div className="step">
            <span className="step-num">03</span>
            <div>
              <h3>done. or not yet.</h3>
              <p>
                two options. no negotiation. mySwamp tracks what you avoid,
                and it remembers.
              </p>
            </div>
          </div>

          <div className="step">
            <span className="step-num">04</span>
            <div>
              <h3>one thing done.</h3>
              <p>
                it’s lighter now. the weight of everything else eases up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-inner">
            <button
              className="back-button"
              onClick={() => {
                setShowModal(false);
                setSubmitState("idle");
                setMessage("");
              }}
            >
              ← back
            </button>

            {submitState !== "pending" && submitState !== "confirmed" ? (
              <>
                <p className="modal-line">your first frog? leave your email below.</p>

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
                    {submitState === "submitting" ? "entering..." : "enter"}
                  </button>
                </form>

                {message && (
                  <p className="modal-sub" id="waitlist-message" role="alert">
                    {message}
                  </p>
                )}
              </>
            ) : (
              <p className="modal-line" role="status">
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
