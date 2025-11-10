'use client';

import React, { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactFlow, {
  Controls,
  Background,
  MarkerType,
  Position,
  Node,
  Edge,
} from 'reactflow';

import 'reactflow/dist/style.css';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Asset } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: {
      borderRadius: '0.5rem',
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--card-foreground))',
      border: '1px solid hsl(var(--border))',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      width: 180,
      fontSize: '12px',
    },
};

const getClassificationColor = (classification: Asset['classification']) => {
    switch (classification) {
      case 'Critical': return 'hsl(var(--destructive))';
      case 'High': return 'hsl(var(--chart-4))';
      case 'Medium': return 'hsl(var(--chart-3))';
      case 'Low': return 'hsl(var(--chart-2))';
      default: return 'hsl(var(--muted-foreground))';
    }
}

export function AssetRelationshipGraph() {
  const router = useRouter();
  const firestore = useFirestore();
  const assetsQuery = useMemoFirebase(() => collection(firestore, 'assets'), [firestore]);
  const { data: assets, isLoading } = useCollection<Asset>(assetsQuery);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    router.push(`/assets/${node.id}`);
  }, [router]);

  const { nodes, edges } = useMemo(() => {
    if (!assets) {
      return { nodes: initialNodes, edges: initialEdges };
    }

    const newNodes: Node[] = assets.map((asset, index) => ({
      id: asset.id,
      data: { label: (
        <div className="flex flex-col">
            <div className="font-bold text-sm" style={{ color: getClassificationColor(asset.classification) }}>{asset.name}</div>
            <div className="text-xs text-muted-foreground">{asset.type}</div>
        </div>
      )},
      // Position nodes in a circle to start, layout algorithm will override
      position: { x: Math.cos(index * 2 * Math.PI / assets.length) * 300, y: Math.sin(index * 2 * Math.PI / assets.length) * 300 },
      ...nodeDefaults,
    }));

    const newEdges: Edge[] = [];
    assets.forEach(sourceAsset => {
      sourceAsset.relatedAssets?.forEach(relatedAsset => {
        newEdges.push({
          id: `e-${sourceAsset.id}-${relatedAsset.id}-${relatedAsset.relationshipType}`,
          source: sourceAsset.id,
          target: relatedAsset.id,
          label: relatedAsset.relationshipType,
          labelStyle: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: 'hsl(var(--primary))',
          },
          style: {
            stroke: 'hsl(var(--primary))',
            strokeWidth: 1,
          },
        });
      });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [assets]);

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Asset Relationship Graph</CardTitle>
                <CardDescription>Visualizing the connections between your assets.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center h-[500px]">
                    Loading graph...
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Asset Relationship Graph</CardTitle>
            <CardDescription>
                An interactive map of your system architecture. Click any asset to view details.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div style={{ height: '500px' }} className="rounded-lg border bg-background">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={onNodeClick}
                    fitView
                >
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </CardContent>
    </Card>
  );
}
