<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { Menu, X } from "lucide-vue-next"; // Import icons for the mobile menu

const router = useRouter();
const isAuthenticated = ref(false);
const isMobileMenuOpen = ref(false);

onMounted(() => {
  checkAuth();
});

const checkAuth = () => {
  const token = localStorage.getItem("token");
  isAuthenticated.value = !!token;

  if (token) {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const expiration = tokenData.exp * 1000;
    const now = Date.now();

    if (now >= expiration) {
      logout();
    }
  }
};

const logout = () => {
  localStorage.removeItem("token");
  isAuthenticated.value = false;
  router.push("/login");
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <RouterLink to="/" class="text-xl font-bold text-blue-700">CamboHR</RouterLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-6">
          <RouterLink to="/employees" class="text-gray-700 hover:text-blue-600">Employees</RouterLink>
          <RouterLink v-if="!isAuthenticated" to="/login" class="text-gray-600 hover:text-blue-600">Login</RouterLink>
          <RouterLink v-if="isAuthenticated" to="/dashboard" class="text-gray-700 hover:text-blue-600">Dashboard</RouterLink>
          <button v-if="isAuthenticated" @click="logout" class="text-red-500 hover:text-red-700">Logout</button>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu" class="md:hidden text-gray-700 focus:outline-none">
          <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <X v-if="isMobileMenuOpen" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
      <div class="flex flex-col items-center space-y-4 py-4">
        <RouterLink to="/employees" class="text-gray-700 hover:text-blue-600" @click="toggleMobileMenu">Employees</RouterLink>
        <RouterLink v-if="!isAuthenticated" to="/login" class="text-gray-600 hover:text-blue-600" @click="toggleMobileMenu">Login</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/dashboard" class="text-gray-700 hover:text-blue-600" @click="toggleMobileMenu">Dashboard</RouterLink>
        <button v-if="isAuthenticated" @click="logout" class="text-red-500 hover:text-red-700">Logout</button>
      </div>
    </div>
  </nav>
</template>
