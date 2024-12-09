export enum PayloadType {
  TEXT = 'text',
  CREDENTIAL = 'credentials',
  IMAGE = 'image',
}

export interface PayloadText {
  type: PayloadType.TEXT;
  content: { text: string };
}

export interface PayloadCredential {
  type: PayloadType.CREDENTIAL;
  content: { username: string; password: string };
}

export interface PayloadFile {
  type: PayloadType.IMAGE;
  content: { file: string; mimeType: string; title: string };
}

export type Payload = PayloadText | PayloadCredential | PayloadFile;
