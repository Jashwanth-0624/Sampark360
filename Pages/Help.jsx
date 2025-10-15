import React from 'react';
import { BookOpen, LifeBuoy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card.jsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion.jsx";

export default function Help() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-orange-500" />
        Help & Training
      </h1>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions about the portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I add a new project?</AccordionTrigger>
              <AccordionContent>
                Navigate to the "Projects List" page and click the "Create New Project" button to launch the project creation wizard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Where can I find my pending approvals?</AccordionTrigger>
              <AccordionContent>
                All items requiring your approval are listed in the "Approvals" page under the "Pending" tab.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LifeBuoy /> Support</CardTitle>
          <CardDescription>Contact support for further assistance.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>For technical issues, please email <a href="mailto:support@pm-ajay.gov.in" className="text-blue-600">support@pm-ajay.gov.in</a>.</p>
        </CardContent>
      </Card>
    </div>
  );
}