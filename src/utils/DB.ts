import { createClient } from '@supabase/supabase-js';
import { arrayBufferToBase64 } from '@utils/arrayBuffer.ts';
import { uint8ArrayToString } from '@utils/uint8Array.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the types for the table fields
interface Message {
  id: string;
  ciphertext: string;
  iv: string;
  salt: string;
  expires: string; // ISO string format
}

export async function createMessage(
  ciphertext: ArrayBuffer,
  iv: Uint8Array,
  salt: Uint8Array,
  expires: Date
): Promise<string | null> {
  try {
    // Insert a new message into the table
    const { data: insertData, error: insertError } = await supabase
      .from('messages')
      .insert([
        {
          ciphertext: arrayBufferToBase64(ciphertext),
          iv: uint8ArrayToString(iv),
          salt: uint8ArrayToString(salt),
          expires: expires.toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Fetch the message by id
    const { data: fetchData, error: fetchError } = await supabase
      .from('messages')
      .select()
      .eq('id', insertData.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    return (fetchData as Message).id;
  } catch (error) {
    console.error('Error creating or fetching message:', error);
    return null;
  }
}

export const getMessageById = async (id: string): Promise<Message | null> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as Message;
  } catch (error) {
    console.error('Error fetching message by id:', error);
    return null;
  }
};
