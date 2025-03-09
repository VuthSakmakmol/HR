<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import EditEmployee from "../components/EditEmployee.vue";
import Swal from "sweetalert2";

const router = useRouter();
const employees = ref([]);
const errorMessage = ref("");
const token = localStorage.getItem("token");

// Filters
const searchQuery = ref("");
const filterPosition = ref("");
const filterDepartment = ref("");
const filterSalary = ref("");

// Predefined Options
const positions = ["Software Engineer", "Product Manager", "HR Manager", "Accountant", "Sales Executive", "Other"];
const departments = ["IT", "HR", "Finance", "Marketing", "Sales", "Other"];
const salaries = ["200", "500", "800", "1200", "2000", "Other"];

// New Employee
const newEmployee = ref({ name: "", email: "", position: "", department: "", salary: "" });

// Edit Modal
const showEditModal = ref(false);
const selectedEmployee = ref(null);

// Computed Filtered Employees
const filteredEmployees = computed(() => {
  return employees.value.filter(employee =>
    (employee.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee._id.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
    (!filterPosition.value || employee.position === filterPosition.value) &&
    (!filterDepartment.value || employee.department === filterDepartment.value) &&
    (!filterSalary.value || employee.salary === filterSalary.value)
  );
});

// Fetch Employees
const fetchEmployees = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      employees.value = data;
    } else {
      errorMessage.value = "Access denied.";
      router.push("/login");
    }
  } catch (error) {
    errorMessage.value = "Error loading employees.";
  }
};

// Add Employee
const addEmployee = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newEmployee.value),
    });

    const data = await response.json();
    if (response.ok) {
      employees.value.push(data.employee);
      newEmployee.value = { name: "", email: "", position: "", department: "", salary: "" };
      Swal.fire("Success!", "New employee added.", "success");
    } else {
      Swal.fire("Error", "Failed to add employee.", "error");
    }
  } catch (error) {
    Swal.fire("Error", "Could not add employee.", "error");
  }
};

// Open Edit Modal
const openEditModal = (employee) => {
  selectedEmployee.value = { ...employee };
  showEditModal.value = true;
};

// Save Edited Employee
const saveEmployee = async (updatedEmployee) => {
  try {
    const response = await fetch(`http://localhost:5000/api/employees/${updatedEmployee._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updatedEmployee),
    });

    const data = await response.json();
    if (response.ok) {
      employees.value = employees.value.map(emp =>
        emp._id === updatedEmployee._id ? data.updatedEmployee : emp
      );
      showEditModal.value = false;
      Swal.fire("Saved!", "Employee details updated.", "success");
    } else {
      Swal.fire("Error", "Failed to update employee.", "error");
    }
  } catch (error) {
    Swal.fire("Error", "Could not update employee.", "error");
  }
};

// Delete Employee
const deleteEmployee = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to recover this employee!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          employees.value = employees.value.filter(emp => emp._id !== id);
          Swal.fire("Deleted!", "Employee has been removed.", "success");
        } else {
          Swal.fire("Error", "Failed to delete employee.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Could not delete employee.", "error");
      }
    }
  });
};

onMounted(fetchEmployees);
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-4">Employee Management</h1>
    <p v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>

    <!-- Search & Filters -->
    <div class="flex flex-wrap gap-2 mb-4">
      <input v-model="searchQuery" type="text" placeholder="Search by Name or ID" class="p-2 border rounded flex-1" />

      <!-- Position Filter -->
      <select v-model="filterPosition" class="p-2 border rounded flex-1">
        <option value="">All Positions</option>
        <option v-for="pos in positions" :key="pos" :value="pos">{{ pos }}</option>
      </select>

      <!-- Department Filter -->
      <select v-model="filterDepartment" class="p-2 border rounded flex-1">
        <option value="">All Departments</option>
        <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
      </select>

      <!-- Salary Filter -->
      <select v-model="filterSalary" class="p-2 border rounded flex-1">
        <option value="">All Salaries</option>
        <option v-for="sal in salaries" :key="sal" :value="sal">${{ sal }}</option>
      </select>
    </div>

    <!-- Add Employee -->
    <div class="flex gap-2 mb-4">
      <input v-model="newEmployee.name" type="text" placeholder="Name" class="p-2 border rounded flex-1" />
      <input v-model="newEmployee.email" type="email" placeholder="Email" class="p-2 border rounded flex-1" />

      <select v-model="newEmployee.position" class="p-2 border rounded flex-1">
        <option value="" disabled selected>Select Position</option>
        <option v-for="pos in positions" :key="pos" :value="pos">{{ pos }}</option>
      </select>

      <select v-model="newEmployee.department" class="p-2 border rounded flex-1">
        <option value="" disabled selected>Select Department</option>
        <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
      </select>

      <input v-model="newEmployee.salary" type="number" placeholder="Salary" class="p-2 border rounded flex-1" />

      <button @click="addEmployee" class="bg-green-600 text-white px-4 py-2 rounded">Add</button>
    </div>

    <!-- Employee Table -->
    <div class="overflow-x-auto mt-4">
      <table class="w-full min-w-[600px] border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2 text-left">Name</th>
            <th class="border p-2 text-left">Email</th>
            <th class="border p-2 text-left">Position</th>
            <th class="border p-2 text-left">Department</th>
            <th class="border p-2 text-left">Salary</th>
            <th class="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in filteredEmployees" :key="employee._id">
            <td class="border p-2">{{ employee.name }}</td>
            <td class="border p-2">{{ employee.email }}</td>
            <td class="border p-2">{{ employee.position }}</td>
            <td class="border p-2">{{ employee.department }}</td>
            <td class="border p-2">${{ employee.salary }}</td>
            <td class="border p-2">
              <button @click="openEditModal(employee)">✏️</button>
              <button @click="deleteEmployee(employee._id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EditEmployee v-if="showEditModal" :employee="selectedEmployee" @close="showEditModal = false" @save="saveEmployee" />
  </div>
  
</template>
