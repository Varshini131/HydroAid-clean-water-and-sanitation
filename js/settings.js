import { initAuthState, requireAuth, supabase } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const isAuthenticated = await requireAuth();
  if (!isAuthenticated) return;

  // Initialize auth state
  const user = await initAuthState();

  // Initialize settings page
  initSettingsPage(user);
});

const initSettingsPage = (user) => {
  const profileForm = document.getElementById('profileForm');
  const passwordForm = document.getElementById('passwordForm');
  const currentEmailInput = document.getElementById('currentEmail');
  const totalDonatedElement = document.getElementById('totalDonatedAmount');
  const completedLevelsElement = document.getElementById('completedLevels');
  const donationHistoryBody = document.getElementById('donationHistoryBody');

  // Set current email
  if (user && currentEmailInput) {
    currentEmailInput.value = user.email;
  }

  // Load user data
  loadUserProfile(user);
  loadDonationHistory(user);

  // Handle profile form
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(profileForm);
    const profileData = {
      displayName: formData.get('displayName'),
      phone: formData.get('phone'),
      location: formData.get('location')
    };

    // Here you would normally save to Supabase
    console.log('Profile update:', profileData);
    alert('Profile updated successfully!');
  });

  // Handle password form
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(passwordForm);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmNewPassword = formData.get('confirmNewPassword');

    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      // In a real app, you would update the password via Supabase
      console.log('Password change request');
      alert('Password updated successfully!');
      passwordForm.reset();
    } catch (error) {
      console.error('Password update error:', error);
      alert('Failed to update password. Please try again.');
    }
  });

  // Handle notification toggles
  const notificationToggles = document.querySelectorAll('.notification-setting input[type="checkbox"]');
  notificationToggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const setting = e.target.id;
      const enabled = e.target.checked;
      console.log(`${setting}: ${enabled}`);
      // Here you would save notification preferences
    });
  });

  // Handle save preferences button
  const savePreferencesBtn = document.querySelector('.notification-setting + .btn');
  if (savePreferencesBtn) {
    savePreferencesBtn.addEventListener('click', () => {
      alert('Notification preferences saved!');
    });
  }

  // Handle danger zone actions
  const downloadDataBtn = document.querySelector('.danger-item .btn-outline');
  const deleteAccountBtn = document.querySelector('.danger-item .btn-danger');

  if (downloadDataBtn) {
    downloadDataBtn.addEventListener('click', () => {
      alert('Data download would be initiated in a real application.');
    });
  }

  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', () => {
      const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (confirmation) {
        alert('Account deletion would be processed in a real application.');
      }
    });
  }
};

const loadUserProfile = (user) => {
  if (!user) return;

  // Load saved profile data from localStorage for demo
  const savedProfile = localStorage.getItem(`profile_${user.id}`);
  if (savedProfile) {
    const profile = JSON.parse(savedProfile);
    
    const displayNameInput = document.getElementById('displayName');
    const phoneInput = document.getElementById('phone');
    const locationInput = document.getElementById('location');

    if (displayNameInput) displayNameInput.value = profile.displayName || '';
    if (phoneInput) phoneInput.value = profile.phone || '';
    if (locationInput) locationInput.value = profile.location || '';
  }
};

const loadDonationHistory = (user) => {
  if (!user) return;

  const totalDonatedElement = document.getElementById('totalDonatedAmount');
  const completedLevelsElement = document.getElementById('completedLevels');
  const donationHistoryBody = document.getElementById('donationHistoryBody');

  // Load mission progress from localStorage for demo
  const savedProgress = localStorage.getItem(`mission_progress_${user.id}`);
  const progress = savedProgress ? JSON.parse(savedProgress) : {
    totalDonated: 0,
    completedLevels: []
  };

  // Update summary
  if (totalDonatedElement) {
    totalDonatedElement.textContent = `₹${progress.totalDonated}`;
  }
  
  if (completedLevelsElement) {
    completedLevelsElement.textContent = `${progress.completedLevels.length}/4`;
  }

  // Update donation history table
  if (donationHistoryBody && progress.completedLevels.length > 0) {
    const levelNames = {
      1: 'Level 1 - Basic Water Filter',
      2: 'Level 2 - Hand Pump Setup',
      3: 'Level 3 - Mini Water Tank',
      4: 'Level 4 - Rainwater Harvest System'
    };

    const levelAmounts = {
      1: 100,
      2: 250,
      3: 500,
      4: 1000
    };

    donationHistoryBody.innerHTML = progress.completedLevels.map(level => `
      <tr>
        <td>${new Date().toLocaleDateString()}</td>
        <td>${levelNames[level]}</td>
        <td>₹${levelAmounts[level]}</td>
        <td><span class="status completed">Completed</span></td>
      </tr>
    `).join('');
  }
};