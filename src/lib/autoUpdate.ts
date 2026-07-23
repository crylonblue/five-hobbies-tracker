/* ------------------------------------------------------------------ *
 * Keep the installed PWA fresh. iOS home-screen apps often resume a
 * frozen session instead of reloading, so whenever the app returns to
 * the foreground we check whether a newer build has shipped and, if so,
 * reload once to pick it up. No service worker = no stale offline shell.
 * ------------------------------------------------------------------ */

// The hashed entry script this session booted with. In dev there is no
// /assets/ bundle, so this is null and the check is a no-op.
const bootSrc =
  document
    .querySelector('script[type="module"][src*="/assets/"]')
    ?.getAttribute("src") ?? null;

let checking = false;

async function checkForUpdate() {
  if (!bootSrc || checking) return;

  // Don't yank the page out from under someone who's typing a note.
  const el = document.activeElement;
  if (el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT")) return;

  checking = true;
  try {
    const res = await fetch("/", { cache: "no-store" });
    if (!res.ok) return;
    const html = await res.text();
    const match = html.match(/\/assets\/index-[\w-]+\.js/);
    if (match && match[0] !== bootSrc) {
      location.reload();
    }
  } catch {
    // offline or hiccup — try again next time we're foregrounded
  } finally {
    checking = false;
  }
}

export function registerAutoUpdate() {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkForUpdate();
  });
  window.addEventListener("focus", checkForUpdate);
}
