"use client";

import { Button } from "@/components/ui/button"
import { Bell, Settings, User, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function AdminHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  return (
    <header className="bg-mj-teal-light border-b border-mj-gold/20 px-6 py-4 fixed top-0 left-0 right-0 z-50" >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          {/* <Image src="/images/mj-logo-gold.png" alt="MJ Properties" width={120} height={40} className="h-8 w-auto" /> */}
          <p className="text-mj-gold font-semibold text-lg" >MJ Properties</p>
          <p className="text-mj-white/60">|</p>
          <span className="text-mj-white font-semibold text-sm">Admin Panel</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-mj-white">
            Welcome, {user?.email}
          </div>
         
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-mj-white hover:text-red-400"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
