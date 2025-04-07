document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"))
  if (!currentUser || currentUser.role !== "employee") {
    window.location.href = "index.html"
    return
  }

  // Set employee name in navbar
  document.getElementById("employeeName").textContent = `${currentUser.firstName} ${currentUser.lastName}`

  // Set employee shift in dashboard
  if (document.getElementById("employeeShift")) {
    const shiftDisplay = currentUser.shift.split(" ")[0] // Just show "Morning", "Afternoon", etc.
    document.getElementById("employeeShift").textContent = shiftDisplay
  }

  // Initialize time slots if not exists
  if (!localStorage.getItem("timeSlots")) {
    initializeTimeSlots()
  }

  // Initialize bookings if not exists
  if (!localStorage.getItem("bookings")) {
    localStorage.setItem("bookings", JSON.stringify([]))
  }

  // Set min date for date inputs to today
  const today = new Date().toISOString().split("T")[0]
  const dateInputs = document.querySelectorAll('input[type="date"]')
  dateInputs.forEach((input) => {
    input.min = today
    if (!input.value) {
      input.value = today
    }
  })

  // Load dashboard data
  loadDashboardData()

  // Load available time slots
  loadAvailableTimeSlots()

  // Load recent bookings
  loadRecentBookings()

  // Event Listeners
  const checkSlotsBtn = document.getElementById("checkSlotsBtn")
  if (checkSlotsBtn) {
    checkSlotsBtn.addEventListener("click", loadAvailableTimeSlots)
  }

  const bookingTypeSelect = document.getElementById("bookingType")
  if (bookingTypeSelect) {
    bookingTypeSelect.addEventListener("change", populateTimeSlots)
  }

  const confirmBookingBtn = document.getElementById("confirmBookingBtn")
  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener("click", bookTransport)
  }

  // Toggle sidebar
  const sidebarToggle = document.body.querySelector("#sidebarToggle")
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault()
      document.body.classList.toggle("sb-sidenav-toggled")
      localStorage.setItem("sb|sidebar-toggle", document.body.classList.contains("sb-sidenav-toggled"))
    })
  }

  // Logout Button
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      // Clear session
      sessionStorage.removeItem("currentUser")
      // Redirect to login
      window.location.href = "index.html"
    })
  }

  // Functions
  function loadDashboardData() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || []
    const employeeBookings = bookings.filter((booking) => booking.employeeId === currentUser.id)

    // Total bookings
    document.getElementById("totalBookings").textContent = employeeBookings.length

    // Pending requests
    const pendingBookings = employeeBookings.filter((booking) => booking.status === "pending")
    document.getElementById("pendingRequests").textContent = pendingBookings.length

    // Next pickup
    const upcomingBookings = employeeBookings
      .filter(
        (booking) =>
          new Date(booking.date) >= new Date() && (booking.status === "confirmed" || booking.status === "pending"),
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    if (upcomingBookings.length > 0) {
      const nextBooking = upcomingBookings[0]
      const bookingDate = new Date(nextBooking.date)
      const formattedDate = bookingDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      document.getElementById("nextPickup").textContent = formattedDate
    } else {
      document.getElementById("nextPickup").textContent = "None"
    }
  }

  function loadAvailableTimeSlots() {
    const selectedDate = document.getElementById("slotDate").value
    const slotType = document.getElementById("slotType").value

    const timeSlots = JSON.parse(localStorage.getItem("timeSlots")) || []

    // Filter slots by date and type
    let filteredSlots = timeSlots.filter((slot) => slot.date === selectedDate)

    if (slotType !== "all") {
      filteredSlots = filteredSlots.filter((slot) => slot.type === slotType)
    }

    // Display slots in table
    const tbody = document.getElementById("timeSlotsTable").querySelector("tbody")
    tbody.innerHTML = ""

    if (filteredSlots.length === 0) {
      const row = tbody.insertRow()
      const cell = row.insertCell()
      cell.colSpan = 4
      cell.textContent = "No available time slots for the selected date and type."
      cell.className = "text-center"
      return
    }

    filteredSlots.forEach((slot) => {
      const row = tbody.insertRow()

      const timeCell = row.insertCell()
      timeCell.textContent = slot.time

      const typeCell = row.insertCell()
      typeCell.textContent = slot.type === "pickup" ? "Pickup (To Office)" : "Drop-off (From Office)"

      const seatsCell = row.insertCell()
      seatsCell.textContent = `${slot.availableSeats} / ${slot.totalSeats}`

      const actionCell = row.insertCell()
      if (slot.availableSeats > 0) {
        const bookBtn = document.createElement("button")
        bookBtn.className = "btn btn-primary btn-sm"
        bookBtn.textContent = "Book"
        bookBtn.dataset.slotId = slot.id
        bookBtn.addEventListener("click", () => openBookingModal(slot))
        actionCell.appendChild(bookBtn)
      } else {
        actionCell.textContent = "Full"
      }
    })
  }

  function loadRecentBookings() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || []
    const employeeBookings = bookings
      .filter((booking) => booking.employeeId === currentUser.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5) // Get only the 5 most recent bookings

    const tbody = document.getElementById("recentBookingsTable").querySelector("tbody")
    tbody.innerHTML = ""

    if (employeeBookings.length === 0) {
      const row = tbody.insertRow()
      const cell = row.insertCell()
      cell.colSpan = 6
      cell.textContent = "No bookings found. Book your first transport!"
      cell.className = "text-center"
      return
    }

    employeeBookings.forEach((booking) => {
      const row = tbody.insertRow()

      const idCell = row.insertCell()
      idCell.textContent = booking.id

      const dateCell = row.insertCell()
      const bookingDate = new Date(booking.date)
      dateCell.textContent = bookingDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })

      const timeCell = row.insertCell()
      timeCell.textContent = booking.time

      const typeCell = row.insertCell()
      typeCell.textContent = booking.type === "pickup" ? "Pickup" : "Drop-off"

      const statusCell = row.insertCell()
      let statusBadgeClass = ""
      switch (booking.status) {
        case "pending":
          statusBadgeClass = "bg-warning"
          break
        case "confirmed":
          statusBadgeClass = "bg-success"
          break
        case "cancelled":
          statusBadgeClass = "bg-danger"
          break
        case "completed":
          statusBadgeClass = "bg-info"
          break
      }
      statusCell.innerHTML = `<span class="badge ${statusBadgeClass}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>`

      const actionCell = row.insertCell()
      if (booking.status === "pending" || booking.status === "confirmed") {
        const cancelBtn = document.createElement("button")
        cancelBtn.className = "btn btn-danger btn-sm"
        cancelBtn.textContent = "Cancel"
        cancelBtn.dataset.bookingId = booking.id
        cancelBtn.addEventListener("click", () => cancelBooking(booking.id))
        actionCell.appendChild(cancelBtn)
      } else {
        const viewBtn = document.createElement("button")
        viewBtn.className = "btn btn-secondary btn-sm"
        viewBtn.textContent = "View"
        viewBtn.dataset.bookingId = booking.id
        actionCell.appendChild(viewBtn)
      }
    })
  }

  function openBookingModal(slot) {
    // Set booking form values
    document.getElementById("bookingDate").value = slot.date
    document.getElementById("bookingType").value = slot.type

    // Populate time slots
    const timeSelect = document.getElementById("bookingTime")
    timeSelect.innerHTML = `<option value="${slot.time}">${slot.time}</option>`
    timeSelect.value = slot.time

    // Set default locations based on booking type
    if (slot.type === "pickup") {
      document.getElementById("pickupLocation").value = currentUser.address
      document.getElementById("dropoffLocation").value = "Office Headquarters"
    } else {
      document.getElementById("pickupLocation").value = "Office Headquarters"
      document.getElementById("dropoffLocation").value = currentUser.address
    }

    // Show modal
    const bookingModalElement = document.getElementById("bookTransportModal")
    const bookingModal = new bootstrap.Modal(bookingModalElement)
    bookingModal.show()
  }

  function populateTimeSlots() {
    const bookingDate = document.getElementById("bookingDate").value
    const bookingType = document.getElementById("bookingType").value

    if (!bookingDate || !bookingType) return

    const timeSlots = JSON.parse(localStorage.getItem("timeSlots")) || []
    const availableSlots = timeSlots.filter(
      (slot) => slot.date === bookingDate && slot.type === bookingType && slot.availableSeats > 0,
    )

    const timeSelect = document.getElementById("bookingTime")
    timeSelect.innerHTML = '<option value="">Select Time Slot</option>'

    availableSlots.forEach((slot) => {
      const option = document.createElement("option")
      option.value = slot.time
      option.textContent = slot.time
      timeSelect.appendChild(option)
    })
  }

  function bookTransport() {
    const bookingDate = document.getElementById("bookingDate").value
    const bookingType = document.getElementById("bookingType").value
    const bookingTime = document.getElementById("bookingTime").value
    const pickupLocation = document.getElementById("pickupLocation").value
    const dropoffLocation = document.getElementById("dropoffLocation").value
    const additionalNotes = document.getElementById("additionalNotes").value

    if (!bookingDate || !bookingType || !bookingTime || !pickupLocation || !dropoffLocation) {
      alert("Please fill in all required fields")
      return
    }

    // Find the time slot
    const timeSlots = JSON.parse(localStorage.getItem("timeSlots")) || []
    const slotIndex = timeSlots.findIndex(
      (slot) => slot.date === bookingDate && slot.type === bookingType && slot.time === bookingTime,
    )

    if (slotIndex === -1 || timeSlots[slotIndex].availableSeats <= 0) {
      alert("This time slot is no longer available. Please select another one.")
      return
    }

    // Update available seats
    timeSlots[slotIndex].availableSeats--
    localStorage.setItem("timeSlots", JSON.stringify(timeSlots))

    // Create booking
    const bookings = JSON.parse(localStorage.getItem("bookings")) || []
    const newBooking = {
      id: generateBookingId(),
      employeeId: currentUser.id,
      employeeName: `${currentUser.firstName} ${currentUser.lastName}`,
      date: bookingDate,
      time: bookingTime,
      type: bookingType,
      pickupLocation,
      dropoffLocation,
      additionalNotes,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    bookings.push(newBooking)
    localStorage.setItem("bookings", JSON.stringify(bookings))

    // Close booking modal
    const bookTransportModalElement = document.getElementById("bookTransportModal")
    const bookTransportModal = bootstrap.Modal.getInstance(bookTransportModalElement)
    if (bookTransportModal) {
      bookTransportModal.hide()
    }

    // Show success modal
    document.getElementById("successBookingId").textContent = newBooking.id
    document.getElementById("successBookingDate").textContent = new Date(bookingDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    document.getElementById("successBookingTime").textContent = bookingTime

    const successModalElement = document.getElementById("bookingSuccessModal")
    const successModal = new bootstrap.Modal(successModalElement)
    successModal.show()

    // Reset form
    document.getElementById("bookTransportForm").reset()

    // Reload dashboard data
    loadDashboardData()
    loadAvailableTimeSlots()
    loadRecentBookings()
  }

  function cancelBooking(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    const bookings = JSON.parse(localStorage.getItem("bookings")) || []
    const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId)

    if (bookingIndex === -1) {
      alert("Booking not found")
      return
    }

    const booking = bookings[bookingIndex]

    // Update booking status
    booking.status = "cancelled"
    bookings[bookingIndex] = booking
    localStorage.setItem("bookings", JSON.stringify(bookings))

    // Return seat to time slot
    const timeSlots = JSON.parse(localStorage.getItem("timeSlots")) || []
    const slotIndex = timeSlots.findIndex(
      (slot) => slot.date === booking.date && slot.type === booking.type && slot.time === booking.time,
    )

    if (slotIndex !== -1) {
      timeSlots[slotIndex].availableSeats++
      localStorage.setItem("timeSlots", JSON.stringify(timeSlots))
    }

    // Reload data
    loadDashboardData()
    loadAvailableTimeSlots()
    loadRecentBookings()

    alert("Booking cancelled successfully")
  }

  function initializeTimeSlots() {
    const timeSlots = []
    const today = new Date()

    // Generate time slots for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split("T")[0]

      // Morning pickup slots (to office)
      ;["07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM", "09:00 AM"].forEach((time) => {
        timeSlots.push({
          id: `pickup-${dateString}-${time}`,
          date: dateString,
          time,
          type: "pickup",
          totalSeats: 15,
          availableSeats: 15,
        })
      })

      // Evening dropoff slots (from office)
      ;["05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"].forEach((time) => {
        timeSlots.push({
          id: `dropoff-${dateString}-${time}`,
          date: dateString,
          time,
          type: "dropoff",
          totalSeats: 15,
          availableSeats: 15,
        })
      })
    }

    localStorage.setItem("timeSlots", JSON.stringify(timeSlots))
  }

  function generateBookingId() {
    return "B" + Math.random().toString(36).substr(2, 8).toUpperCase()
  }
})

