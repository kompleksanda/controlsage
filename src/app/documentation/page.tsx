'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function DocumentationPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Application Documentation</CardTitle>
          <CardDescription>
            Understanding the features and concepts within ControlSage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="asset-relationships">
              <AccordionTrigger className="text-lg">Asset Relationships</AccordionTrigger>
              <AccordionContent className="prose max-w-none text-base text-muted-foreground">
                <p>
                  Defining relationships between assets is crucial for understanding your system architecture,
                  tracking dependencies, and assessing risk propagation. Here is a guide to the relationship
                  types available in ControlSage:
                </p>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="font-semibold text-foreground">Connects To</dt>
                    <dd>
                      This relationship is used for network or data flow connections. It signifies that two
                      assets communicate with each other.
                      <br />
                      <strong>Example:</strong> A &apos;Production Web Server&apos; asset <em>Connects To</em> a &apos;Customer Database&apos; asset.
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Depends On</dt>
                    <dd>
                      This is used when one asset requires another asset to function correctly. It implies a
                      dependency where the failure of one asset can directly impact the other.
                      <br />
                      <strong>Example:</strong> A &apos;CRM Application&apos; asset <em>Depends On</em> a &apos;Production Web Server&apos; asset.
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Contains</dt>
                    <dd>
                      This describes a hosting or parent-child relationship. One asset is running on or is a
                      component of another.
                      <br />
                      <strong>Example:</strong> A &apos;Production Web Server&apos; asset <em>Contains</em> a &apos;CRM Application&apos; asset.
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Related To</dt>
                    <dd>
                      This is a general-purpose relationship for cases where assets are linked, but none of
                      the other types are appropriate. Use this for more abstract or indirect connections.
                      <br />
                      <strong>Example:</strong> A &apos;Marketing Website&apos; asset is <em>Related To</em> a &apos;CRM Application&apos; because it sends leads to it, but doesn&apos;t directly connect or depend on it.
                    </dd>
                  </div>
                </dl>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
