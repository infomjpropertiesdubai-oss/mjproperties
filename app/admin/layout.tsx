import type React from "react"
import { Suspense } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import AdminHeader from "@/components/admin-header"
import ProtectedRoute from "@/components/protected-route"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 ml-64">
            <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>{children}</Suspense>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
