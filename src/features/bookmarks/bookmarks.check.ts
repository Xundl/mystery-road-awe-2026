// Run with: npm run check:bookmarks
// Demonstrates that toggleBookmark is immutable.
import { toggleBookmark } from "./bookmarks";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`ok - ${message}`);
}

const before = ["E01", "E02"];
const snapshot = [...before];

const added = toggleBookmark(before, "E03");
assert(added !== before, "adding returns a new array (different reference)");
assert(added.join() === "E01,E02,E03", "adding appends the id");
assert(
  before.join() === snapshot.join(),
  "original array is unchanged after add",
);

const removed = toggleBookmark(before, "E01");
assert(
  removed !== before,
  "removing returns a new array (different reference)",
);
assert(removed.join() === "E02", "removing drops the id");
assert(
  before.join() === snapshot.join(),
  "original array is unchanged after remove",
);
