export const uint8ArrayToString = (uint8Array: Uint8Array): string =>
  btoa(String.fromCharCode(...uint8Array));

export const stringToUint8Array = (str: string): Uint8Array => {
  const binaryString = atob(str);
  const array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    array[i] = binaryString.charCodeAt(i);
  }
  return array;
};
