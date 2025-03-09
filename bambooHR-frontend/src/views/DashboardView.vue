<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);
const errorMessage = ref("");
const loading = ref(true); // Start in loading state

onMounted(async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      user.value = data;
    } else {
      errorMessage.value = data.msg || "Access denied.";
      router.push("/login");
    }
  } catch (error) {
    errorMessage.value = "Error fetching user data.";
    router.push("/login");
  } finally {
    loading.value = false; // Stop loading
  }
});
</script>

<template>
  <div class="text-center mt-20">
    <h1 class="text-3xl font-bold">Dashboard</h1>

    <div v-if="loading" class="flex justify-center items-center mt-4">
      <span class="loader"></span>
    </div>

    <div v-else-if="user" class="mt-4 text-gray-600">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Role:</strong> {{ user.role }}</p>
    </div>

    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<style>
.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
