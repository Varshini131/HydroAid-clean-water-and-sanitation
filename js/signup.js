import { signUp, signIn } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const errorMessage = document.getElementById('error-message');
  const loading = document.getElementById('loading');

  const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  };

  const hideError = () => {
    errorMessage.style.display = 'none';
  };

  const showLoading = () => {
    loading.style.display = 'block';
  };

  const hideLoading = () => {
    loading.style.display = 'none';
  };

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const formData = new FormData(signupForm);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validate passwords match
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    showLoading();

    try {
      // Sign up the user
      const { user, error } = await signUp(email, password);
      
      if (error) {
        throw error;
      }

      // Auto-login after successful signup
      if (user) {
        try {
          await signIn(email, password);
          window.location.href = '/dashboard.html';
        } catch (loginError) {
          console.error('Auto-login error:', loginError);
          // If auto-login fails, redirect to login page
          window.location.href = '/login.html';
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      let errorMsg = 'An error occurred during registration';
      
      if (error.message.includes('User already registered')) {
        errorMsg = 'An account with this email already exists';
      } else if (error.message.includes('Password should be at least 6 characters')) {
        errorMsg = 'Password must be at least 6 characters long';
      } else if (error.message.includes('Unable to validate email address')) {
        errorMsg = 'Please enter a valid email address';
      } else if (error.message.includes('Supabase not configured')) {
        errorMsg = 'Authentication service is not configured. Please contact support.';
      }
      
      showError(errorMsg);
    } finally {
      hideLoading();
    }
  });
});