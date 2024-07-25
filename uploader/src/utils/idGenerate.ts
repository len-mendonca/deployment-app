import { Mutex } from "async-mutex";
const charSet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const idLength = 5;
let counter = 0;
const mutex = new Mutex();

function base62Encode(number: number): string {
  let base62 = "";
  do {
    base62 = charSet[number % charSet.length] + base62;
    number = Math.floor(number / charSet.length);
  } while (number > 0);
  return base62.padStart(idLength, "0");
}

export async function generateUniqueId(): Promise<string> {
  const release = await mutex.acquire();
  try {
    const uniqueId = base62Encode(counter);
    counter++;
    return uniqueId;
  } finally {
    release();
  }
}
