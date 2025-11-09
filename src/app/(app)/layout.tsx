import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app/app-sidebar';
import { AppHeader } from '@/components/app/header';
import { FirebaseClientProvider } from '@/firebase';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <AppHeader />
        <SidebarInset>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            <FirebaseClientProvider>{children}</FirebaseClientProvider>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
