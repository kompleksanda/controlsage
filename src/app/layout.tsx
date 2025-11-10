import React from 'react';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app/app-sidebar';
import { AppHeader } from '@/components/app/header';
import { FirebaseClientProvider } from '@/firebase';


export const metadata: Metadata = {
  title: 'ControlSage',
  description: 'Modern IT & Information Security Control Management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <FirebaseClientProvider>
            <SidebarProvider>
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <AppHeader />
                <SidebarInset>
                  <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    {children}
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
