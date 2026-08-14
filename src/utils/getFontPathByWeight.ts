import type { FontData } from "astro:assets";

const EXTENSION_BY_FORMAT: Record<string, string[]> = {
  truetype: [".ttf"],
  opentype: [".otf"],
  woff2: [".woff2"],
  woff: [".woff"],
};

/**
 * Pick one concrete font file out of Astro's resolved font data.
 *
 * Matching on the format label alone is not enough: the label a provider
 * reports is not guaranteed, and picking the wrong entry here fails far away
 * from the cause — satori parses the buffer and throws "Unsupported OpenType
 * signature wOF2", which reads like a satori bug rather than a file-selection
 * one. The file extension is checked as well so the caller reliably gets the
 * format it asked for.
 */
export function getFontPathByWeight(
  fonts: FontData[],
  weight: number,
  options?: {
    style?: "normal" | "italic";
    format?: string;
  }
): string | undefined {
  const style = options?.style ?? "normal";
  const format = options?.format ?? "truetype";
  const extensions = EXTENSION_BY_FORMAT[format] ?? [];

  const matchesFormat = (src: FontData["src"][number]) =>
    src.format === format ||
    extensions.some(extension => src.url.toLowerCase().endsWith(extension));

  for (const font of fonts) {
    if (font.weight === String(weight) && font.style === style) {
      const src = font.src.find(matchesFormat);
      if (src) return src.url;
    }
  }

  return undefined;
}
