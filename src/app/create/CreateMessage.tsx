import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './CreateMessage.module.css';
import { Button, IconName } from '@theme';
import { encodeHash } from '@utils/useHashPath.ts';
import { createMessage } from '@utils/DB.ts';
import { arrayBufferToBase64 } from '@utils/arrayBuffer.ts';
import { uint8ArrayToString } from '@utils/uint8Array.ts';
import Link from '@app/Link.tsx';
import Crypto from '@utils/Crypto.ts';
import CreateMessageForm from '@app/create/CreateMessageForm.tsx';
import generatePassword from '@utils/generatePassword.ts';
import { PayloadType } from '@app/types.ts';

const CreateMessage: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const [link, setLink] = React.useState<string>('');

  return (
    <div className={cn(className, styles.root)}>
      {link ? (
        <React.Fragment>
          <Link className={styles.linkContainer} link={link} />
          <Button
            onClick={() => setLink('')}
            appearance="minimal"
            icon={IconName.ARROW_LEFT}
          >
            generate new link
          </Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>
            With “Secure Message Link” you can encrypt content that is
            accessible via a link. The link expires after 24 hours or after the
            content has been decrypted for the first time.
          </p>
          <CreateMessageForm
            className={styles.form}
            onSubmit={async (payload) => {
              setLink('');
              const password = generatePassword(10);
              const encrypted = await Crypto.encrypt(
                payload.type === PayloadType.TEXT
                  ? payload.content.text
                  : JSON.stringify(payload.content),
                password
              );
              const nowPlus24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);

              const id = await createMessage(
                arrayBufferToBase64(encrypted.ciphertext),
                uint8ArrayToString(encrypted.iv),
                uint8ArrayToString(encrypted.salt),
                nowPlus24Hours.toISOString(),
                payload.type
              );
              if (!id) {
                throw new Error(
                  'There was an error creating the message. Please try again.'
                );
              }
              const link = encodeHash({ id, password });

              setLink(
                `${window.location.protocol}//${window.location.host}#` + link
              );
            }}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default CreateMessage;
