import React from 'react';
import { Icon, IconName } from '@theme';
import cn from '@utils/classnames.ts';
import styles from './Copy.module.css';
import copyImageToClipboard from '@utils/copyImageToClipboard.ts';
const Copy: React.FC<{
  text?: string;
  file?: { content: string; mimeType: string };
  className?: string;
}> = ({ text = null, file = null, className = '' }) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  const copy = React.useCallback(async () => {
    if (file) {
      try {
        await copyImageToClipboard(file.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying image:', error);
      }
    } else if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('No text to copy');
    }
  }, [text]);

  return (
    <button
      onClick={copy}
      className={cn(className, styles.button, { [styles.copied]: copied })}
    >
      {copied ? (
        <Icon icon={IconName.CHECK} />
      ) : (
        <Icon icon={IconName.CONTENT_COPY} />
      )}
    </button>
  );
};

export default Copy;
