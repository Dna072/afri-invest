import type { DocumentProvider } from "@/providers/types";

const files = new Map<string, { body: string; contentType: string }>();

export class MockDocumentProvider implements DocumentProvider {
  async store(input: { key: string; contentType: string; body: string }) {
    files.set(input.key, { body: input.body, contentType: input.contentType });
    return { storageKey: input.key };
  }

  async get(storageKey: string) {
    return files.get(storageKey) ?? { body: "", contentType: "text/plain" };
  }
}
