"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  LayoutDashboard,
  Languages,
  Tags,
  Award,
  FileText,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react"
import { clearStoredAdmin, getStoredAdmin } from "@/lib/auth"
import { logoutAdmin } from "@/lib/api/auth"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Zikrs",
    icon: BookOpen,
    children: [
      { title: "All Zikrs", href: "/admin/zikrs" },
      { title: "Add Zikr", href: "/admin/zikrs/add" },
    ],
  },
  {
    title: "Translations",
    icon: Languages,
    children: [
      { title: "Zikr Translations", href: "/admin/translations/zikr" },
      { title: "Hadith Translations", href: "/admin/translations/hadith" },
    ],
  },
  {
    title: "Tags",
    icon: Tags,
    children: [
      { title: "All Tags", href: "/admin/tags" },
      { title: "Map Tags to Zikr", href: "/admin/tags/mapping" },
    ],
  },
  {
    title: "Rewards & Qualities",
    href: "/admin/rewards-qualities",
    icon: Award,
  },
  {
    title: "Hadiths",
    icon: FileText,
    children: [
      { title: "All Hadiths", href: "/admin/hadiths" },
      { title: "Add Hadith to Zikr", href: "/admin/hadiths/add" },
    ],
  },
  {
    title: "Collections",
    icon: FolderOpen,
    children: [
      { title: "All Collections", href: "/admin/collections" },
      { title: "Add Collection", href: "/admin/collections/add" },
      { title: "Collection Zikr Mapping", href: "/admin/collections/mapping" },
    ],
  },
  {
    title: "Quran",
    icon: FolderOpen,
    children: [
      { title: "All Quran Lines", href: "/admin/quran" },
      { title: "Add Quran Lines", href: "/admin/quran/add" },
    ],
  },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["Zikrs"])
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutAdmin()
    } catch (error) {
      console.error("Logout API call failed:", error)
    } finally {
      clearStoredAdmin()
      router.push("/login")
    }
  }

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isActive = (href: string) => pathname === href

  const admin = getStoredAdmin()

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && <h1 className="text-xl font-islamic text-sidebar-primary">Jariya Admin</h1>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.href ? (
                <Link href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                      isActive(item.href) &&
                        "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                      collapsed && "px-2",
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                    {!collapsed && item.title}
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => !collapsed && toggleExpanded(item.title)}
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                      collapsed && "px-2",
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {expandedItems.includes(item.title) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </Button>
                  {!collapsed && expandedItems.includes(item.title) && item.children && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href}>
                          <Button
                            variant={isActive(child.href) ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                              "w-full justify-start text-sm text-sidebar-foreground hover:bg-sidebar-accent",
                              isActive(child.href) &&
                                "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                            )}
                          >
                            {child.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer with user info and logout */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border space-y-3">
          {admin && (
            <div className="text-xs text-sidebar-foreground/80">
              <p className="font-medium">{admin.name || admin.email}</p>
              <p className="text-sidebar-foreground/60">{admin.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <p className="text-xs text-sidebar-foreground/60 text-center">Jariya Admin Panel v1.0</p>
        </div>
      )}
    </div>
  )
}
