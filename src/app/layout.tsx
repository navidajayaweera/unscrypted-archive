import "./globals.css";

export const metadata = {
  title: "Protocol UNsCRYPTED — Archive System",
  description:
    "Year 2035. After the Coronal Mass Ejection, humanity survives in bunkers. The Archive preserves knowledge to help survivors rebuild.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-mono antialiased">
        <div className="scan-sweep" />
        {children}
      </body>
    </html>
  );
}
