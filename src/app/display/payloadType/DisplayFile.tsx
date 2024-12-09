import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './DisplayFile.module.css';
import { Copy, Icon, IconName, Message, MessageType } from '@theme';

const DisplayFile: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  const [hasError, setHasError] = React.useState<boolean>(false);

  const { file, title, mimeType } = React.useMemo(() => {
    try {
      const { file, title, mimeType } = JSON.parse(text);
      return { file, title, mimeType };
    } catch (e) {
      setHasError(true);
    }
  }, [text]);

  if (hasError) {
    return <Message type={MessageType.ERROR}>Invalid Data</Message>;
  }

  return (
    <div className={cn(className, styles.root)}>
      <div className={styles.file}>
        <p className={styles.title}>{title}</p>
        <Copy file={{ content: file, mimeType }} className={styles.copy} />
        <a className={styles.download} download={title} href={file}>
          <Icon icon={IconName.DOWNLOAD} />
        </a>
      </div>
      <img className={styles.image} src={file} title={title} />
    </div>
  );
};

export default DisplayFile;
