import React from 'react';
import styles from './Link.module.css';
import cn from '@utils/classnames.ts';
import { Button, IconName } from '@theme';

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

  const doShare = () => {
    navigator.share({
      title: 'Secure Message',
      url: link,
    });
  };

  return (
    <div className={cn(styles.root, className)}>
      <p>
        Your message is encrypted and can be accessed via the following link:
      </p>
      <div className={styles.linkWrapper}>
        <code className={styles.link}>{link}</code>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          size="small"
          onClick={doCopy}
          icon={copied ? IconName.CHECK : IconName.CONTENT_COPY}
        >
          copy
        </Button>
        {Boolean(navigator.share) && (
          <Button size="small" onClick={doShare} icon={IconName.SHARE_VARIANT}>
            share
          </Button>
        )}
      </div>
    </div>
  );
};

export default Link;
