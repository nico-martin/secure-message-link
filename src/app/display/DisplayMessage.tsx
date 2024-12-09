import React from 'react';
import { getMessageById } from '@utils/DB.ts';
import { base64ToArrayBuffer } from '@utils/arrayBuffer.ts';
import { stringToUint8Array } from '@utils/uint8Array.ts';
import styles from './DisplayMessage.module.css';
import { Button, IconName, Message, MessageType } from '@theme';
import Crypto from '@utils/Crypto.ts';
import DisplayMessagePayload from '@app/display/DisplayMessagePayload.tsx';
const DisplayMessage: React.FC<{ id: string; password: string }> = ({
  id,
  password,
}) => {
  const [messagePayload, setMessagePayload] = React.useState<string>('');
  const [messageType, setMessageType] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchMessage = async () => {
    setLoading(true);
    const message = await getMessageById(id);

    if (!message.id) {
      setError(
        'The message does not exist. This means that it has either already been read or has expired. '
      );
      setLoading(false);
      return;
    }

    try {
      const decodedCiphertext = base64ToArrayBuffer(message.ciphertext);
      const decodedIv = stringToUint8Array(message.iv);
      const decodedSalt = stringToUint8Array(message.salt);

      const decrypted = await Crypto.decrypt(
        decodedCiphertext,
        password,
        decodedIv,
        decodedSalt
      );

      console.log(decrypted);
      console.log(message.type);

      setMessagePayload(decrypted);
      setMessageType(message.type);
    } catch (error) {
      console.error(error);
      setError('Something went wrong. The message could not be decrypted.');
    }
    setLoading(false);
  };

  return (
    <div>
      {messageType && messagePayload ? (
        <div>
          <h2 className={styles.messageTitle}>Your message:</h2>
          <DisplayMessagePayload
            className={styles.message}
            type={messageType}
            payload={messagePayload}
          />
        </div>
      ) : error ? (
        <Message type={MessageType.ERROR}>{error}</Message>
      ) : (
        <div className={styles.decrypt}>
          <Message>
            An encrypted message has been sent to you. This can only be
            decrypted once, after which the message is deleted.
          </Message>
          <Button
            className={styles.decryptButton}
            onClick={fetchMessage}
            loading={loading}
            icon={IconName.KEY}
          >
            Decrypt now
          </Button>
        </div>
      )}
      <div className={styles.buttonWrapper}>
        <Button
          appearance="minimal"
          onClick={() => {
            window.location.hash = '';
          }}
          className={styles.button}
          icon={IconName.ARROW_LEFT}
        >
          generate new link
        </Button>
      </div>
    </div>
  );
};

export default DisplayMessage;
