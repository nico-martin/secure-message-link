class Crypto {
  private static async getKey(
    password: string,
    salt: Uint8Array
  ): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(
    message: string,
    password: string
  ): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array; salt: Uint8Array }> {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await this.getKey(password, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encoder.encode(message)
    );

    return { ciphertext, iv, salt };
  }

  static async decrypt(
    ciphertext: ArrayBuffer,
    password: string,
    iv: Uint8Array,
    salt: Uint8Array
  ): Promise<string> {
    const decoder = new TextDecoder();
    const key = await this.getKey(password, salt);
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      ciphertext
    );

    return decoder.decode(decryptedData);
  }
}

export default Crypto;
