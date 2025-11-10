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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { AssetTable } from "@/components/app/asset-table";
import { AiControlSuggester } from "@/components/app/ai-control-suggester";
import { NewAssetForm } from "@/components/app/new-asset-form";
import { useFirebase } from '@/firebase';

export default function AssetsPage() {
  const [assetTypeFilter, setAssetTypeFilter] = useState('all');
  const [isNewAssetDialogOpen, setIsNewAssetDialogOpen] = useState(false);
  const { user, isAdmin, isRoleLoading } = useFirebase();

  if (isRoleLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to continue.</div>;
  }

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
                          {isAdmin && (
                            <Dialog open={isNewAssetDialogOpen} onOpenChange={setIsNewAssetDialogOpen}>
                              <DialogTrigger asChild>
                                  <Button size="sm" className="gap-1">
                                      <PlusCircle className="h-3.5 w-3.5" />
                                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                          New Asset
                                      </span>
                                  </Button>
                              </DialogTrigger>
                              <DialogContent>
                                  <DialogHeader>
                                      <DialogTitle>Create New Asset</DialogTitle>
                                  </DialogHeader>
                                  <NewAssetForm setDialogOpen={setIsNewAssetDialogOpen} />
                              </DialogContent>
                            </Dialog>
                          )}
                      </div>
                  </CardHeader>
                  <CardContent>
                      <Tabs defaultValue="all" onValueChange={setAssetTypeFilter}>
                          <TabsList>
                              <TabsTrigger value="all">All</TabsTrigger>
                              <TabsTrigger value="Server">Servers</TabsTrigger>
                              <TabsTrigger value="Application">Applications</TabsTrigger>
                              <TabsTrigger value="Database" className="hidden sm:flex">Databases</TabsTrigger>
                              <TabsTrigger value="Endpoint" className="hidden sm:flex">Endpoints</TabsTrigger>
                              <TabsTrigger value="Software Feature" className="hidden sm:flex">Software Features</TabsTrigger>
                          </TabsList>
                          <TabsContent value={assetTypeFilter}>
                            <AssetTable assetTypeFilter={assetTypeFilter} />
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
