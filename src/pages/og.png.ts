import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";
import config from "@/config";

/**
 * Social card for the site.
 *
 * Deliberately Latin-only. satori renders text with the font buffers handed to
 * it, and the font loaded here covers Latin alphabets — Chinese characters
 * would come out as blank boxes rather than failing loudly. Rather than ship a
 * multi-megabyte CJK TTF through the build purely for link previews, the card
 * shows the romanised name and an English line, which is what a link preview
 * needs to convey in either language. Per-post cards return in Phase 5 and will
 * need a CJK face for Chinese titles.
 */
const OG_TAGLINE =
  "Full-stack developer — RAG, self-hosted model inference, ML forecasting";

const BACKGROUND = "#fdfdfd";
const FOREGROUND = "#282728";
const ACCENT = "#4338ca";
const MUTED = "#5c6270";

export const GET: APIRoute = async context => {
  const fonts = fontData["--font-google-sans-code"];
  const regularFontPath = getFontPathByWeight(fonts, 400);
  const boldFontPath = getFontPathByWeight(fonts, 700);

  if (regularFontPath === undefined || boldFontPath === undefined) {
    throw new Error("Cannot find the font path.");
  }

  const [regularData, boldData] = await Promise.all([
    fetch(experimental_getFontFileURL(regularFontPath, context.url)).then(res =>
      res.arrayBuffer()
    ),
    fetch(experimental_getFontFileURL(boldFontPath, context.url)).then(res =>
      res.arrayBuffer()
    ),
  ]);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          background: BACKGROUND,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          fontFamily: "Google Sans Code",
          color: FOREGROUND,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                width: "96px",
                height: "8px",
                background: ACCENT,
              },
            },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column" },
              children: [
                {
                  type: "div",
                  props: {
                    style: { fontSize: 88, fontWeight: 700, lineHeight: 1.1 },
                    children: config.site.author,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 32,
                      marginTop: "24px",
                      color: MUTED,
                      lineHeight: 1.4,
                    },
                    children: OG_TAGLINE,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                fontSize: 28,
                fontWeight: 700,
                color: ACCENT,
              },
              children: new URL(config.site.url).hostname,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: [
        {
          name: "Google Sans Code",
          data: regularData,
          weight: 400,
          style: "normal",
        },
        {
          name: "Google Sans Code",
          data: boldData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
