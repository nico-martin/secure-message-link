import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id: string;
  ciphertext: string;
  iv: string;
  salt: string;
  expires: string;
}
const { data: fetchData, error: fetchError } = await supabase
  .from('messages')
  .select();

console.log(fetchData, fetchError);

export async function createMessage(
  ciphertext: string,
  iv: string,
  salt: string,
  expires: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('insert_message', {
      ciphertext,
      iv,
      salt,
      expires,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
}

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
