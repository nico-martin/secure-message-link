const getPngBlob = (path: string): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    };
    img.onerror = reject;
    img.src = path;
  });

const copyImageToClipboard = async (path: string) => {
  const blob = await getPngBlob(path);
  const item = new ClipboardItem({ 'image/png': blob });
  await navigator.clipboard.write([item]);
};

export default copyImageToClipboard;
