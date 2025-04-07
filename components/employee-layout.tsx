"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bus } from "lucide-react"

export const EmployeeLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`flex flex-col bg-white border-r min-w-[250px] transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <Bus className="h-6 w-6" />
              <span>ETMS Employee</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            <li>
              <Link href="/employee/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100">
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t p-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">{children}</div>
    </div>
  )
}

