const readFile = async (
  file: File
): Promise<{ fileContent: string; mimeType: string; title: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fileContent = reader.result as string;
      const mimeType = file.type;
      resolve({ fileContent, mimeType, title: file.name });
    };
    reader.onerror = (error) => reject(error);
  });

export default readFile;
