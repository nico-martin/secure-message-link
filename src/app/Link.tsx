import React from 'react';
import styles from './Link.module.css';
import cn from '@utils/classnames.ts';
import { Icon, IconName } from '@theme';
const Link: React.FC<{ className?: string; link: string }> = ({
  className = '',
  link,
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  const doCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className={cn(styles.root, className)}>
      <p>
        Your message is encrypted and can be accessed via the following link:
      </p>
      <div className={styles.linkWrapper}>
        <code className={styles.link}>{link}</code>
        <button
          className={cn(styles.copy, { [styles.copied]: copied })}
          onClick={doCopy}
        >
          {copied ? (
            <Icon icon={IconName.CHECK} />
          ) : (
            <Icon icon={IconName.CONTENT_COPY} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Link;
