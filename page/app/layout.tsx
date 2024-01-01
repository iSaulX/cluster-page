import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Link } from "@nextui-org/link";
import clsx from "clsx";


export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Admins Page</title>
      </head>
      <body className="bg-[url('https://files.catbox.moe/rreqr3.png')]">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <div className="flex flex-col flex-grow">
              <main className="flex-grow">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>

  );
}