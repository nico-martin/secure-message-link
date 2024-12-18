# Secure Message Link

An app that allows you encrypt a message and share it with a link.

## How it works

My goal was to create a simple way to share a private message via a URL. And in the safest possible way

### Generate the message

The encryption process is done in the browser, using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

1. A random password is generated (as a uuidv4) and converted to binary format
2. Salt: A random 16-byte value ensures unique encryption, even with the same password
3. Key Derivation: A secure key is created from the password, salt, 100,000 iterations, and SHA-256
4. AES Key: The derived key is turned into an encryption key for AES-GCM
5. Initialization Vector (IV): A 12-byte random value ensures secure encryption. 
6. AES-GCM: Encrypts the message using the derived key and IV. 
7. Output: The function returns the encrypted message (ciphertext), IV, and salt for decryption.

Once the ciphertext, the salt and the iv value have been generated, they are stored in a postgress database (using [Supabase](https://supabase.com/)).  

The ID of the entry is then packed together with the password into a base64 string, which this is then the hash of the link to be sent.

### Open the message

When the link is opened, the hash is decoded, and the password and the ID are extracted. After the confirmation of the user, the encrypted message is fetched (and deleted) from the database.  

The password is then used to decrypt the message, and the result is displayed to the user.

### Security

Since the password is never sent to the server, **I have no way of decrypting the messages from the database.**    
Only the person with the link (and the password it contains) can do this.

## Backend

For the backend I used [Supabase](https://supabase.com/), a service that provides a Postgres database and an API to interact with it.  
However, this would work with pretty much any database technology, as the complex processes run directly in the browser.

### Messages Database

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ciphertext TEXT NOT NULL,
  iv TEXT NOT NULL,
  salt TEXT NOT NULL,
  expires TIMESTAMP NOT NULL
);
```

### Insert Message
Since I am using RLS (Row Level Security) on the table and the user is anonymous, I need to use a function to insert the message..

```sql
CREATE OR REPLACE FUNCTION public.insert_message(
  ciphertext TEXT,
  iv TEXT,
  salt TEXT,
  expires TIMESTAMP
) RETURNS UUID
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.messages (ciphertext, iv, salt, expires)
  VALUES (ciphertext, iv, salt, expires)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;
```

### Get Message by ID

..and another function to then get the message by ID and delete it.

```sql
CREATE OR REPLACE FUNCTION public.get_message_by_id(
  message_id UUID
) RETURNS public.messages
SECURITY DEFINER
AS $$
DECLARE
  result public.messages;
BEGIN
  SELECT * INTO result FROM public.messages WHERE id = message_id AND expires > NOW();
  DELETE FROM public.messages WHERE id = message_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```