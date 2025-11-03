
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
export default function AdminPage() {
  const router = useRouter()
  useEffect(() => {
    router.push("/admin/properties")
  }, [])
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mj-gold"></div>
    </div>
  )
}

