import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/data";

/**
 * Two families, clearly distinct: JetBrains Mono carries the identity
 * (headings, labels, terminal, every number), Inter handles running
 * prose where a monospace would slow reading down.
 */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE = "https://neural-gpt.github.io";

export const metadata = {
  metadataBase: new URL(SITE),
  title: `${profile.name} — ${profile.role}`,
  description: profile.blurb,
  keywords: [
    profile.name,
    "AI engineer",
    "machine learning",
    "RAG",
    "computer vision",
    "PyTorch",
    "portfolio",
  ],
  authors: [{ name: profile.name, url: profile.githubUrl }],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    url: SITE,
    siteName: profile.name,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#010110",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  // Structured data — lets search engines read the profile as a person
  // rather than guessing from the page copy.
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    url: SITE,
    image: `${SITE}/og.png`,
    sameAs: [profile.githubUrl],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kanpur",
      addressCountry: "IN",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Kanpur Institute of Technology",
    },
    knowsAbout: [
      "Machine Learning",
      "Natural Language Processing",
      "Retrieval-Augmented Generation",
      "Computer Vision",
      "Anomaly Detection",
    ],
  };

  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:border focus:border-cyan focus:bg-void focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-cyan"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
