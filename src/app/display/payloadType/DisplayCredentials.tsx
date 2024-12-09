import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './DisplayCredentials.module.css';
import { Copy, Icon, IconName, Message, MessageType } from '@theme';

const DisplayCredentials: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  try {
    const { username, password } = JSON.parse(text);
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    return (
      <div className={cn(className, styles.root)}>
        <p className={styles.item}>
          <Icon icon={IconName.ACCOUNT} />
          <span className={styles.input}>
            {username}{' '}
            <span className={styles.controls}>
              <Copy text={password} />
            </span>
          </span>
        </p>
        <p className={styles.item}>
          <Icon icon={IconName.KEY} />
          <span className={styles.input}>
            {showPassword ? password : '*'.repeat(password.length)}
            <span className={styles.controls}>
              <button
                className={styles.showHidePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon
                  icon={
                    showPassword
                      ? IconName.EYE_OUTLINE
                      : IconName.EYE_OFF_OUTLINE
                  }
                />
              </button>
              <Copy text={password} />
            </span>
          </span>
        </p>
        {/*<p className={styles.row}>
          <span className={styles.title}>Username:</span>
          <span className={styles.value}>{username}</span>
        </p>
        <p className={styles.row}>
          <span className={styles.title}>Password:</span>
          <span className={styles.value}>{password}</span>
        </p>*/}
      </div>
    );
  } catch (e) {
    return <Message type={MessageType.ERROR}>Invalid Data</Message>;
  }
};

export default DisplayCredentials;
