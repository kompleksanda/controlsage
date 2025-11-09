'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, PlusCircle } from "lucide-react";
import { ControlTable } from "@/components/app/control-table";

export default function ControlsPage() {
  const [frameworkFilter, setFrameworkFilter] = useState('all');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
            <div>
                <CardTitle>Control Library</CardTitle>
                <CardDescription>
                    Browse and manage your organization&apos;s security controls.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-1">
                    <FileDown className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Export
                    </span>
                </Button>
                <Button size="sm" className="gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        New Control
                    </span>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setFrameworkFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ISO 27001">ISO 27001</TabsTrigger>
            <TabsTrigger value="NIST">NIST</TabsTrigger>
            <TabsTrigger value="CIS" className="hidden sm:flex">CIS</TabsTrigger>
            <TabsTrigger value="Custom" className="hidden sm:flex">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value={frameworkFilter}>
            <ControlTable frameworkFilter={frameworkFilter} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
