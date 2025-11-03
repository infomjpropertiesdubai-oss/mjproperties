"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  UserCheck,
  Mail,
  ClipboardList,
  Image,
} from "lucide-react"

const navigation = [
  // { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Hero Sections", href: "/admin/hero-sections", icon: Image },
  { name: "Properties", href: "/admin/properties", icon: Building2 },
  { name: "Team Members", href: "/admin/team", icon: UserCheck },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Consultation Requests", href: "/admin/consultation-requests", icon: ClipboardList },
  { name: "Property Inquiries", href: "/admin/property-inquiries", icon: MessageSquare },
  { name: "Newsletter Subscribers", href: "/admin/newsletter-subscriptions", icon: Mail },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-mj-teal-light border-r border-mj-gold/20">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-mj-gold text-mj-teal" : "text-mj-white hover:text-mj-gold hover:bg-mj-dark",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
