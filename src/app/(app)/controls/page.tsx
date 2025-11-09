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
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="iso">ISO 27001</TabsTrigger>
            <TabsTrigger value="nist">NIST</TabsTrigger>
            <TabsTrigger value="cis" className="hidden sm:flex">CIS</TabsTrigger>
            <TabsTrigger value="custom" className="hidden sm:flex">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ControlTable />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
