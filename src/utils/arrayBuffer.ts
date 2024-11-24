export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  // Convert the ArrayBuffer to a Uint8Array
  const uint8Array = new Uint8Array(buffer);

  // Convert each byte to a character and create a binary string
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }

  // Encode the binary string as Base64
  return btoa(binary); // `btoa` is available in the browser environment
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  // Decode Base64 to a binary string
  const binaryString = atob(base64); // `atob` decodes Base64 to a binary string

  // Convert the binary string to an ArrayBuffer
  const buffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(buffer);

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return buffer;
};
