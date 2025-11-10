"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { userRoles } from "@/lib/data";
import { useAuth, useFirebase } from "@/firebase";
import { signOut } from "firebase/auth";

const getPageTitle = (pathname: string) => {
  const detailsRegex = /\/(assets|controls)\/.+/;
  if (detailsRegex.test(pathname)) {
    const page = pathname.split('/')[1];
    return page === 'assets' ? 'Asset Details' : 'Control Details';
  }

  switch (pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/assets":
      return "Asset Management";
    case "/controls":
      return "Control Library";
    case "/audit":
      return "Audit Log";
    default:
      return "ControlSage";
  }
};

export function AppHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");
  const auth = useAuth();
  const { user, baseRole, activeRole, setActiveRole, isRoleLoading } = useFirebase();
  const router = useRouter();

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
      router.push('/login');
    }
  };

  const handleRoleChange = (role: string) => {
    if (userRoles.includes(role as any)) {
      setActiveRole(role as any);
    }
  }

  if (!user) {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
        </header>
    );
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        <h1 className="font-semibold text-xl">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-4">
        <form className="ml-auto flex-1 sm:flex-initial hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
            />
          </div>
        </form>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {userAvatar && (
                <Image
                  src={user?.photoURL || userAvatar.imageUrl}
                  width={36}
                  height={36}
                  alt="User Avatar"
                  data-ai-hint={userAvatar.imageHint}
                  className="rounded-full"
                />
              )}
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.displayName || user?.email} ({activeRole})</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            {baseRole === 'Admin' && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={activeRole ?? ''} onValueChange={handleRoleChange}>
                        {userRoles.map((role) => (
                           <DropdownMenuRadioItem key={role} value={role}>
                             {role}
                           </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
