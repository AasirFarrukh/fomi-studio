import "./globals.css";

export const metadata = {
  title: "Fomi Studio",
  description: "Describe an image or video, watch it develop.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
