"use client";

import { useCallback, useEffect, useState } from "react";

export function usePrintMode() {
  const [printMode, setPrintMode] = useState(false);

  useEffect(() => {
    const onBeforePrint = () => setPrintMode(true);
    const onAfterPrint = () => setPrintMode(false);

    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);

    if (window.matchMedia("print").matches) {
      setPrintMode(true);
    }

    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, []);

  const printDocument = useCallback(() => {
    setPrintMode(true);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        window.print();
      }, 450);
    });
  }, []);

  return { printMode, printDocument };
}
