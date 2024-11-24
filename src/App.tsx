import { createRoot } from 'react-dom/client';
import React from 'react';
import useHashPath from '@utils/useHashPath.ts';
import styles from './App.module.css';
import cn from '@utils/classnames.ts';
import DisplayMessage from '@app/DisplayMessage.tsx';
import CreateMessage from '@app/CreateMessage.tsx';

const App: React.FC = () => {
  const { currentPage } = useHashPath();

  return (
    <div className={cn(styles.root)}>
      <header>
        <h1>Secure Message Link</h1>
      </header>
      <main>
        {!('crypto' in window) ? (
          <p>Your Browser does not support the WebCrypto API.</p>
        ) : currentPage ? (
          <DisplayMessage id={currentPage.id} password={currentPage.password} />
        ) : (
          <CreateMessage />
        )}
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
