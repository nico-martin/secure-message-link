import React from 'react';
import { getMessageById } from '@utils/DB.ts';
import decrypt from '@utils/decrypt.ts';
import { base64ToArrayBuffer } from '@utils/arrayBuffer.ts';
import { stringToUint8Array } from '@utils/uint8Array.ts';
import nl2br from '@utils/nl2br.ts';
import styles from './DisplayMessage.module.css';
import { Icon, IconName } from '@theme';
const DisplayMessage: React.FC<{ id: string; password: string }> = ({
  id,
  password,
}) => {
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMessage = async () => {
      const message = await getMessageById(id);

      if (!message.id) {
        setError(
          'The message does not exist. This means that it has either already been read or has expired. '
        );
        return;
      }

      const decodedCiphertext = base64ToArrayBuffer(message.ciphertext);
      const decodedIv = stringToUint8Array(message.iv);
      const decodedSalt = stringToUint8Array(message.salt);

      const decrypted = await decrypt(
        decodedCiphertext,
        password,
        decodedIv,
        decodedSalt
      );

      setMessage(decrypted);
    };

    fetchMessage();
  }, []);

  return (
    <div>
      {error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <p
          dangerouslySetInnerHTML={{
            __html: nl2br(message ? message : 'loading..'),
          }}
        ></p>
      )}
      <div className={styles.buttonWrapper}>
        <button
          onClick={() => {
            window.location.hash = '';
          }}
          className={styles.button}
        >
          <Icon className={styles.buttonIcon} icon={IconName.ARROW_RIGHT} />
          generate new Message
        </button>
      </div>
    </div>
  );
};

export default DisplayMessage;
