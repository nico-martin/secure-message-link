import React from 'react';
import { Payload, PayloadType } from '@app/types.ts';
import cn from '@utils/classnames.ts';
import styles from './CreateMessageForm.module.css';
import { Button, Dropzone, Icon, IconName, Message, MessageType } from '@theme';
import readFile from '@utils/readFile.ts';

const CreateMessageForm: React.FC<{
  className?: string;
  onSubmit: (payload: Payload) => Promise<void>;
}> = ({ className = '', onSubmit }) => {
  const [type, setType] = React.useState<PayloadType>(PayloadType.TEXT);
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File>(null);

  React.useEffect(() => {
    if (type === PayloadType.IMAGE) {
    } else if (type === PayloadType.CREDENTIAL) {
      document.querySelector<HTMLInputElement>('input[name=username]').focus();
    } else if (type === PayloadType.TEXT) {
      document
        .querySelector<HTMLTextAreaElement>('textarea[name=text]')
        .focus();
    }
  }, [type]);

  return (
    <form
      className={cn(styles.form, className)}
      onSubmit={async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);
        try {
          if (type === PayloadType.IMAGE) {
            if (!file) {
              setLoading(false);
              return;
            }
            const { fileContent, mimeType, title } = await readFile(file);
            await onSubmit({
              type,
              content: { file: fileContent, mimeType, title },
            });
          } else if (type === PayloadType.CREDENTIAL) {
            const username = document.querySelector<HTMLInputElement>(
              'input[name=username]'
            ).value;
            const password = document.querySelector<HTMLInputElement>(
              'input[name=password]'
            ).value;
            if (!username || !password) {
              setLoading(false);
              return;
            }
            await onSubmit({ type, content: { username, password } });
          } else if (type === PayloadType.TEXT) {
            const textarea = document.querySelector<HTMLTextAreaElement>(
              'textarea[name=text]'
            );
            const text = textarea.value;
            if (!text) {
              setLoading(false);
              return;
            }
            await onSubmit({ type, content: { text } });
            textarea.focus();
            textarea.value = '';
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setError(
            'There was an error creating the message. Please try again.'
          );
        }
      }}
    >
      <div className={styles.types}>
        {Object.entries(PayloadType).map(([key, value]) => (
          <label key={key} className={styles.typeLabel}>
            <input
              className={styles.typeRadio}
              type="radio"
              name="type"
              value={value}
              checked={type === value}
              onChange={() => setType(value)}
            />
            <Icon
              className={styles.typeIcon}
              icon={
                value === PayloadType.TEXT
                  ? IconName.TEXT_BOX_OUTLINE
                  : value === PayloadType.IMAGE
                    ? IconName.IMAGE_OUTLINE
                    : value === PayloadType.CREDENTIAL
                      ? IconName.FORM_TEXTBOX_PASSWORD
                      : null
              }
            />
            <span className={styles.typeValue}>{value}</span>
          </label>
        ))}
      </div>
      {type === PayloadType.CREDENTIAL ? (
        <div className={styles.credentials}>
          <label className={styles.credentialsLabel}>
            <Icon icon={IconName.ACCOUNT} />
            <input
              className={styles.credentialsInput}
              type="text"
              name="username"
              placeholder="username"
              title="username"
            />
          </label>
          <label className={styles.credentialsLabel}>
            <Icon icon={IconName.KEY} />
            <input
              className={styles.credentialsInput}
              type="text"
              name="password"
              placeholder="password"
              title="password"
            />
          </label>
        </div>
      ) : type === PayloadType.IMAGE ? (
        Boolean(file) ? (
          <div className={styles.imageFile}>
            {file.name}
            <button
              onClick={() => setFile(null)}
              className={styles.imageFileButton}
            >
              <Icon icon={IconName.CLOSE} />
            </button>
          </div>
        ) : (
          <Dropzone name="image" onFileChange={setFile} />
        )
      ) : (
        <textarea
          className={styles.textarea}
          placeholder="your message.."
          name="text"
        />
      )}
      {error !== '' && (
        <Message className={styles.error} type={MessageType.ERROR}>
          {error}
        </Message>
      )}
      <Button
        icon={IconName.LINK_VARIANT_PLUS}
        type="submit"
        className={styles.button}
        loading={loading}
      >
        generate secure link
      </Button>
    </form>
  );
};

export default CreateMessageForm;
