import Link from "next/link";

import styles from "../waitlist-status.module.css";

export default function WaitlistConfirmedPage() {
  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.shell}>
        <section className={styles.content}>
          <h1 className={styles.title}>
            you’ve completed your first frog.
          </h1>
          <p className={styles.description}>
            i’ll email you when mySwamp opens.
          </p>
          <Link href="/" className={styles.returnLink}>
            return to the waterline
          </Link>
        </section>
      </div>
    </main>
  );
}
