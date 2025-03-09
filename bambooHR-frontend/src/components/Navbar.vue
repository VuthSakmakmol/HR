<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();
const isAuthenticated = ref(false);

onMounted(() => {
  checkAuth();
});

const checkAuth = () => {
  const token = localStorage.getItem("token");
  isAuthenticated.value = !!token;

  if (token) {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const expiration = tokenData.exp * 1000; // Convert to milliseconds
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
</script>

<template>
  <nav class="p-4 bg-white shadow-md flex justify-between items-center">
    <RouterLink to="/" class="text-lg font-semibold">BambooHR</RouterLink>
    <router-link to="/employees" class="hover:underline">Employees</router-link>
    <div>
      <RouterLink v-if="!isAuthenticated" to="/login" class="text-gray-600 hover:text-blue-600">Login</RouterLink>
      <RouterLink v-if="isAuthenticated" to="/dashboard" class="mr-4 text-gray-600 hover:text-blue-600">Dashboard</RouterLink>
      <button v-if="isAuthenticated" @click="logout" class="text-red-500 hover:text-red-700">Logout</button>
    </div>
  </nav>
</template>
