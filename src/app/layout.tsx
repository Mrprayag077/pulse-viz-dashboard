import "./globals.css";
import { Navbar, Sidebar } from "@/components";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="p-2 h-screen overflow-auto bg-gray-200">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
