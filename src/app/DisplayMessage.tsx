import React from 'react';
import { getMessageById } from '@utils/DB.ts';
import decrypt from '@utils/decrypt.ts';
import { base64ToArrayBuffer } from '@utils/arrayBuffer.ts';
import { stringToUint8Array } from '@utils/uint8Array.ts';
import nl2br from '@utils/nl2br.ts';

const DisplayMessage: React.FC<{ id: string; password: string }> = ({
  id,
  password,
}) => {
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMessage = async () => {
      const message = await getMessageById(id);

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
  });

  return (
    <p
      dangerouslySetInnerHTML={{
        __html: nl2br(message ? message : 'loading..'),
      }}
    ></p>
  );
};

export default DisplayMessage;
