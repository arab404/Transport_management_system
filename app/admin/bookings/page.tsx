"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin-layout"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Sample booking data
const initialBookings = [
  {
    id: 1,
    employeeName: "Alice Johnson",
    employeeId: "EMP1001",
    pickupLocation: "Indiranagar",
    dropLocation: "Office HQ",
    date: new Date(2023, 5, 15),
    time: "09:00 AM",
    status: "completed",
    vehicleAssigned: "Toyota Innova (KA01AB1234)",
    driverAssigned: "John Smith",
  },
  {
    id: 2,
    employeeName: "Bob Smith",
    employeeId: "EMP1002",
    pickupLocation: "Koramangala",
    dropLocation: "Office HQ",
    date: new Date(2023, 5, 15),
    time: "09:30 AM",
    status: "completed",
    vehicleAssigned: "Honda City (KA01GH3456)",
    driverAssigned: "Michael Johnson",
  },
  {
    id: 3,
    employeeName: "Charlie Brown",
    employeeId: "EMP1003",
    pickupLocation: "Whitefield",
    dropLocation: "Office HQ",
    date: new Date(2023, 5, 16),
    time: "09:15 AM",
    status: "pending",
    vehicleAssigned: "",
    driverAssigned: "",
  },
  {
    id: 4,
    employeeName: "Diana Miller",
    employeeId: "EMP1004",
    pickupLocation: "HSR Layout",
    dropLocation: "Office HQ",
    date: new Date(2023, 5, 16),
    time: "09:45 AM",
    status: "confirmed",
    vehicleAssigned: "Toyota Fortuner (KA01IJ7890)",
    driverAssigned: "David Brown",
  },
  {
    id: 5,
    employeeName: "Edward Wilson",
    employeeId: "EMP1005",
    pickupLocation: "Marathahalli",
    dropLocation: "Office HQ",
    date: new Date(2023, 5, 17),
    time: "09:00 AM",
    status: "confirmed",
    vehicleAssigned: "Maruti Suzuki Dzire (KA01CD5678)",
    driverAssigned: "James Davis",
  },
  {
    id: 6,
    employeeName: "Fiona Garcia",
    employeeId: "EMP1006",
    pickupLocation: "JP Nagar",
    dropLocation: "Office HQ",
    date: new Date(2023, 5, 17),
    time: "10:00 AM",
    status: "pending",
    vehicleAssigned: "",
    driverAssigned: "",
  },
  {
    id: 7,
    employeeName: "George Martinez",
    employeeId: "EMP1007",
    pickupLocation: "Jayanagar",
    dropLocation: "Office HQ",
    date: new Date(2023, 5, 18),
    time: "09:30 AM",
    status: "pending",
    vehicleAssigned: "",
    driverAssigned: "",
  },
  {
    id: 8,
    employeeName: "Hannah Lee",
    employeeId: "EMP1008",
    pickupLocation: "Electronic City",
    dropLocation: "Office HQ",
    date: new Date(2023, 5, 18),
    time: "08:45 AM",
    status: "cancelled",
    vehicleAssigned: "",
    driverAssigned: "",
  },
]

// Sample vehicles and drivers for assignment
const availableVehicles = [
  { id: 1, name: "Toyota Innova (KA01AB1234)" },
  { id: 2, name: "Maruti Suzuki Dzire (KA01CD5678)" },
  { id: 3, name: "Honda City (KA01GH3456)" },
  { id: 4, name: "Toyota Fortuner (KA01IJ7890)" },
  { id: 5, name: "Mahindra Scorpio (KA01MN5678)" },
]

const availableDrivers = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Michael Johnson" },
  { id: 3, name: "Robert Williams" },
  { id: 4, name: "David Brown" },
  { id: 5, name: "James Davis" },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState(initialBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [currentBooking, setCurrentBooking] = useState<any>(null)
  const [assignmentData, setAssignmentData] = useState({
    vehicleAssigned: "",
    driverAssigned: "",
  })

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = selectedDate ? booking.date.toDateString() === selectedDate.toDateString() : true

    return matchesSearch && matchesDate
  })

  const handleAssignVehicleDriver = () => {
    if (!currentBooking) return

    setBookings(
      bookings.map((booking) =>
        booking.id === currentBooking.id
          ? {
              ...booking,
              vehicleAssigned: assignmentData.vehicleAssigned,
              driverAssigned: assignmentData.driverAssigned,
              status: "confirmed",
            }
          : booking,
      ),
    )
    setIsAssignDialogOpen(false)
  }

  const openAssignDialog = (booking: any) => {
    setCurrentBooking({ ...booking })
    setAssignmentData({
      vehicleAssigned: booking.vehicleAssigned || "",
      driverAssigned: booking.driverAssigned || "",
    })
    setIsAssignDialogOpen(true)
  }

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

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Bookings Management</h2>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>
            {selectedDate && (
              <Button variant="ghost" size="icon" onClick={() => setSelectedDate(undefined)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Clear date</span>
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transportation Bookings</CardTitle>
            <CardDescription>View and manage employee transportation bookings.</CardDescription>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Pickup Location</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Vehicle & Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.employeeName}</div>
                      <div className="text-sm text-muted-foreground">{booking.employeeId}</div>
                    </TableCell>
                    <TableCell>
                      <div>{booking.pickupLocation}</div>
                      <div className="text-sm text-muted-foreground">to {booking.dropLocation}</div>
                    </TableCell>
                    <TableCell>
                      <div>{format(booking.date, "MMM dd, yyyy")}</div>
                      <div className="text-sm text-muted-foreground">{booking.time}</div>
                    </TableCell>
                    <TableCell>
                      {booking.vehicleAssigned ? (
                        <>
                          <div>{booking.vehicleAssigned}</div>
                          <div className="text-sm text-muted-foreground">Driver: {booking.driverAssigned}</div>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">Not assigned</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(booking.status)}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {booking.status === "pending" && (
                        <Button variant="outline" size="sm" onClick={() => openAssignDialog(booking)}>
                          Assign
                        </Button>
                      )}
                      {booking.status === "confirmed" && (
                        <Button variant="outline" size="sm" onClick={() => openAssignDialog(booking)}>
                          Reassign
                        </Button>
                      )}
                      {(booking.status === "completed" || booking.status === "cancelled") && (
                        <Button variant="outline" size="sm" disabled>
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No bookings found. Try a different search term or date filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Vehicle & Driver</DialogTitle>
            <DialogDescription>Assign a vehicle and driver to this booking request.</DialogDescription>
          </DialogHeader>
          {currentBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Employee:</Label>
                <div className="col-span-3">
                  <p className="font-medium">{currentBooking.employeeName}</p>
                  <p className="text-sm text-muted-foreground">{currentBooking.employeeId}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Pickup:</Label>
                <div className="col-span-3">
                  <p>
                    {currentBooking.pickupLocation} to {currentBooking.dropLocation}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(currentBooking.date, "MMM dd, yyyy")} at {currentBooking.time}
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicle">Assign Vehicle</Label>
                <Select
                  value={assignmentData.vehicleAssigned}
                  onValueChange={(value) => setAssignmentData({ ...assignmentData, vehicleAssigned: value })}
                >
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.name}>
                        {vehicle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver">Assign Driver</Label>
                <Select
                  value={assignmentData.driverAssigned}
                  onValueChange={(value) => setAssignmentData({ ...assignmentData, driverAssigned: value })}
                >
                  <SelectTrigger id="driver">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.name}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignVehicleDriver}>Confirm Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

