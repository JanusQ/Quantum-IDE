import React from 'react'
import styles from './index.module.scss'
export default function Title({ title }) {
  return <div className={styles.root}>{title}</div>
}
