"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [visible, setVisible] = useState(false);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15 }
    );
    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLDivElement | null, i: number) => {
    if (el) sectionsRef.current[i] = el;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black: #080a08;
          --deep: #0d120d;
          --green-dark: #1a2a1a;
          --green-mid: #2d4a2d;
          --green-muted: #4a6b4a;
          --green-pale: #8aab8a;
          --cream: #d4c9b0;
          --cream-dim: #a09080;
          --red-avoidance: #8b2a2a;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--cream);
          font-family: 'Cormorant Garamond', Georgia, serif;
          overflow-x: hidden;
          cursor: default;
        }

        /* ── HERO ── */
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
          background: radial-gradient(ellipse at 30% 50%, transparent 20%, rgba(8,10,8,0.7) 70%, var(--black) 100%);
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

        .eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: clamp(0.6rem, 1.2vw, 0.75rem);
          letter-spacing: 0.25em;
          color: var(--green-pale);
          text-transform: uppercase;
          margin-bottom: 2rem;
          opacity: 0.7;
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
          max-width: 480px;
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
          letter-spacing: 0.1em;
          color: var(--black);
          background: var(--cream);
          border: none;
          padding: 0.9rem 2rem;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .cta-primary:hover {
          background: var(--green-pale);
          transform: translateY(-1px);
        }

        .cta-secondary {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--green-pale);
          text-decoration: none;
          opacity: 0.7;
          transition: opacity 0.2s;
          border-bottom: 1px solid currentColor;
          padding-bottom: 1px;
        }

        .cta-secondary:hover { opacity: 1; }

        .scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--green-muted);
          text-transform: uppercase;
          opacity: 0;
          animation: fadeIn 1s ease 2.5s forwards;
        }

        /* ── PHILOSOPHY ── */
        .philosophy {
          padding: clamp(5rem, 12vw, 10rem) clamp(2rem, 8vw, 6rem);
          max-width: 900px;
          margin: 0 auto;
        }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }

        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        .section-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          color: var(--green-muted);
          text-transform: uppercase;
          margin-bottom: 3rem;
        }

        .philosophy-statement {
          font-size: clamp(1.6rem, 4vw, 2.8rem);
          font-weight: 300;
          line-height: 1.3;
          color: var(--cream);
          margin-bottom: 2rem;
        }

        .philosophy-statement em {
          font-style: italic;
          color: var(--green-pale);
        }

        .philosophy-body {
          font-size: clamp(1rem, 1.8vw, 1.2rem);
          font-weight: 300;
          line-height: 1.9;
          color: var(--cream-dim);
          max-width: 600px;
        }

        /* ── DIVIDER ── */
        .divider {
          width: 1px;
          height: 80px;
          background: linear-gradient(to bottom, transparent, var(--green-muted), transparent);
          margin: 0 auto;
        }

        /* ── THE LEAK ── */
        .leak-section {
          padding: clamp(4rem, 10vw, 8rem) clamp(2rem, 8vw, 6rem);
          background: var(--deep);
          position: relative;
          overflow: hidden;
        }

        .leak-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--green-muted), transparent);
        }

        .leak-inner {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(3rem, 8vw, 8rem);
          align-items: start;
        }

        @media (max-width: 640px) {
          .leak-inner { grid-template-columns: 1fr; }
        }

        .leak-headline {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 300;
          line-height: 1.1;
          color: var(--cream);
          font-style: italic;
        }

        .leak-body {
          font-size: clamp(0.95rem, 1.6vw, 1.1rem);
          line-height: 1.9;
          color: var(--cream-dim);
          font-weight: 300;
        }

        .leak-body p + p { margin-top: 1.2rem; }

        /* ── HOW IT WORKS ── */
        .how {
          padding: clamp(5rem, 12vw, 10rem) clamp(2rem, 8vw, 6rem);
          max-width: 900px;
          margin: 0 auto;
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 4rem;
        }

        .step {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 2rem;
          padding: 2.5rem 0;
          border-bottom: 1px solid var(--green-dark);
          align-items: start;
        }

        .step:last-child { border-bottom: none; }

        .step-num {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: var(--green-muted);
          padding-top: 0.3rem;
          letter-spacing: 0.1em;
        }

        .step-content h3 {
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 0.6rem;
          font-style: italic;
        }

        .step-content p {
          font-size: clamp(0.9rem, 1.5vw, 1rem);
          color: var(--cream-dim);
          line-height: 1.8;
          font-weight: 300;
        }

        /* ── FAQ ── */
        .faq {
          padding: clamp(4rem, 10vw, 8rem) clamp(2rem, 8vw, 6rem);
          background: var(--deep);
          position: relative;
        }

        .faq::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--green-muted), transparent);
        }

        .faq-inner {
          max-width: 700px;
          margin: 0 auto;
        }

        .faq-item {
          padding: 2rem 0;
          border-bottom: 1px solid var(--green-dark);
        }

        .faq-item:last-child { border-bottom: none; }

        .faq-q {
          font-family: 'Space Mono', monospace;
          font-size: clamp(0.7rem, 1.2vw, 0.8rem);
          color: var(--green-pale);
          letter-spacing: 0.05em;
          margin-bottom: 0.8rem;
        }

        .faq-a {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          font-weight: 300;
          color: var(--cream-dim);
          line-height: 1.8;
          font-style: italic;
        }

        .faq-a strong {
          color: var(--cream);
          font-weight: 400;
          font-style: normal;
        }

        /* ── ENTER ── */
        .enter {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: clamp(4rem, 10vw, 8rem) 2rem;
          position: relative;
          overflow: hidden;
        }

        .enter-bg {
          position: absolute;
          inset: 0;
          background-image: url('/swamp.jpg');
          background-size: cover;
          background-position: center;
          filter: brightness(0.15) saturate(0.6);
        }

        .enter-content {
          position: relative;
          z-index: 2;
        }

        .enter-line {
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          font-weight: 300;
          color: var(--cream-dim);
          font-style: italic;
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .enter-headline {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 2.5rem;
          line-height: 1.1;
        }

        /* ── FOOTER ── */
        footer {
          padding: 2rem clamp(2rem, 8vw, 6rem);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--green-dark);
        }

        .footer-mark {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: var(--green-muted);
          letter-spacing: 0.15em;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className={`hero-bg ${visible ? "visible" : ""}`} />
        <div className="hero-vignette" />
        <div className={`hero-content ${visible ? "visible" : ""}`}>
          <p className="eyebrow">myswamp — task prioritisation</p>
          <h1 className="hero-headline">
            you don't need<br />
            more discipline.<br />
            <em>fix the leak.</em>
          </h1>
          <p className="hero-subline">
          one task per day. the one you're avoiding.
         </p>
          <div className="cta-group">
            <button 
             className="cta-primary" 
              onClick={() => setShowModal(true)}
               >
               enter the swamp
              </button>
            <a href="#how" className="cta-secondary">how it works</a>
          </div>
        </div>
        <p className="scroll-hint">scroll</p>
      </section>
      
      {/* PHILOSOPHY */}
      <section className="philosophy">
        <div ref={(el) => addRef(el as HTMLDivElement, 0)} className="reveal">
          <p className="section-label">the philosophy</p>
          <p className="philosophy-statement">
            most apps help you do more.<br />
            this one watches what you <em>don't</em> do.
          </p>
          <p className="philosophy-body">
            the thing you keep skipping, keep moving down the list,
            keep finding reasons to postpone — that's not a task.
            that's a leak. and it's shaping everything else.
          </p>
        </div>
      </section>
      
      <div className="divider" />

      {/* THE LEAK */}
      <section className="leak-section">
        <div className="leak-inner">
          <div ref={(el) => addRef(el as HTMLDivElement, 1)} className="reveal">
            <p className="section-label">the leak</p>
            <h2 className="leak-headline">
              good habits don't fix the leak.<br />
              they amplify it.
            </h2>
          </div>
          <div ref={(el) => addRef(el as HTMLDivElement, 2)} className="reveal">
            <div className="leak-body">
              <p>
                we live in a time where everything from 
                habits, routines, systems is optimised. so people keep adding more.
                more discipline. more structure. more 'good behaviours'.
              </p>
              <p>
                but they ignore the leak. the conversation being avoided.
                the relationship being tolerated. the thought pattern
                that won't be faced.
              </p>
              <p>
                ignore it long enough, and it becomes a flood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div ref={(el) => addRef(el as HTMLDivElement, 3)} className="reveal">
          <p className="section-label">how it works</p>
        </div>
        <div className="steps">
          {[
            {
              n: "01",
              title: "dump your tasks",
              body: "everything in your head — the urgent, the trivial, the overdue. no categories, no priority levels. just what's there.",
            },
            {
              n: "02",
              title: "the frog surfaces",
              body: "it picks one thing. not the easiest. the right one.",
            },
            {
              n: "03",
              title: "done. or not yet.",
              body: "two options. no negotiation. the frog tracks what you avoid, and it remembers.",
            },
            {
              n: "04",
              title: "it's lighter now.",
              body: "one thing done. the weight of everything else subsides. that's not a coincidence.",
            },
          ].map((s, i) => (
            <div
              key={i}
              ref={(el) => addRef(el as HTMLDivElement, 4 + i)}
              className="step reveal"
            >
              <span className="step-num">{s.n}</span>
              <div className="step-content">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* FAQ */}
      <section className="faq">
        <div className="faq-inner">
          <div ref={(el) => addRef(el as HTMLDivElement, 8)} className="reveal">
            <p className="section-label" style={{ marginBottom: "3rem" }}>
              FAQs
            </p>
          </div>
          {[
            {
              q: "what is the frog?",
              a: "the thing you already know you should do.",
            },
            {
              q: "what if the frog is wrong?",
              a: "the frog doesn't have to be right. it has to force a decision. the alternative isn't that you pick the better task — it's that you stay in the swamp indefinitely, avoiding everything equally. even a wrong pick breaks the paralysis.",
            },
            {
              q: "why only one frog?",
              a: "more than one is a list. a list is where things go to be avoided.",
            },
            {
              q: "will this fix my productivity?",
              a: "it won't. it will stop you pretending the leak isn't there.",
            },
            {
              q: "what is the swamp?",
              a: "between land and water, between action and avoidance. everything you're carrying until you face it.",
            },
          ].map((item, i) => (
            <div
              key={i}
              ref={(el) => addRef(el as HTMLDivElement, 9 + i)}
              className="faq-item reveal"
            >
              <p className="faq-q">{item.q}</p>
              <p className="faq-a">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ENTER */}
      <section className="enter">
        <div className="enter-bg" />
        <div
          ref={(el) => addRef(el as HTMLDivElement, 14)}
          className="enter-content reveal"
        >
          <p className="enter-line">
            your life doesn't change when you add more good things.
            <br />
            it changes when you stop avoiding the right thing.
          </p>
          <h2 className="enter-headline">it's still there.</h2>
          <a href="#" className="cta-primary">enter the swamp</a>
        </div>
      </section>

      {showModal && (
  <div className="modal">
    <div className="modal-inner">
      {!submitted ? (
        <>
          <p className="modal-line">it’s still here.</p>
          <p className="modal-sub">
            leave your email. we’ll call you when it surfaces.
          </p>

          <input
            type="email"
            placeholder="you@somewhere.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="cta-primary"
            onClick={() => {
              // hook this to backend later
              console.log(email);
              setSubmitted(true);
            }}
          >
            enter
          </button>
        </>
      ) : (
        <p className="modal-line">you’ll hear from the swamp.</p>
      )}
    </div>
  </div>
)}

      {/* FOOTER */}
      <footer>
        <span className="footer-mark">MYSWAMP</span>
        <span className="footer-mark">© 2025</span>
      </footer>
    </>
  );
}
