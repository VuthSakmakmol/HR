<script setup>
import { defineProps, defineEmits, ref } from "vue";
import Swal from "sweetalert2";

const props = defineProps(["employee"]);
const emit = defineEmits(["close", "save"]);

const editedEmployee = ref({ ...props.employee });

// Predefined Options
const positions = ["Software Engineer", "Product Manager", "HR Manager", "Accountant", "Sales Executive", "Other"];
const departments = ["IT", "HR", "Finance", "Marketing", "Sales", "Other"];

// Save Changes with Confirmation
const saveChanges = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "Save changes to this employee?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, save it!",
  }).then((result) => {
    if (result.isConfirmed) {
      emit("save", editedEmployee.value);
    }
  });
};
</script>

<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-lg font-semibold mb-2">Edit Employee</h2>

      <input v-model="editedEmployee.name" type="text" placeholder="Name" class="p-2 border rounded w-full mb-2" />
      <input v-model="editedEmployee.email" type="email" placeholder="Email" class="p-2 border rounded w-full mb-2" />

      <!-- Position Dropdown -->
      <select v-model="editedEmployee.position" class="p-2 border rounded w-full mb-2">
        <option value="" disabled selected>Select Position</option>
        <option v-for="pos in positions" :key="pos" :value="pos">{{ pos }}</option>
      </select>
      <input v-if="editedEmployee.position === 'Other'" v-model="editedEmployee.position" type="text" placeholder="Custom Position" class="p-2 border rounded w-full mb-2" />

      <!-- Department Dropdown -->
      <select v-model="editedEmployee.department" class="p-2 border rounded w-full mb-2">
        <option value="" disabled selected>Select Department</option>
        <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
      </select>
      <input v-if="editedEmployee.department === 'Other'" v-model="editedEmployee.department" type="text" placeholder="Custom Department" class="p-2 border rounded w-full mb-2" />

      <input v-model="editedEmployee.salary" type="number" placeholder="Salary" class="p-2 border rounded w-full mb-2" />

      <div class="flex justify-between">
        <button @click="saveChanges" class="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        <button @click="emit('close')" class="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  </div>
</template>
