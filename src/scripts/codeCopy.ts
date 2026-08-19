/**
 * Adds the copy control to each code block's header bar.
 *
 * Built in the browser rather than in the HTML on purpose: the button only
 * does anything if this file ran, and a button that silently fails is worse
 * than a snippet the reader selects by hand. The bar itself is server-rendered
 * (see rehypeCodeHeader.mjs) so nothing moves when this arrives.
 */
const LABELS = {
  "zh-Hant": { copy: "複製", done: "已複製" },
  en: { copy: "Copy", done: "Copied" },
} as const;

/** How long the confirmation stays before the button offers itself again. */
const CONFIRM_MS = 1600;

function labelsForPage() {
  const lang = document.documentElement.lang || "en";
  return lang.startsWith("zh") ? LABELS["zh-Hant"] : LABELS.en;
}

function addCopyButtons() {
  if (!navigator.clipboard) return;

  const labels = labelsForPage();

  document.querySelectorAll<HTMLElement>(".code-block__bar").forEach(bar => {
    if (bar.querySelector("[data-code-copy]")) return;

    const code = bar.parentElement?.querySelector("pre")?.textContent;
    if (!code) return;

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.codeCopy = "";
    button.className = "code-block__copy";
    button.textContent = labels.copy;

    let reset: ReturnType<typeof setTimeout> | undefined;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        /* Denied permission or an insecure context. Say nothing and leave the
           text where the reader can select it themselves. */
        return;
      }
      button.textContent = labels.done;
      // `aria-live` on the button would announce every re-render; setting the
      // label and letting the reader's own focus report it is enough.
      clearTimeout(reset);
      reset = setTimeout(() => {
        button.textContent = labels.copy;
      }, CONFIRM_MS);
    });

    bar.append(button);
  });
}

addCopyButtons();
document.addEventListener("astro:after-swap", addCopyButtons);
