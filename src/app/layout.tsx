import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "HomePage",
  description: "This is a dummy meta-description for Homepage.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
