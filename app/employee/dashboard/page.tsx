"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeLayout } from "@/components/employee-layout"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, Clock, MapPin } from "lucide-react"

// Sample booking data
const initialBookings = [
  {
    id: 1,
    date: new Date(2023, 5, 15),
    time: "09:00 AM",
    pickupLocation: "Indiranagar",
    dropLocation: "Office HQ",
    status: "completed",
    vehicleDetails: "Toyota Innova (KA01AB1234)",
    driverDetails: "John Smith (555-123-4567)",
  },
  {
    id: 2,
    date: new Date(2023, 5, 16),
    time: "09:15 AM",
    pickupLocation: "Indiranagar",
    dropLocation: "Office HQ",
    status: "confirmed",
    vehicleDetails: "Honda City (KA01GH3456)",
    driverDetails: "Michael Johnson (555-234-5678)",
  },
  {
    id: 3,
    date: new Date(2023, 5, 17),
    time: "09:00 AM",
    pickupLocation: "Indiranagar",
    dropLocation: "Office HQ",
    status: "pending",
    vehicleDetails: "",
    driverDetails: "",
  },
]

// Sample available time slots
const availableTimeSlots = [
  { id: 1, time: "08:00 AM", available: true },
  { id: 2, time: "08:30 AM", available: true },
  { id: 3, time: "09:00 AM", available: true },
  { id: 4, time: "09:30 AM", available: false },
  { id: 5, time: "10:00 AM", available: true },
  { id: 6, time: "05:00 PM", available: true },
  { id: 7, time: "05:30 PM", available: true },
  { id: 8, time: "06:00 PM", available: false },
  { id: 9, time: "06:30 PM", available: true },
  { id: 10, time: "07:00 PM", available: true },
]

export default function EmployeeDashboard() {
  const [bookings, setBookings] = useState(initialBookings)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [bookingData, setBookingData] = useState({
    date: new Date(),
    time: "",
    pickupLocation: "Indiranagar",
    dropLocation: "Office HQ",
  })

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleBookTransport = () => {
    const newBooking = {
      id: Math.max(...bookings.map(b => b.id)) + 1,
      date: bookingData.date,
      time: bookingData.time,
      pickupLocation: bookingData.pickupLocation,
      dropLocation: bookingData.dropLocation,
      status: "pending",
      vehicleDetails: "",
      driverDetails: ""
    }
    
    setBookings([...bookings, newBooking])
    setIsBookingDialogOpen(false)
    
    // Reset booking form
    setBookingData({
      date: new Date(),
      time: "",
      pickupLocation: "Indiranagar",
      dropLocation: "Office HQ",
    })
  }

  return (
    <EmployeeLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Employee Dashboard</h2>
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button>Book Transport</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book Transportation</DialogTitle>
                <DialogDescription>
                  Schedule a pickup for your commute.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={bookingData.date}
                    onSelect={(date) => date && setBookingData({...bookingData, date})}
                    disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))}
                    className="rounded-md border"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Select Time Slot</Label>
                  <Select 
                    value={bookingData.time} 
                    onValueChange={(value) => setBookingData({...bookingData, time: value})}
                  >
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map(slot => (
                        <SelectItem 
                          key={slot.id} 
                          value={slot.time}
                          disabled={!slot.available}
                        >
                          {slot.time} {!slot.available && "(Unavailable)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pickup">Pickup Location</Label>
                  <Select 
                    value={bookingData.pickupLocation} 
                    onValueChange={(value) => setBookingData({...bookingData, pickupLocation: value})}
                  >
                    <SelectTrigger id="pickup">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indiranagar">Indiranagar</SelectItem>
                      <SelectItem value="Koramangala">Koramangala</SelectItem>
                      <SelectItem value="Whitefield">Whitefield</SelectItem>
                      <SelectItem value="HSR Layout">HSR Layout</SelectItem>
                      <SelectItem value="Marathahalli">Marathahalli</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="drop">Drop Location</Label>
                  <Select 
                    value={bookingData.dropLocation} 
                    onValueChange={(value) => setBookingData({...bookingData, dropLocation: value})}
                  >
                    <SelectTrigger id="drop">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office HQ">Office HQ</SelectItem>
                      <SelectItem value="Branch Office">Branch Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleBookTransport} disabled={!bookingData.time}>Book Now</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">Lifetime bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Rides</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookings.filter(b => b.status === "confirmed" || b.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Scheduled transportation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Location</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Indiranagar</div>
              <p className="text-xs text-muted-foreground">Most frequent pickup</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Ride</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {bookings.some(b => b.status === "confirmed") ? (
                <>
                  <div className="text-2xl font-bold">
                    {format(
                      bookings.find(b => b.status === "confirmed")?.date || new Date(), 
                      "MMM dd"
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {bookings.find(b => b.status === "confirmed")?.time}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">None</div>
                  <p className="text-xs text-muted-foreground">No upcoming rides</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookings
                .filter(booking => booking.status === "confirmed" || booking.status === "pending")
                .map(booking => (
                  <Card key={booking.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>{format(booking.date, "EEEE, MMM dd")}</CardTitle>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <CardDescription>{booking.time}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">From: {booking.pickupLocation}</p>
                          <p className="text-sm text-muted-foreground">To: {booking.dropLocation}</p>
                        </div>
                      </div>
                      {booking.vehicleDetails && (
                        <div className="mt-4 space-y-1">
                          <p className="text-sm font-medium">Vehicle: {booking.vehicleDetails}</p>
                          <p className="text-sm text-muted-foreground">Driver: {booking.driverDetails}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      {booking.status === "pending" ? (
                        <Button variant="outline" className="w-full" disabled>Awaiting Confirmation</Button>
                      ) : (
                        <Button variant="outline" className="w-full">View Details</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              {bookings.filter(booking => booking.status === "confirmed" || booking.status === "pending").length === 0\

