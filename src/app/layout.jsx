import "./globals.css";

export const metadata = {
  title: "Anusha Kallempudi | Software Engineer & AI/ML",
  description: "Anusha Kallempudi — software engineer and M.S. Artificial Intelligence student building thoughtful software and applied AI experiences.",
  metadataBase: new URL("https://anushakallempudi12.github.io"),
  openGraph: {
    title: "Anusha Kallempudi | Software Engineer & AI/ML",
    description: "Software engineering, data and applied AI.",
    url: "https://anushakallempudi12.github.io/portfolio/",
    siteName: "Anusha Kallempudi",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}