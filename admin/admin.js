import { loginAdmin, watchAdmin } from "../firebase/firestore-service.js";
import { toast } from "../js/utils.js";

watchAdmin((user, isAdmin) => {
  if (user && isAdmin) window.location.href = "dashboard.html";
});

document.querySelector("#admin-login-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    await loginAdmin(form.get("email"), form.get("password"));
    toast("Logged in");
  } catch (error) {
    toast(error.message || "Login failed");
  }
});

