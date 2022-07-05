import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />

      <p>The best for you to listen, always</p>

      <span>Thur, April 8</span>
    </header>
  )
}