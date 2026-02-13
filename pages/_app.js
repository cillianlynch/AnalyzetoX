import { useEffect } from "react";
import posthog from "posthog-js";
import { Analytics } from "@vercel/analytics/next";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    console.log("POSTHOG ENV CHECK:", { key: !!key, host });

    if (!key || !host) {
      console.warn("❌ PostHog NOT started: missing env vars");
      return;
    }

    console.log("✅ PostHog STARTING:", host);

    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      debug: true,
    });

    posthog.capture("posthog_test_event"); // proof event
    console.log("✅ PostHog test event fired");
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
