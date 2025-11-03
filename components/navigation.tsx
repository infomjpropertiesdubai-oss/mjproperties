"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone, Mail } from "lucide-react"

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "About Us", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Blog", href: "/blog" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-mj-gold/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-row items-center space-x-2">
            <Image src="/images/mj-icon.png" alt="MJ Properties" width={40} height={40} className="h-10 w-10" sizes="40px" priority />
            <p className="text-mj-gold font-semibold text-base hidden md:block mt-1">MJ Properties</p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="relative flex justify-center">
            <div className="hidden md:flex flex-row items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href ? "text-mj-gold" : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4 pl-[32.54px]">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            </div>
            <Link href="/contact" className="bg-mj-gold text-mj-teal hover:bg-mj-gold/90 cursor-pointer px-3 py-1.5 rounded-md">Contact Us</Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] px-4">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="flex flex-row items-center space-x-2 mb-8">
                  <Image
                    src="/images/mj-icon.png"
                    alt="MJ Properties"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                    sizes="40px"
                  />
                  <p className="text-mj-gold font-semibold text-base mt-1">MJ Properties</p>
                </Link>

                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-lg font-medium transition-colors py-2  ${
                      pathname === item.href ? "text-mj-gold" : "text-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="w-full bg-mj-gold text-mj-teal hover:bg-mj-gold/90 cursor-pointer px-3 py-1.5 rounded-md text-center">
                  <Link href="/contact" className="w-full">Contact Us</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
