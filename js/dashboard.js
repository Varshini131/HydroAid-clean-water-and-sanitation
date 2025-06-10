import { initAuthState, requireAuth, supabase } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const isAuthenticated = await requireAuth();
  if (!isAuthenticated) return;

  // Initialize auth state
  await initAuthState();

  // Initialize dashboard
  initDashboard();
  loadDonations();
  initChart();
});

const initDashboard = () => {
  // Add any dashboard-specific initialization here
  console.log('Dashboard initialized');
};

const loadDonations = async () => {
  const donationsList = document.getElementById('donations-list');
  
  if (!supabase) {
    donationsList.innerHTML = `
      <div class="donation-item">
        <div class="donation-info">
          <div class="donation-level">Demo Mode</div>
          <div class="donation-date">Configure Supabase to see real donations</div>
        </div>
        <div class="donation-amount">₹0</div>
      </div>
    `;
    return;
  }

  try {
    // This would fetch real donations from Supabase
    // For now, show demo data
    const demoData = [
      { level: 'Level 1 - Basic Water Filter', amount: 100, date: '2024-01-15' },
      { level: 'Level 3 - Mini Water Tank', amount: 500, date: '2024-01-10' },
    ];

    donationsList.innerHTML = demoData.map(donation => `
      <div class="donation-item">
        <div class="donation-info">
          <div class="donation-level">${donation.level}</div>
          <div class="donation-date">${new Date(donation.date).toLocaleDateString()}</div>
        </div>
        <div class="donation-amount">₹${donation.amount}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading donations:', error);
    donationsList.innerHTML = '<div class="loading">Error loading donations</div>';
  }
};

const initChart = () => {
  const canvas = document.getElementById('aidChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Simple bar chart implementation
  const data = [120, 190, 300, 500, 200, 300];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const padding = 40;
  const chartWidth = canvasWidth - (padding * 2);
  const chartHeight = canvasHeight - (padding * 2);
  
  const maxValue = Math.max(...data);
  const barWidth = chartWidth / data.length;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // Set styles
  ctx.fillStyle = '#0ea5e9';
  ctx.font = '12px Inter';
  ctx.textAlign = 'center';
  
  // Draw bars
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = padding + (index * barWidth) + (barWidth * 0.1);
    const y = canvasHeight - padding - barHeight;
    const width = barWidth * 0.8;
    
    // Draw bar
    ctx.fillRect(x, y, width, barHeight);
    
    // Draw label
    ctx.fillStyle = '#6b7280';
    ctx.fillText(labels[index], x + (width / 2), canvasHeight - 10);
    
    // Draw value
    ctx.fillText(`₹${value}`, x + (width / 2), y - 5);
    
    ctx.fillStyle = '#0ea5e9';
  });
};