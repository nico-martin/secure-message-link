import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './DisplayCredentials.module.css';
import { Message, MessageType } from '@theme';

const DisplayCredentials: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  try {
    const { username, password } = JSON.parse(text);
    return (
      <div className={cn(className, styles.root)}>
        <p className={styles.row}>
          <span className={styles.title}>Username:</span>
          <span className={styles.value}>{username}</span>
        </p>
        <p className={styles.row}>
          <span className={styles.title}>Password:</span>
          <span className={styles.value}>{password}</span>
        </p>
      </div>
    );
  } catch (e) {
    return <Message type={MessageType.ERROR}>Invalid Data</Message>;
  }
};

export default DisplayCredentials;
