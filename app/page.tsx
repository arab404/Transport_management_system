import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Bus, Calendar, Clock, MapPin, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Bus className="h-6 w-6" />
            <span>ETMS</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Employee Transport Management System
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Seamless pick-up and drop-off management for your organization. Simplify employee transportation
                    with our intuitive system.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="w-full">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=550&width=550"
                  alt="Employee Transport"
                  className="aspect-square overflow-hidden rounded-xl object-cover"
                  width={550}
                  height={550}
                />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to manage employee transportation
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides a comprehensive solution for managing employee transportation needs with ease.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Admin Dashboard</CardTitle>
                  <CardDescription>
                    Comprehensive control panel for administrators to manage all aspects of the transport system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Manage drivers and vehicles</li>
                    <li>View and approve bookings</li>
                    <li>Generate reports</li>
                    <li>Monitor vehicle utilization</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Calendar className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Booking System</CardTitle>
                  <CardDescription>
                    Easy-to-use booking interface for employees to schedule their transportation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>View available time slots</li>
                    <li>Book based on shift timings</li>
                    <li>Receive booking confirmations</li>
                    <li>Manage recurring bookings</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Real-time Tracking</CardTitle>
                  <CardDescription>Track vehicles and monitor transportation status in real-time.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Live vehicle location</li>
                    <li>ETA notifications</li>
                    <li>Route optimization</li>
                    <li>Delay alerts</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MapPin className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Route Management</CardTitle>
                  <CardDescription>Optimize routes for efficiency and reduced travel time.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Create optimal routes</li>
                    <li>Adjust for traffic conditions</li>
                    <li>Group employees by location</li>
                    <li>Minimize travel time</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Bus className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Vehicle Management</CardTitle>
                  <CardDescription>Comprehensive tools for managing your transport fleet.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Track vehicle maintenance</li>
                    <li>Monitor fuel consumption</li>
                    <li>Schedule vehicle servicing</li>
                    <li>Manage vehicle documents</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <ArrowRight className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Reporting & Analytics</CardTitle>
                  <CardDescription>Gain insights with comprehensive reporting tools.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Usage statistics</li>
                    <li>Cost analysis</li>
                    <li>Efficiency metrics</li>
                    <li>Custom report generation</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <Bus className="h-5 w-5" />
            <span>ETMS</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Employee Transport Management System. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

