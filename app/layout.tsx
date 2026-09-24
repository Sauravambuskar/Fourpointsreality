import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "FourPoints Realty | Thoughtful spaces. Considered living.",
  description:
    "Curated residences, thoughtful spaces and exceptional real estate across Pune.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script id="force-site-start" strategy="beforeInteractive">
          {`(function () {
            var resetToStart = function () {
              window.scrollTo(0, 0);
              requestAnimationFrame(function () { window.scrollTo(0, 0); });
            };
            if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
            document.documentElement.classList.add('is-loading');
            resetToStart();
            window.setTimeout(function () {
              document.documentElement.classList.remove('is-loading');
            }, 5000);
            window.addEventListener('load', resetToStart, { once: true });
            window.addEventListener('pageshow', function (event) {
              if (event.persisted) {
                window.location.reload();
                return;
              }
              resetToStart();
            });
          })();`}
        </Script>
      </body>
    </html>
  );
}
