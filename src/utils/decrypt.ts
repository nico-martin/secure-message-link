const decrypt = async (
  ciphertext: ArrayBuffer,
  password: string,
  iv: Uint8Array,
  salt: Uint8Array
): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      ciphertext
    );

    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Error decrypting message:', error);
    return '';
  }
};

export default decrypt;
