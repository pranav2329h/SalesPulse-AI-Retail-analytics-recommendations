// src/lib/fetchJSON.js
export async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts)
  const text = await res.text() // <-- read text first
  if (!text) {
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    // ok + empty -> return null/{} as you prefer
    return null
  }
  try {
    return JSON.parse(text)
  } catch (e) {
    // Not JSON; throw detailed error so UI can show a friendly message
    throw new Error(`Non-JSON response from ${url} (${res.status}): ${text.slice(0, 200)}`)
  }
}
