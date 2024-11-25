import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Message.module.css';
import { Icon, IconName } from '../index.ts';

export enum MessageType {
  INFO = 'info',
  ERROR = 'error',
  SUCCESS = 'success',
}

const Message: React.FC<{
  children: string | React.ReactElement;
  type?: MessageType;
  noIcon?: boolean;
}> = ({ children, type = MessageType.INFO, noIcon = false }) => (
  <div
    className={cn(styles.root, {
      [styles.typeError]: type === MessageType.ERROR,
      [styles.typeSuccess]: type === MessageType.SUCCESS,
    })}
  >
    {!noIcon && (
      <Icon
        className={styles.icon}
        icon={
          type === MessageType.ERROR
            ? IconName.ALERT_OUTLINE
            : type === MessageType.SUCCESS
              ? IconName.CHECK
              : IconName.INFORMATION_OUTLINE
        }
      />
    )}
    <div className={styles.bkg} />
    <div className={styles.content}>
      {typeof children === 'string' ? <p>{children}</p> : children}
    </div>
  </div>
);

export default Message;
