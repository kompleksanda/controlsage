"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getSuggestions } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, ListChecks, Loader2 } from 'lucide-react';

const initialState = {
  message: null,
  suggestions: [],
  errors: undefined
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            Get Suggestions
        </Button>
    );
}

export function AiControlSuggester() {
  const [state, formAction] = useActionState(getSuggestions, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Control Suggester</CardTitle>
        <CardDescription>
          Get relevant IT control suggestions based on asset type and risk profile.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assetType">Asset Type</Label>
            <Select name="assetType" required>
              <SelectTrigger id="assetType">
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="endpoint">Endpoint</SelectItem>
                <SelectItem value="network device">Network Device</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.assetType && <p className="text-sm font-medium text-destructive">{state.errors.assetType}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="riskProfile">Risk Profile</Label>
            <Select name="riskProfile" required>
              <SelectTrigger id="riskProfile">
                <SelectValue placeholder="Select risk profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.riskProfile && <p className="text-sm font-medium text-destructive">{state.errors.riskProfile}</p>}
          </div>
        </CardContent>
        <CardFooter>
            <SubmitButton />
        </CardFooter>
      </form>

      {(state?.suggestions && state.suggestions.length > 0) || state?.message ? (
         <CardContent>
            {state.message ? (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            ) : (
                <Alert>
                    <ListChecks className="h-4 w-4" />
                    <AlertTitle>Suggested Controls</AlertTitle>
                    <AlertDescription>
                        <ul className="mt-2 list-disc list-inside space-y-1">
                        {state.suggestions?.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
        </CardContent>
      ) : null}
    </Card>
  );
}
