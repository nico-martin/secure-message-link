import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './CreateMessage.module.css';
import { Button, IconName, Message, MessageType } from '@theme';
import { encodeHash } from '@utils/useHashPath.ts';
import { createMessage } from '@utils/DB.ts';
import { v4 as uuidv4 } from 'uuid';
import { arrayBufferToBase64 } from '@utils/arrayBuffer.ts';
import { uint8ArrayToString } from '@utils/uint8Array.ts';
import Link from '@app/Link.tsx';
import Crypto from '@utils/Crypto.ts';

const CreateMessage: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [link, setLink] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    textareaRef?.current?.focus();
  }, [textareaRef]);

  return (
    <div className={styles.root}>
      {link ? (
        <React.Fragment>
          <Link className={styles.linkContainer} link={link} />
          <Button
            onClick={() => setLink('')}
            appearance="minimal"
            icon={IconName.ARROW_LEFT}
          >
            generate new Link
          </Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>
            With “Secure Message Link” you can encrypt content that is
            accessible via a link. The link expires after 24 hours or after the
            content has been decrypted for the first time.
          </p>
          <form
            className={cn(styles.form, className)}
            onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              setLoading(true);
              try {
                const textarea = document.querySelector<HTMLTextAreaElement>(
                  'textarea[name=text]'
                );
                const text = textarea.value;
                if (!text) {
                  setLoading(false);
                  return;
                }
                const password = uuidv4();
                const encrypted = await Crypto.encrypt(text, password);
                const nowPlus24Hours = new Date(
                  Date.now() + 24 * 60 * 60 * 1000
                );

                const id = await createMessage(
                  arrayBufferToBase64(encrypted.ciphertext),
                  uint8ArrayToString(encrypted.iv),
                  uint8ArrayToString(encrypted.salt),
                  nowPlus24Hours.toISOString()
                );
                const link = encodeHash({ id, password });
                setLoading(false);

                setLink(
                  `${window.location.protocol}//${window.location.host}#` + link
                );
                textarea.focus();
                textarea.value = '';
              } catch (error) {
                setLoading(false);
                setError(
                  'There was an error creating the message. Please try again.'
                );
              }
            }}
          >
            <textarea className={styles.textarea} name="text"></textarea>
            {error !== '' && (
              <Message className={styles.error} type={MessageType.ERROR}>
                {error}
              </Message>
            )}
            <Button
              icon={IconName.LINK_VARIANT_PLUS}
              type="submit"
              className={styles.button}
              loading={loading}
            >
              generate secure link
            </Button>
          </form>
        </React.Fragment>
      )}
    </div>
  );
};

export default CreateMessage;
