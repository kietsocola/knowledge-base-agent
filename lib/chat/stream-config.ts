export const CHAT_STREAM_DELAY_MS = 8

// Keep punctuation and trailing whitespace attached so Vietnamese text appears
// in small natural chunks without waiting for entire phrases.
export const CHAT_STREAM_CHUNKING =
  /[\p{L}\p{N}_]+(?:\s+)?|[^\s\p{L}\p{N}_]+/gu
