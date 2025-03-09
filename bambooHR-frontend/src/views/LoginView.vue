<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();

const login = async () => {
  errorMessage.value = "";
  loading.value = true; // Start loading

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      errorMessage.value = data.msg || "Login failed.";
    }
  } catch (error) {
    errorMessage.value = "An error occurred. Please try again.";
  } finally {
    loading.value = false; // Stop loading
  }
};
</script>

<template>
  <div class="flex justify-center mt-20">
    <div class="bg-white p-8 rounded shadow-md w-96">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
      
      <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded mb-2" />
      <input v-model="password" type="password" placeholder="Password" class="w-full p-2 border rounded mb-4" />
      
      <button @click="login" :disabled="loading" class="w-full bg-blue-600 text-white p-2 rounded flex items-center justify-center">
        <span v-if="loading" class="loader"></span>
        <span v-else>Login</span>
      </button>

      <p v-if="errorMessage" class="mt-2 text-red-500">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style>
.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
