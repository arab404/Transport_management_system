document.addEventListener("DOMContentLoaded", () => {
  // Initialize admin user if not exists
  if (!localStorage.getItem("adminUser")) {
    const adminUser = {
      email: "admin@etms.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
    }
    localStorage.setItem("adminUser", JSON.stringify(adminUser))
  }

  // Registration Form
  const registerForm = document.getElementById("registerForm")
  if (registerForm) {
    // Set min date for date inputs to today
    const today = new Date().toISOString().split("T")[0]
    const dateInputs = document.querySelectorAll('input[type="date"]')
    dateInputs.forEach((input) => {
      input.min = today
    })

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Form validation
      if (!validateRegistrationForm()) {
        return
      }

      const firstName = document.getElementById("firstName").value
      const lastName = document.getElementById("lastName").value
      const employeeId = document.getElementById("employeeId").value
      const department = document.getElementById("department").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const address = document.getElementById("address").value
      const phone = document.getElementById("phone").value
      const shift = document.getElementById("shift").value

      // Check if email already exists
      const employees = JSON.parse(localStorage.getItem("employees")) || []
      if (employees.some((emp) => emp.email === email)) {
        alert("Email already registered. Please use a different email.")
        return
      }

      // Create new employee object
      const newEmployee = {
        id: generateId(),
        firstName,
        lastName,
        employeeId,
        department,
        email,
        password,
        address,
        phone,
        shift,
        role: "employee",
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      employees.push(newEmployee)
      localStorage.setItem("employees", JSON.stringify(employees))

      // Show success modal
      const registrationSuccessModal = document.getElementById("registrationSuccessModal")
      const successModal = new bootstrap.Modal(registrationSuccessModal)
      successModal.show()

      // Reset form
      registerForm.reset()
    })
  }

  // Login Form
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const userType = document.getElementById("userType").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      if (!userType || !email || !password) {
        showLoginError("Please fill in all fields")
        return
      }

      if (userType === "admin") {
        // Admin login
        const adminUser = JSON.parse(localStorage.getItem("adminUser"))
        if (email === adminUser.email && password === adminUser.password) {
          // Set session
          sessionStorage.setItem("currentUser", JSON.stringify(adminUser))
          // Redirect to admin dashboard
          window.location.href = "admin-dashboard.html"
        } else {
          showLoginError("Invalid admin credentials")
        }
      } else if (userType === "employee") {
        // Employee login
        const employees = JSON.parse(localStorage.getItem("employees")) || []
        const employee = employees.find((emp) => emp.email === email && emp.password === password)

        if (employee) {
          // Set session
          sessionStorage.setItem("currentUser", JSON.stringify(employee))
          // Redirect to employee dashboard
          window.location.href = "employee-dashboard.html"
        } else {
          showLoginError("Invalid employee credentials")
        }
      }
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

  // Helper Functions
  function validateRegistrationForm() {
    let isValid = true

    // First Name validation
    const firstName = document.getElementById("firstName")
    if (!firstName.value.trim()) {
      firstName.classList.add("is-invalid")
      isValid = false
    } else {
      firstName.classList.remove("is-invalid")
    }

    // Last Name validation
    const lastName = document.getElementById("lastName")
    if (!lastName.value.trim()) {
      lastName.classList.add("is-invalid")
      isValid = false
    } else {
      lastName.classList.remove("is-invalid")
    }

    // Email validation
    const email = document.getElementById("email")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      email.classList.add("is-invalid")
      isValid = false
    } else {
      email.classList.remove("is-invalid")
    }

    // Password validation
    const password = document.getElementById("password")
    if (password.value.length < 6) {
      password.classList.add("is-invalid")
      isValid = false
    } else {
      password.classList.remove("is-invalid")
    }

    // Confirm Password validation
    const confirmPassword = document.getElementById("confirmPassword")
    if (confirmPassword.value !== password.value) {
      confirmPassword.classList.add("is-invalid")
      isValid = false
    } else {
      confirmPassword.classList.remove("is-invalid")
    }

    return isValid
  }

  function showLoginError(message) {
    document.getElementById("loginErrorMessage").textContent = message
    const loginErrorModalElement = document.getElementById("loginErrorModal")
    const errorModal = new bootstrap.Modal(loginErrorModalElement)
    errorModal.show()
  }

  function generateId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
})

