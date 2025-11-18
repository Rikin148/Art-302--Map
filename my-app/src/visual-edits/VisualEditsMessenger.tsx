"use client";

import { useEffect } from "react";

/**
 * Lightweight bridge that forwards route information to the parent frame
 * when this Next.js app is embedded inside an editor/preview surface.
 * Renders nothing in the DOM.
 */
export default function VisualEditsMessenger() {
  useEffect(() => {
    const inIframe = typeof window !== "undefined" && window.parent !== window;
    if (!inIframe) {
      return;
    }

    const sendRoute = () => {
      window.parent.postMessage(
        {
          type: "ROUTE_CHANGE",
          href: window.location.href,
        },
        "*",
      );
    };

    sendRoute();
    window.addEventListener("popstate", sendRoute);
    window.addEventListener("hashchange", sendRoute);

    return () => {
      window.removeEventListener("popstate", sendRoute);
      window.removeEventListener("hashchange", sendRoute);
    };
  }, []);

  return null;
}

