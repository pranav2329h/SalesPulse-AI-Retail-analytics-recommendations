// src/lib/fetchJSON.js
import { apiUrl } from './api.js';

export async function fetchJSON(path, opts = {}) {
  const url = path.startsWith('http') ? path : apiUrl(path);
  const res = await fetch(url, opts);

  const text = await res.text(); // tolerate non-JSON / empty
  if (!text) {
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Non-JSON from ${url} (${res.status}): ${text.slice(0, 180)}`
    );
  }
}
