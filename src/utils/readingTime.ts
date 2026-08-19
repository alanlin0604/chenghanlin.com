/**
 * Rough reading time for an article, in minutes.
 *
 * Counted in two currencies because the site is written in two languages, and
 * they are not comparable: a Chinese reader gets through roughly 400 characters
 * a minute, an English reader roughly 220 words. An article that mixes the two
 * — most of them do, since the technical nouns stay in English — is scored on
 * both and the parts added together.
 *
 * Code blocks are dropped before counting. Nobody reads a snippet at prose
 * speed, and the one long Python block in the RAG article would otherwise add
 * two minutes to a seven-minute piece.
 */
const CJK = /[㐀-鿿豈-﫿぀-ヿ]/g;

export function readingMinutes(body: string): number {
  const prose = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/^import .*$/gm, "")
    .replace(/<[^>]+>/g, " ");

  const cjk = prose.match(CJK)?.length ?? 0;
  const latin = prose.replace(CJK, " ").match(/[\p{L}\p{N}][\p{L}\p{N}'-]*/gu);

  const minutes = cjk / 400 + (latin?.length ?? 0) / 220;

  /* Never zero: "0 分鐘" reads as a bug rather than as a short article. */
  return Math.max(1, Math.round(minutes));
}
