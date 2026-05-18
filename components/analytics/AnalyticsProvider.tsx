"use client";

import { Suspense } from "react";
import { MetaPixel } from "./MetaPixel";
import { GoogleAnalytics } from "./GoogleAnalytics";

export function AnalyticsProvider() {
  return (
    <>
      <Suspense fallback={null}>
        <MetaPixel />
      </Suspense>
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
    </>
  );
}
