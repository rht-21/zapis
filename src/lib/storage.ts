const DEFAULT_STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || "zapis-content";

async function getEncryptionKey(): Promise<CryptoKey> {
  const envKey = import.meta.env.VITE_ENCRYPTION_KEY;

  if (!envKey) {
    throw new Error(
      "VITE_ENCRYPTION_KEY is not defined in environment variables"
    );
  }

  // Derive a key from the environment variable string
  // We use SHA-256 to ensure we have a 256-bit key
  const encoder = new TextEncoder();
  const keyData = encoder.encode(envKey);
  const hash = await window.crypto.subtle.digest("SHA-256", keyData);

  return window.crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false, // key is not extractable
    ["encrypt", "decrypt"]
  );
}

export async function saveSecurely(
  content: string,
  keyName: string = DEFAULT_STORAGE_KEY
): Promise<void> {
  try {
    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    // Convert to base64 for storage
    const base64 = btoa(String.fromCharCode(...combined));
    localStorage.setItem(keyName, base64);
  } catch (error) {
    console.error("Error saving securely:", error);
  }
}

export async function loadSecurely(
  keyName: string = DEFAULT_STORAGE_KEY
): Promise<string | null> {
  const base64 = localStorage.getItem(keyName);
  if (!base64) return null;

  try {
    const combined = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const key = await getEncryptionKey();

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error("Error loading securely:", error);
    return null;
  }
}
