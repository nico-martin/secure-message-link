import React from 'react';
import cn from '@utils/classnames.ts';
import nl2br from '@utils/nl2br.ts';
import styles from './DisplayText.module.css';

const DisplayText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => (
  <p
    className={cn(className, styles.box)}
    dangerouslySetInnerHTML={{
      __html: nl2br(text),
    }}
  />
);

export default DisplayText;
