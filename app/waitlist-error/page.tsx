import Link from "next/link";

import styles from "../waitlist-status.module.css";

export default function WaitlistErrorPage() {
  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.shell}>
        <p className={styles.brand}>mySwamp</p>

        <section className={styles.content}>
          <p className={styles.eyebrow}>waitlist · link lost</p>
          <h1 className={styles.title}>
            this link looks
            <em>a little swampy.</em>
          </h1>
          <p className={styles.description}>
            confirmation links fade after 24 hours. try joining the waitlist again.
          </p>
          <Link href="/" className={styles.returnLink}>
            join the waitlist again <span aria-hidden="true">→</span>
          </Link>
        </section>

        <p className={styles.footer}>one meaningful thing at a time</p>
      </div>
    </main>
  );
}
