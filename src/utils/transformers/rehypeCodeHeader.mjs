/**
 * Give every fenced code block a header bar carrying its language, and a slot
 * for the copy control.
 *
 * The bar is built here rather than in the browser so it is in the HTML the
 * reader is served: a header that appears after hydration moves the article
 * under the reader's eye, and the language of a snippet is part of the
 * document, not an enhancement to it.
 *
 * The copy button is the opposite case and is added by the client script
 * instead — a button that cannot copy because nothing ran is worse than no
 * button, so it only exists where it works.
 */
import { visit } from "unist-util-visit";

/* Shiki hands the class list over as one space-separated string
   ("astro-code astro-code-themes min-light night-owl"), while hast built from
   parsed HTML gives an array. Both shapes turn up here. */
const hasClass = (node, name) => {
  const value = node.properties?.className;
  if (!value) return false;
  const list = Array.isArray(value) ? value : String(value).split(/\s+/);
  return list.includes(name);
};

export default function rehypeCodeHeader() {
  return tree => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre") return;
      if (!parent || typeof index !== "number") return;
      if (parent.type === "element" && hasClass(parent, "code-block")) return;

      /* This plugin is registered after Shiki but Astro runs it against the
         tree before highlighting, so the block arrives in either shape
         depending on the pipeline: a highlighted `pre.astro-code` carrying
         `data-language`, or the plain `pre > code.language-python` that
         remark-rehype produced. Read whichever is there. */
      const fromData = node.properties?.dataLanguage;
      const codeChild = node.children?.find(
        child => child.type === "element" && child.tagName === "code"
      );
      const fromClass = codeChild?.properties?.className;
      const classList = Array.isArray(fromClass)
        ? fromClass
        : String(fromClass ?? "").split(/\s+/);
      const fromCode = classList
        .find(cls => cls.startsWith("language-"))
        ?.slice("language-".length);

      const language = typeof fromData === "string" ? fromData : fromCode;
      /* `plaintext` is Shiki's fallback for a fence with no language on it.
         Printing it would label the block with the absence of a label. */
      const label =
        language && language !== "plaintext" ? language.toUpperCase() : null;

      const heading = [];
      if (label) heading.push(label);

      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: { className: ["code-block"] },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["code-block__bar"] },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: { className: ["code-block__name"] },
                children: [{ type: "text", value: heading.join(" · ") }],
              },
            ],
          },
          node,
        ],
      };
    });
  };
}
