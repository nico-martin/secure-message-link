import React from 'react';
import cn from '@utils/classnames.ts';
import pkg from '../../package.json';
import styles from './Footer.module.css';

const Footer: React.FC<{ className?: string }> = ({ className }) => (
  <footer className={cn(className, styles.root)}>
    <p>
      "Secure Message Link" (v {pkg.version}) is a Project by{' '}
      <a href="https://nico.dev" target="_blank">
        Nico Martin
      </a>
    </p>
    <p>
      This site does not collect any personal data besides what is technically
      required.
    </p>
    <p>
      <a
        href="https://github.com/nico-martin/secure-message-link"
        target="_blank"
      >
        github.com/nico-martin/secure-message-link
      </a>
    </p>
  </footer>
);

export default Footer;
