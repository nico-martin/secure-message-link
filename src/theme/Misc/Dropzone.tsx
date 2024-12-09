import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Dropzone.module.css';
import { Icon, IconName, Message, MessageType } from '../index.ts';
import formatBytes from '@utils/formatBytes.ts';

const Dropzone: React.FC<{
  className?: string;
  name: string;
  maxFileSize?: number;
  allowedTypes?: Record<string, Array<string>>;
  onFileChange: (file: File) => void;
}> = ({
  className = '',
  name,
  maxFileSize = 2 * 1024 * 1024,
  allowedTypes = {
    jpg: ['image/jpeg'],
    png: ['image/png'],
    gif: ['image/gif'],
  },
  onFileChange,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>(null);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); // Prevent default behavior
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); // Prevent default behavior
    setDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const setFile = (file: File) => {
    setError(null);
    if (!file) {
      return;
    }

    if (!Object.values(allowedTypes).flat().includes(file.type)) {
      setError(
        'Only the following mime types are allowed:<br />' +
          Object.values(allowedTypes).flat().join(', ') +
          '<br /><br />mime type of the file: ' +
          file.type
      );
      return false;
    }
    if (file.size > maxFileSize) {
      setError('File size must be less than ' + formatBytes(maxFileSize));
      return false;
    }

    onFileChange(file);
  };

  return (
    <div className={cn(className, styles.root)}>
      <label
        className={cn(styles.zone, { [styles.dragging]: dragging })}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={inputRef}
          name={name}
          id={name}
          className={styles.input}
          onChange={handleFileChange}
        />
        <Icon icon={IconName.FILE_UPLOAD_OUTLINE} className={styles.icon} />
        <div>
          <p className={styles.instructions}>
            {dragging ? 'Drop here' : 'Drag and drop or click to upload'}
          </p>
          <p className={styles.meta}>
            Supported files: {Object.keys(allowedTypes).join(', ')}
            <br />
            Maximum file size {formatBytes(maxFileSize)}.
          </p>
        </div>
      </label>
      {error && (
        <Message type={MessageType.ERROR} className={styles.error}>
          <p dangerouslySetInnerHTML={{ __html: error }} />
        </Message>
      )}
    </div>
  );
};

export default Dropzone;
