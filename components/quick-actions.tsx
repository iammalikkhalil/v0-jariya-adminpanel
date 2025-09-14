"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, Languages, Plus, Settings } from "lucide-react"

const quickActions = [
  {
    title: "Add New Zikr",
    description: "Create a new Zikr entry",
    href: "/admin/zikrs/add",
    icon: Plus,
    color: "text-primary",
  },
  {
    title: "Manage Collections",
    description: "Organize Zikrs into collections",
    href: "/admin/collections",
    icon: FolderOpen,
    color: "text-secondary",
  },
  {
    title: "Review Translations",
    description: "Verify pending translations",
    href: "/admin/translations/zikr",
    icon: Languages,
    color: "text-primary",
  },
  {
    title: "Manage Tags",
    description: "Organize and categorize content",
    href: "/admin/tags",
    icon: Settings,
    color: "text-secondary",
  },
]

export function QuickActions() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-islamic">Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto p-4 justify-start hover:bg-accent transition-colors bg-transparent"
              >
                <div className="flex items-start space-x-3">
                  <action.icon className={`h-5 w-5 mt-0.5 ${action.color}`} />
                  <div className="text-left">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
