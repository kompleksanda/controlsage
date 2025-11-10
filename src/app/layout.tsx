import React from 'react';
import type {Metadata} from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app/app-sidebar';
import { AppHeader } from '@/components/app/header';
import { FirebaseClientProvider } from '@/firebase';
import { redirect } from 'next/navigation';
import { getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'ControlSage',
  description: 'Modern IT & Information Security Control Management',
};

async function checkAuth() {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return false;
  
    try {
        await getAuth(getApp()).verifySessionCookie(sessionCookie, true);
        return true;
    } catch (error) {
        return false;
    }
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const publicRoutes = ['/login', '/signup', '/forgot-password'];
  const isLoggedIn = await checkAuth();
  const currentPath = headers().get('next-url') || '';
  
  if (!isLoggedIn && !publicRoutes.includes(currentPath)) {
    redirect('/login');
  }

  if (isLoggedIn && publicRoutes.includes(currentPath)) {
    redirect('/dashboard');
  }


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
