import "./globals.css";
import { AuthNavbar } from "@/app/components/AuthNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          <link rel="stylesheet" href="/bootstrap.min.css"/>
          <title>Développons nos compétences</title>
      </head>
      <body>
        <AuthNavbar />
        <div className="container">
            {children}

        </div>
      </body>
    </html>
  );
}
