import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './DisplayMessagePayload.module.css';
import { PayloadType } from '@app/types.ts';
import DisplayText from './payloadType/DisplayText.tsx';
import DisplayCredentials from './payloadType/DisplayCredentials.tsx';
import DisplayFile from './payloadType/DisplayFile.tsx';

const DisplayMessagePayload: React.FC<{
  payload: string;
  type: string;
  className?: string;
}> = ({ payload, type, className = '' }) => (
  <div className={cn(className, styles.root)}>
    {type === PayloadType.TEXT.toString() ? (
      <DisplayText text={payload} />
    ) : type === PayloadType.CREDENTIAL.toString() ? (
      <DisplayCredentials text={payload} />
    ) : type === PayloadType.IMAGE.toString() ? (
      <DisplayFile text={payload} />
    ) : null}
  </div>
);

export default DisplayMessagePayload;
