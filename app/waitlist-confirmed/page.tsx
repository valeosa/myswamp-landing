import styles from "../waitlist-status.module.css";

export default function WaitlistConfirmedPage() {
  return (
    <main className={styles.page}>
      <div className={styles.message}>
        <h1>you’re in the swamp 🐸</h1>
        <p>i’ll email you when mySwamp opens.</p>
      </div>
    </main>
  );
}
