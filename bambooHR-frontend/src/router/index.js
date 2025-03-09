import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import EmployeeView from "../views/EmployeeView.vue";
import EditEmployee from "../components/EditEmployee.vue";


const routes = [
  { path: "/", component: HomeView },
  { path: "/login", component: LoginView },
  { path: "/dashboard", component: DashboardView },
  { path: "/employees", component: EmployeeView },
  { path: "/edit/:id", component: EditEmployee, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
