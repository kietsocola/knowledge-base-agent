export interface Citation {
  sourceIndex: number; // [SOURCE_1] → 1
  chunkId: string;
  documentName: string;
  pageNumber: number;
  quote: string;
}

export interface MessageWithCitations {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  createdAt: number;
}
