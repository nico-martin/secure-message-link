import { createRoot } from 'react-dom/client';
import React from 'react';
import useHashPath from '@utils/useHashPath.ts';
import styles from './App.module.css';
import cn from '@utils/classnames.ts';
import DisplayMessage from '@app/DisplayMessage.tsx';
import CreateMessage from '@app/CreateMessage.tsx';
import Header from '@app/Header.tsx';

const App: React.FC = () => {
  const { currentPage } = useHashPath();

  return (
    <div className={cn(styles.root)}>
      <Header className={styles.header} />
      <main className={styles.main}>
        {!('crypto' in window) ? (
          <p>Your Browser does not support the WebCrypto API.</p>
        ) : currentPage ? (
          <DisplayMessage id={currentPage.id} password={currentPage.password} />
        ) : (
          <CreateMessage />
        )}
      </main>
      <footer className={styles.footer}>footer</footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
