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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin-layout"
import { Edit, Plus, Search, Trash2 } from "lucide-react"

// Sample driver data
const initialDrivers = [
  { id: 1, name: "John Smith", phone: "555-123-4567", license: "DL12345678", status: "active", experience: "5 years" },
  {
    id: 2,
    name: "Michael Johnson",
    phone: "555-234-5678",
    license: "DL23456789",
    status: "active",
    experience: "8 years",
  },
  {
    id: 3,
    name: "Robert Williams",
    phone: "555-345-6789",
    license: "DL34567890",
    status: "inactive",
    experience: "3 years",
  },
  { id: 4, name: "David Brown", phone: "555-456-7890", license: "DL45678901", status: "active", experience: "6 years" },
  { id: 5, name: "James Davis", phone: "555-567-8901", license: "DL56789012", status: "active", experience: "4 years" },
  {
    id: 6,
    name: "William Miller",
    phone: "555-678-9012",
    license: "DL67890123",
    status: "inactive",
    experience: "7 years",
  },
  {
    id: 7,
    name: "Richard Wilson",
    phone: "555-789-0123",
    license: "DL78901234",
    status: "active",
    experience: "9 years",
  },
  {
    id: 8,
    name: "Joseph Moore",
    phone: "555-890-1234",
    license: "DL89012345",
    status: "active",
    experience: "2 years",
  },
]

export default function DriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentDriver, setCurrentDriver] = useState<any>(null)
  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    license: "",
    status: "active",
    experience: "",
  })

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.license.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDriver = () => {
    const id = Math.max(...drivers.map((d) => d.id)) + 1
    setDrivers([...drivers, { id, ...newDriver }])
    setNewDriver({
      name: "",
      phone: "",
      license: "",
      status: "active",
      experience: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditDriver = () => {
    if (!currentDriver) return

    setDrivers(drivers.map((driver) => (driver.id === currentDriver.id ? currentDriver : driver)))
    setIsEditDialogOpen(false)
  }

  const handleDeleteDriver = (id: number) => {
    if (confirm("Are you sure you want to delete this driver?")) {
      setDrivers(drivers.filter((driver) => driver.id !== id))
    }
  }

  const openEditDialog = (driver: any) => {
    setCurrentDriver({ ...driver })
    setIsEditDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Drivers Management</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>Enter the details of the new driver below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input
                    id="license"
                    value={newDriver.license}
                    onChange={(e) => setNewDriver({ ...newDriver, license: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    value={newDriver.experience}
                    onChange={(e) => setNewDriver({ ...newDriver, experience: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newDriver.status}
                    onValueChange={(value) => setNewDriver({ ...newDriver, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDriver}>Add Driver</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Drivers</CardTitle>
            <CardDescription>Manage your transportation drivers here.</CardDescription>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>{driver.license}</TableCell>
                    <TableCell>{driver.experience}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          driver.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(driver)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDriver(driver.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDrivers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No drivers found. Try a different search term or add a new driver.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>Update the driver's information below.</DialogDescription>
          </DialogHeader>
          {currentDriver && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={currentDriver.name}
                  onChange={(e) => setCurrentDriver({ ...currentDriver, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={currentDriver.phone}
                  onChange={(e) => setCurrentDriver({ ...currentDriver, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-license">License Number</Label>
                <Input
                  id="edit-license"
                  value={currentDriver.license}
                  onChange={(e) => setCurrentDriver({ ...currentDriver, license: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-experience">Experience</Label>
                <Input
                  id="edit-experience"
                  value={currentDriver.experience}
                  onChange={(e) => setCurrentDriver({ ...currentDriver, experience: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentDriver.status}
                  onValueChange={(value) => setCurrentDriver({ ...currentDriver, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDriver}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

