export const CHAT_STREAM_DELAY_MS = 8

// Locale-aware segmentation avoids splitting Vietnamese text at combining marks
// such as "tr" + "úc", which feels jerky in realtime chat.
export const CHAT_STREAM_CHUNKING = new Intl.Segmenter("vi", {
  granularity: "word",
})
