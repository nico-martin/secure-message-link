import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './CreateMessage.module.css';
import { Button } from '@theme';
import encrypt from '@utils/encrypt.ts';
import { encodeHash } from '@utils/useHashPath.ts';
import { createMessage } from '@utils/DB.ts';
import { v4 as uuidv4 } from 'uuid';

const CreateMessage: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [link, setLink] = React.useState<string | null>(null);

  React.useEffect(() => {
    textareaRef?.current?.focus();
  }, [textareaRef]);

  return (
    <div>
      <form
        className={cn(styles.root, className)}
        onSubmit={async (e) => {
          e.preventDefault();
          const textarea = document.querySelector<HTMLTextAreaElement>(
            'textarea[name=test]'
          );
          const text = textarea.value;
          const password = uuidv4();
          const encrypted = await encrypt(text, password);
          const nowPlus24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);

          const id = await createMessage(
            encrypted.ciphertext,
            encrypted.iv,
            encrypted.salt,
            nowPlus24Hours
          );
          const link = encodeHash({ id, password });

          setLink(link);
          textarea.focus();
          textarea.value = '';
        }}
      >
        <textarea className={styles.textarea} name="test"></textarea>
        <Button type="submit" className={styles.button}>
          Generate secure link
        </Button>
      </form>
      {link && (
        <p>
          Your message is encrypted and can be accessed via the following link:{' '}
          <a href={`#${link}`}>{link}</a>
        </p>
      )}
    </div>
  );
};

export default CreateMessage;
