import { visit } from "unist-util-visit";

/**
 * Wrap every Markdown table in its own horizontally scrollable container.
 *
 * A comparison table has a minimum width below which it stops being readable,
 * and at 320px the English ones exceed the viewport — "Interpretability" and
 * "Overfitting risk" cannot break the way Chinese can, so the whole page
 * scrolled sideways rather than just the table.
 *
 * The obvious CSS-only fix is `table { display: block; overflow-x: auto }`, and
 * it is avoided deliberately: changing a table's `display` drops its table
 * semantics in some browser and screen-reader combinations, so the rows and
 * columns stop being announced as a grid. A wrapper element scrolls without
 * touching the table itself.
 *
 * `tabindex="0"` is required, not decoration: a scrollable region that cannot
 * be focused cannot be scrolled by keyboard alone. That is also all axe's
 * `scrollable-region-focusable` rule asks for — deliberately no `role="region"`,
 * because a landmark with no accessible name is worse than no landmark, and
 * there is nothing generic to name a Markdown table with.
 */
export default function rehypeScrollableTables() {
  return tree => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "table" || !parent || index === undefined) return;
      if (parent.type === "element" && parent.properties?.dataTableScroll) {
        return;
      }

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: {
          dataTableScroll: true,
          className: ["table-scroll"],
          tabIndex: 0,
        },
        children: [node],
      };
    });
  };
}
