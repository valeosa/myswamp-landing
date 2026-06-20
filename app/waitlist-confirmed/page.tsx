import Link from "next/link";

import styles from "../waitlist-status.module.css";

export default function WaitlistConfirmedPage() {
  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.shell}>
        <p className={styles.brand}>mySwamp</p>

        <section className={styles.content}>
          <p className={styles.eyebrow}>waitlist · confirmed</p>
          <h1 className={styles.title}>
            you’re in
            <em>
              the swamp
              <span className={styles.frog} aria-hidden="true">🐸</span>
            </em>
          </h1>
          <p className={styles.description}>
            i’ll email you when mySwamp opens.
          </p>
          <Link href="/" className={styles.returnLink}>
            return to the waterline <span aria-hidden="true">→</span>
          </Link>
        </section>

        <p className={styles.footer}>one meaningful thing at a time</p>
      </div>
    </main>
  );
}
