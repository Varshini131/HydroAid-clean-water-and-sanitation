import { initAuthState, requireAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const isAuthenticated = await requireAuth();
  if (!isAuthenticated) return;

  // Initialize auth state
  await initAuthState();

  // Initialize villages page
  initVillagesPage();
});

const initVillagesPage = () => {
  const addVillageBtn = document.getElementById('addVillageBtn');
  const addVillageModal = document.getElementById('addVillageModal');
  const modalClose = document.querySelector('.modal-close');
  const modalCancel = document.querySelector('.modal-cancel');
  const addVillageForm = document.getElementById('addVillageForm');

  // Show modal
  addVillageBtn.addEventListener('click', () => {
    addVillageModal.style.display = 'flex';
  });

  // Hide modal
  const hideModal = () => {
    addVillageModal.style.display = 'none';
    addVillageForm.reset();
  };

  modalClose.addEventListener('click', hideModal);
  modalCancel.addEventListener('click', hideModal);

  // Close modal when clicking outside
  addVillageModal.addEventListener('click', (e) => {
    if (e.target === addVillageModal) {
      hideModal();
    }
  });

  // Handle form submission
  addVillageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(addVillageForm);
    const villageData = {
      name: formData.get('villageName'),
      location: formData.get('villageLocation'),
      population: formData.get('villagePopulation'),
      waterStatus: formData.get('waterStatus')
    };

    // Here you would normally save to Supabase
    console.log('Adding village:', villageData);
    
    // For demo purposes, just show success and close modal
    alert('Village added successfully!');
    hideModal();
  });
};