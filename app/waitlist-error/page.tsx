import styles from "../waitlist-status.module.css";

export default function WaitlistErrorPage() {
  return (
    <main className={styles.page}>
      <div className={styles.message}>
        <h1>this link looks a little swampy</h1>
        <p>try joining the waitlist again.</p>
      </div>
    </main>
  );
}
