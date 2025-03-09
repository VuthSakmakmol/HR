<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import VueApexCharts from "vue3-apexcharts";
import { Home, Users, FileText, Settings } from "lucide-vue-next"; // Import icons

const router = useRouter();
const activeMenu = ref("Dashboard");

const employees = ref([]);
const totalEmployees = ref(0);
const averageSalary = ref(0);
const departmentCounts = ref({});
const loading = ref(true);

// Fetch Employee Data
onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/employees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

    const data = await response.json();
    console.log("✅ Employees Fetched:", data);

    employees.value = data;
    totalEmployees.value = data.length;

    const totalSalary = data.reduce((sum, emp) => sum + emp.salary, 0);
    averageSalary.value = (totalSalary / totalEmployees.value).toFixed(2);

    departmentCounts.value = data.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
  } finally {
    loading.value = false;
  }
});

// Computed properties for charts
const departmentLabels = computed(() => Object.keys(departmentCounts.value));
const departmentValues = computed(() => Object.values(departmentCounts.value));

// Handle Sidebar Navigation
const navigate = (menu) => {
  activeMenu.value = menu;
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
    <!-- Sidebar -->
    <div class="w-full md:w-1/4 bg-blue-900 text-white p-4 md:p-6">
      <div class="flex flex-col items-center">
        <div class="bg-gray-300 w-16 h-16 md:w-20 md:h-20 rounded-full"></div>
        <h2 class="mt-3 text-lg md:text-xl font-semibold">John Don</h2>
        <p class="text-xs md:text-sm text-gray-300">johnd@company.com</p>
      </div>
      <nav class="mt-6">
        <ul class="space-y-3">
          <li
            @click="navigate('Dashboard')"
            :class="{ 'bg-blue-700': activeMenu === 'Dashboard' }"
            class="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-blue-700 text-sm"
          >
            <Home class="w-4 h-4" /> <span>Dashboard</span>
          </li>
          <li
            @click="navigate('Employees')"
            :class="{ 'bg-blue-700': activeMenu === 'Employees' }"
            class="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-blue-700 text-sm"
          >
            <Users class="w-4 h-4" /> <span>Employees</span>
          </li>
          <li
            @click="navigate('Reports')"
            :class="{ 'bg-blue-700': activeMenu === 'Reports' }"
            class="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-blue-700 text-sm"
          >
            <FileText class="w-4 h-4" /> <span>Reports</span>
          </li>
          <li
            @click="navigate('Settings')"
            :class="{ 'bg-blue-700': activeMenu === 'Settings' }"
            class="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-blue-700 text-sm"
          >
            <Settings class="w-4 h-4" /> <span>Settings</span>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="w-full md:w-3/4 p-4 md:p-6">
      <h1 class="text-xl md:text-2xl font-bold text-gray-700">{{ activeMenu }}</h1>

      <div v-if="loading" class="flex justify-center items-center h-32">
        <span class="loader"></span>
      </div>

      <div v-else>
        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div class="bg-white shadow-md p-4 rounded-lg">
            <h2 class="text-sm md:text-base font-bold">Total Employees</h2>
            <p class="text-2xl md:text-3xl mt-1 font-semibold">{{ totalEmployees }}</p>
          </div>
          <div class="bg-white shadow-md p-4 rounded-lg">
            <h2 class="text-sm md:text-base font-bold">Average Salary</h2>
            <p class="text-2xl md:text-3xl mt-1 font-semibold">${{ averageSalary }}</p>
          </div>
          <div class="bg-white shadow-md p-4 rounded-lg">
            <h2 class="text-sm md:text-base font-bold">Departments</h2>
            <p class="text-2xl md:text-3xl mt-1 font-semibold">{{ departmentLabels.length }}</p>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div class="bg-white shadow-md p-4 md:p-6 rounded-lg">
            <h2 class="text-sm md:text-base font-bold">Employees per Department</h2>
            <VueApexCharts
              type="bar"
              height="280"
              :options="{
                chart: { id: 'department-bar' },
                xaxis: { categories: departmentLabels },
              }"
              :series="[{ name: 'Employees', data: departmentValues }]"
            />
          </div>

          <div class="bg-white shadow-md p-4 md:p-6 rounded-lg">
            <h2 class="text-sm md:text-base font-bold">Department Distribution</h2>
            <VueApexCharts
              type="pie"
              height="280"
              :options="{
                labels: departmentLabels,
              }"
              :series="departmentValues"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
