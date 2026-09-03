import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { FULL_ADDRESS } from "@/lib/constants";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
  display: "swap",
});

const SITE_URL = "https://wear-chimsol-s.vercel.app";

export const metadata: Metadata = {
  title: "Wear Chimsol | Tailor in Mabelreign, Harare — Custom Tailoring & Made-to-Order Designs",
  description:
    "Wear Chimsol is a tailor based at Mabelreign Shopping Centre, No.9 Eston Road, Harare, Zimbabwe. We design and sew custom, made-to-order clothing. Browse our designs, order multiple pieces at once, and pay via EcoCash.",
  keywords: [
    "tailor in Harare",
    "tailor in Mabelreign",
    "tailor Zimbabwe",
    "custom tailoring Harare",
    "made to order clothing Zimbabwe",
    "dressmaker Mabelreign",
    "Wear Chimsol",
  ],
  applicationName: "Wear Chimsol",
  openGraph: {
    title: "Wear Chimsol | Tailor in Mabelreign, Harare",
    description:
      "Custom tailoring and made-to-order designs. Visit us at Mabelreign Shopping Centre, No.9 Eston Road, Harare, or order and consult on WhatsApp.",
    url: SITE_URL,
    siteName: "Wear Chimsol",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Wear Chimsol",
    image: `${SITE_URL}/logo.svg`,
    telephone: "+263775178065",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No.9 Eston Road, Mabelreign Shopping Centre",
      addressLocality: "Harare",
      addressCountry: "ZW",
    },
    url: SITE_URL,
    priceRange: "$$",
    description:
      "Custom tailoring and made-to-order clothing designs in Mabelreign, Harare, Zimbabwe.",
  };

  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${workSans.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
