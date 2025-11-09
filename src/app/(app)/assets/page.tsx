import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { AssetTable } from "@/components/app/asset-table";
import { AiControlSuggester } from "@/components/app/ai-control-suggester";

export default function AssetsPage() {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card>
                <CardHeader className="px-7">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Assets</CardTitle>
                            <CardDescription>
                                Manage and monitor your organization&apos;s IT assets.
                            </CardDescription>
                        </div>
                        <Button size="sm" className="gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                New Asset
                            </span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="server">Servers</TabsTrigger>
                            <TabsTrigger value="application">Applications</TabsTrigger>
                            <TabsTrigger value="database" className="hidden sm:flex">Databases</TabsTrigger>
                            <TabsTrigger value="endpoint" className="hidden sm:flex">Endpoints</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all">
                            <AssetTable />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
        <div>
            <AiControlSuggester />
        </div>
    </div>
  );
}
