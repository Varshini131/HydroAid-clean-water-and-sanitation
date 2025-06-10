import { initAuthState, requireAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const isAuthenticated = await requireAuth();
  if (!isAuthenticated) return;

  // Initialize auth state
  await initAuthState();

  // Initialize requests page
  initRequestsPage();
});

const initRequestsPage = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const requestsTableBody = document.getElementById('requestsTableBody');
  const updateStatusButtons = document.querySelectorAll('.update-status');

  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filter = button.dataset.filter;
      filterRequests(filter);
    });
  });

  // Update status functionality
  updateStatusButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      const village = row.cells[0].textContent;
      
      // Simple status update demo
      const currentStatus = row.querySelector('.status');
      const statusOptions = ['urgent', 'in-progress', 'completed', 'pending'];
      const currentIndex = statusOptions.findIndex(status => 
        currentStatus.classList.contains(status)
      );
      
      const nextIndex = (currentIndex + 1) % statusOptions.length;
      const nextStatus = statusOptions[nextIndex];
      
      // Update status class and text
      currentStatus.className = `status ${nextStatus}`;
      currentStatus.textContent = nextStatus.charAt(0).toUpperCase() + 
        nextStatus.slice(1).replace('-', ' ');
      
      console.log(`Updated ${village} status to ${nextStatus}`);
    });
  });
};

const filterRequests = (filter) => {
  const rows = document.querySelectorAll('#requestsTableBody tr');
  
  rows.forEach(row => {
    if (filter === 'all') {
      row.style.display = '';
    } else {
      const status = row.dataset.status;
      row.style.display = status === filter ? '' : 'none';
    }
  });
};