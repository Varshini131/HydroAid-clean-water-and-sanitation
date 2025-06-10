import { signIn, requireAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is already authenticated
  const isAuthenticated = await requireAuth();
  if (isAuthenticated) {
    // User is already logged in, redirect to dashboard
    window.location.href = "/dashboard.html";
    return;
  }

  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("error-message");
  const loading = document.getElementById("loading");

  const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  };

  const hideError = () => {
    errorMessage.style.display = "none";
  };

  const showLoading = () => {
    loading.style.display = "block";
  };

  const hideLoading = () => {
    loading.style.display = "none";
  };

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    showLoading();

    const formData = new FormData(loginForm);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const { user, session } = await signIn(email, password);

      if (user && session) {
        // Successfully signed in
        window.location.href = "/dashboard.html";
      } else {
        throw new Error("Failed to sign in");
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMsg = "An error occurred during login";

      if (error.message.includes("Invalid login credentials")) {
        errorMsg = "Invalid email or password";
      } else if (error.message.includes("Email not confirmed")) {
        errorMsg = "Please check your email and confirm your account";
      } else if (error.message.includes("Supabase not configured")) {
        errorMsg =
          "Authentication service is not configured. Please contact support.";
      }

      showError(errorMsg);
    } finally {
      hideLoading();
    }
  });
});
