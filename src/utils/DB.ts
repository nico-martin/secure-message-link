import { createClient } from '@supabase/supabase-js';
import { PayloadType } from '@app/types.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id: string;
  ciphertext: string;
  iv: string;
  salt: string;
  expires: string;
  type: string;
}

export const createMessage = async (
  ciphertext: string,
  iv: string,
  salt: string,
  expires: string,
  type: PayloadType
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('insert_message', {
      ciphertext,
      iv,
      salt,
      expires,
      type: type.toString(),
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
};

export const getMessageById = async (id: string): Promise<Message | null> => {
  try {
    const { data, error } = await supabase.rpc('get_message_by_id', {
      message_id: id,
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data found');
    }

    return data as Message;
  } catch (error) {
    console.error('Error fetching message by id:', error);
    return null;
  }
};
