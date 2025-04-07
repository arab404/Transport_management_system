document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar
  const sidebarToggle = document.body.querySelector("#sidebarToggle")
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault()
      document.body.classList.toggle("sb-sidenav-toggled")
      localStorage.setItem("sb|sidebar-toggle", document.body.classList.contains("sb-sidenav-toggled"))
    })
  }

  // Drivers management
  if (document.getElementById("driversTable")) {
    let drivers = JSON.parse(localStorage.getItem("drivers")) || []
    const itemsPerPage = 10
    let currentPage = 1

    // Initialize drivers if empty
    if (drivers.length === 0) {
      drivers = [
        { id: 1, name: "John Doe", licenseNumber: "DL12345", contactNumber: "+1234567890", status: "Active" },
        { id: 2, name: "Jane Smith", licenseNumber: "DL67890", contactNumber: "+9876543210", status: "On Leave" },
      ]
      localStorage.setItem("drivers", JSON.stringify(drivers))
    }

    const driversTable = document.getElementById("driversTable")
    const driversPagination = document.getElementById("driversPagination")
    const searchInput = document.getElementById("searchInput")
    const statusFilter = document.getElementById("statusFilter")
    const applyFiltersBtn = document.getElementById("applyFilters")

    function displayDrivers(page, filteredDrivers = drivers) {
      const start = (page - 1) * itemsPerPage
      const end = start + itemsPerPage
      const paginatedDrivers = filteredDrivers.slice(start, end)

      const tbody = driversTable.querySelector("tbody")
      tbody.innerHTML = ""

      paginatedDrivers.forEach((driver) => {
        const row = tbody.insertRow()
        row.innerHTML = `
                    <td>${driver.id}</td>
                    <td>${driver.name}</td>
                    <td>${driver.licenseNumber}</td>
                    <td>${driver.contactNumber}</td>
                    <td><span class="badge bg-${driver.status === "Active" ? "success" : driver.status === "Inactive" ? "danger" : "warning"}">${driver.status}</span></td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-driver" data-id="${driver.id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-driver" data-id="${driver.id}">Delete</button>
                    </td>
                `
      })

      updatePagination(page, filteredDrivers.length)
    }

    function updatePagination(currentPage, totalItems) {
      const totalPages = Math.ceil(totalItems / itemsPerPage)
      let paginationHTML = ""

      for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<li class="page-item ${i === currentPage ? "active" : ""}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
      }

      driversPagination.innerHTML = paginationHTML

      driversPagination.querySelectorAll(".page-link").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault()
          currentPage = Number.parseInt(e.target.dataset.page)
          displayDrivers(currentPage)
        })
      })
    }

    function addDriver(driver) {
      driver.id = drivers.length > 0 ? Math.max(...drivers.map((d) => d.id)) + 1 : 1
      drivers.push(driver)
      localStorage.setItem("drivers", JSON.stringify(drivers))
      displayDrivers(currentPage)
    }

    function updateDriver(updatedDriver) {
      const index = drivers.findIndex((d) => d.id === updatedDriver.id)
      if (index !== -1) {
        drivers[index] = updatedDriver
        localStorage.setItem("drivers", JSON.stringify(drivers))
        displayDrivers(currentPage)
      }
    }

    function deleteDriver(id) {
      drivers = drivers.filter((d) => d.id !== id)
      localStorage.setItem("drivers", JSON.stringify(drivers))
      displayDrivers(currentPage)
    }

    // Event listeners
    document.getElementById("saveDriverBtn").addEventListener("click", () => {
      const name = document.getElementById("driverName").value
      const licenseNumber = document.getElementById("licenseNumber").value
      const contactNumber = document.getElementById("contactNumber").value
      const status = document.getElementById("driverStatus").value

      if (name && licenseNumber && contactNumber && status) {
        addDriver({ name, licenseNumber, contactNumber, status })
        document.getElementById("addDriverForm").reset()
        bootstrap.Modal.getInstance(document.getElementById("addDriverModal")).hide()
      } else {
        alert("Please fill in all fields")
      }
    })

    driversTable.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-driver")) {
        const id = Number.parseInt(e.target.dataset.id)
        const driver = drivers.find((d) => d.id === id)
        if (driver) {
          document.getElementById("editDriverId").value = driver.id
          document.getElementById("editDriverName").value = driver.name
          document.getElementById("editLicenseNumber").value = driver.licenseNumber
          document.getElementById("editContactNumber").value = driver.contactNumber
          document.getElementById("editDriverStatus").value = driver.status
          new bootstrap.Modal(document.getElementById("editDriverModal")).show()
        }
      } else if (e.target.classList.contains("delete-driver")) {
        const id = Number.parseInt(e.target.dataset.id)
        document.getElementById("confirmDeleteBtn").dataset.id = id
        new bootstrap.Modal(document.getElementById("deleteConfirmModal")).show()
      }
    })

    document.getElementById("updateDriverBtn").addEventListener("click", () => {
      const id = Number.parseInt(document.getElementById("editDriverId").value)
      const name = document.getElementById("editDriverName").value
      const licenseNumber = document.getElementById("editLicenseNumber").value
      const contactNumber = document.getElementById("editContactNumber").value
      const status = document.getElementById("editDriverStatus").value

      if (name && licenseNumber && contactNumber && status) {
        updateDriver({ id, name, licenseNumber, contactNumber, status })
        bootstrap.Modal.getInstance(document.getElementById("editDriverModal")).hide()
      } else {
        alert("Please fill in all fields")
      }
    })

    document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
      const id = Number.parseInt(document.getElementById("confirmDeleteBtn").dataset.id)
      deleteDriver(id)
      bootstrap.Modal.getInstance(document.getElementById("deleteConfirmModal")).hide()
    })

    applyFiltersBtn.addEventListener("click", () => {
      const searchTerm = searchInput.value.toLowerCase()
      const statusValue = statusFilter.value

      const filteredDrivers = drivers.filter((driver) => {
        const matchesSearch =
          driver.name.toLowerCase().includes(searchTerm) ||
          driver.licenseNumber.toLowerCase().includes(searchTerm) ||
          driver.contactNumber.toLowerCase().includes(searchTerm)
        const matchesStatus = statusValue === "" || driver.status === statusValue
        return matchesSearch && matchesStatus
      })

      currentPage = 1
      displayDrivers(currentPage, filteredDrivers)
    })

    // Initial display
    displayDrivers(currentPage)
  }
})

