import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const stack: symbol[] = [];
let previousOverflow = "";
let previousInert = false;
const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Shared modal boundary: portal, focus trap, Escape, focus restore and background lock. */
export default function ModalLayer({ onClose, children, ...props }:
  React.HTMLAttributes<HTMLDivElement> & { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const token = Symbol("modal");
    const previousFocus = document.activeElement as HTMLElement | null;
    const root = document.getElementById("root");
    if (!stack.length) {
      previousOverflow = document.body.style.overflow;
      previousInert = root?.inert ?? false;
      document.body.style.overflow = "hidden";
      if (root) root.inert = true;
    }
    stack.push(token);
    const candidates = () => Array.from(ref.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
      .filter((element) => element.getClientRects().length > 0 && !element.closest('[inert]'));
    (candidates()[0] ?? ref.current)?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (stack.at(-1) !== token) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeRef.current();
      }
      if (event.key !== "Tab") return;
      const items = candidates();
      const first = items[0];
      const last = items.at(-1);
      if (!first) { event.preventDefault(); ref.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !ref.current?.contains(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !ref.current?.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      stack.splice(stack.indexOf(token), 1);
      document.removeEventListener("keydown", onKey, true);
      if (!stack.length) {
        document.body.style.overflow = previousOverflow;
        if (root) root.inert = previousInert;
      }
      if (previousFocus?.isConnected && !previousFocus.closest('[inert]')) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(
    <div {...props} ref={ref} role="dialog" aria-modal="true" tabIndex={-1}>
      {children}
    </div>, document.body,
  );
}
