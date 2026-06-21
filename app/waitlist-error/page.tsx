import Link from "next/link";

import styles from "../waitlist-status.module.css";

export default function WaitlistErrorPage() {
  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.shell}>
        <section className={styles.content}>
          <h1 className={styles.title}>this link looks a little foggy.</h1>
          <p className={styles.description}>
            confirmation links fade after 24 hours. try joining the waitlist again.
          </p>
          <Link href="/" className={styles.returnLink}>
            join the waitlist again
          </Link>
        </section>
      </div>
    </main>
  );
}
