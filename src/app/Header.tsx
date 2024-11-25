import React from 'react';
import styles from './Header.module.css';
import cn from '@utils/classnames.ts';
const Header: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <header className={cn(styles.root, className)}>
      <h1 className={styles.heading}>Secure Message Link</h1>
    </header>
  );
};

export default Header;
