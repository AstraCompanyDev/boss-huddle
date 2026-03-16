import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import resourceBusinessPlan from "@/assets/resource-business-plan.jpg";
import resourcePitchDeck from "@/assets/resource-pitch-deck.jpg";
import resourceFinancialModel from "@/assets/resource-financial-model.jpg";
import resourceMarketing from "@/assets/resource-marketing.jpg";
import resourceFundraising from "@/assets/resource-fundraising.jpg";
import resourceProductLaunch from "@/assets/resource-product-launch.jpg";

const resources = [
  {
    id: 1,
    title: "Business Plan Template",
    description: "A comprehensive business plan template to help you outline your startup's vision, strategy, and financial projections.",
    category: "Planning",
    image: resourceBusinessPlan,
    fileSize: "2.4 MB",
    downloadUrl: "#",
  },
  {
    id: 2,
    title: "Pitch Deck Guide",
    description: "Step-by-step guide to building a compelling investor pitch deck with real examples from successful startups.",
    category: "Fundraising",
    image: resourcePitchDeck,
    fileSize: "5.1 MB",
    downloadUrl: "#",
  },
  {
    id: 3,
    title: "Financial Model Spreadsheet",
    description: "Ready-to-use financial model with revenue projections, expense tracking, and runway calculations.",
    category: "Finance",
    image: resourceFinancialModel,
    fileSize: "1.8 MB",
    downloadUrl: "#",
  },
  {
    id: 4,
    title: "Marketing Strategy Playbook",
    description: "Proven marketing frameworks and channel strategies tailored for early-stage startups with limited budgets.",
    category: "Marketing",
    image: resourceMarketing,
    fileSize: "3.2 MB",
    downloadUrl: "#",
  },
  {
    id: 5,
    title: "Fundraising Guide",
    description: "Everything you need to know about raising your first round — from term sheets to investor outreach templates.",
    category: "Fundraising",
    image: resourceFundraising,
    fileSize: "4.5 MB",
    downloadUrl: "#",
  },
  {
    id: 6,
    title: "Product Launch Checklist",
    description: "A thorough pre-launch and launch-day checklist covering product, marketing, support, and analytics.",
    category: "Product",
    image: resourceProductLaunch,
    fileSize: "1.2 MB",
    downloadUrl: "#",
  },
];

export default function Resources() {
  const [search, setSearch] = useState("");

  const filtered = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground mt-1">
          Download guides, templates, and tools to accelerate your startup journey.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((resource) => (
          <Card key={resource.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="aspect-[4/3] overflow-hidden bg-secondary">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {resource.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  PDF · {resource.fileSize}
                </span>
              </div>
              <h3 className="font-semibold text-lg leading-tight">{resource.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {resource.description}
              </p>
              <Button className="w-full rounded-full mt-2" asChild>
                <a href={resource.downloadUrl} download>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No resources found matching your search.</p>
        </div>
      )}
    </div>
  );
}
