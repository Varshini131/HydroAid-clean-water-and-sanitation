import { initAuthState, requireAuth, supabase } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const isAuthenticated = await requireAuth();
  if (!isAuthenticated) return;

  // Initialize auth state
  const user = await initAuthState();

  // Initialize mission page
  initMissionPage(user);
});

const initMissionPage = (user) => {
  const donateButtons = document.querySelectorAll('.donate-btn');
  const totalDonatedElement = document.getElementById('totalDonated');
  const levelsCompletedElement = document.getElementById('levelsCompleted');

  // Load user's mission progress
  loadMissionProgress(user);

  // Handle donation buttons
  donateButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const level = parseInt(e.target.dataset.level);
      const amount = parseInt(e.target.dataset.amount);
      
      await handleDonation(level, amount, user);
    });
  });
};

const loadMissionProgress = async (user) => {
  if (!supabase || !user) {
    // Demo mode - show sample progress
    updateMissionDisplay(0, 0);
    return;
  }

  try {
    // This would fetch real donation data from Supabase
    // For now, use localStorage for demo
    const savedProgress = localStorage.getItem(`mission_progress_${user.id}`);
    const progress = savedProgress ? JSON.parse(savedProgress) : {
      totalDonated: 0,
      completedLevels: []
    };

    updateMissionDisplay(progress.totalDonated, progress.completedLevels.length);
    updateLevelCards(progress.completedLevels);
    updateAchievements(progress);
  } catch (error) {
    console.error('Error loading mission progress:', error);
  }
};

const handleDonation = async (level, amount, user) => {
  try {
    // In a real app, this would process payment and save to Supabase
    // For demo, we'll simulate the donation
    
    const confirmation = confirm(`Donate ₹${amount} for Level ${level}?`);
    if (!confirmation) return;

    // Simulate donation processing
    await simulateDonation(level, amount, user);
    
    // Update UI
    markLevelCompleted(level);
    updateTotals(amount);
    
    alert(`Thank you for your ₹${amount} donation! Level ${level} completed.`);
  } catch (error) {
    console.error('Donation error:', error);
    alert('Donation failed. Please try again.');
  }
};

const simulateDonation = async (level, amount, user) => {
  if (!user) return;

  // Save to localStorage for demo
  const savedProgress = localStorage.getItem(`mission_progress_${user.id}`);
  const progress = savedProgress ? JSON.parse(savedProgress) : {
    totalDonated: 0,
    completedLevels: []
  };

  progress.totalDonated += amount;
  if (!progress.completedLevels.includes(level)) {
    progress.completedLevels.push(level);
  }

  localStorage.setItem(`mission_progress_${user.id}`, JSON.stringify(progress));

  // If Supabase is configured, save there too
  if (supabase) {
    try {
      const { error } = await supabase
        .from('donations')
        .insert([
          {
            user_id: user.id,
            level: level,
            amount: amount,
            created_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    }
  }
};

const markLevelCompleted = (level) => {
  const levelCard = document.querySelector(`[data-level="${level}"]`);
  if (!levelCard) return;

  const donateBtn = levelCard.querySelector('.donate-btn');
  const levelStatus = levelCard.querySelector('.level-status');
  const progressFill = levelCard.querySelector('.progress-fill');
  const progressText = levelCard.querySelector('.progress-text');

  // Hide donate button and show completion status
  donateBtn.style.display = 'none';
  levelStatus.style.display = 'flex';

  // Update progress bar to 100%
  progressFill.style.width = '100%';
  const amount = donateBtn.dataset.amount;
  progressText.textContent = `₹${amount} / ₹${amount}`;
};

const updateLevelCards = (completedLevels) => {
  completedLevels.forEach(level => {
    markLevelCompleted(level);
  });
};

const updateTotals = (amount) => {
  const totalElement = document.getElementById('totalDonated');
  const levelsElement = document.getElementById('levelsCompleted');
  
  if (totalElement) {
    const currentTotal = parseInt(totalElement.textContent) || 0;
    totalElement.textContent = currentTotal + amount;
  }
  
  if (levelsElement) {
    const currentLevels = parseInt(levelsElement.textContent.split('/')[0]) || 0;
    levelsElement.textContent = `${currentLevels + 1}/4`;
  }
};

const updateMissionDisplay = (totalDonated, completedLevels) => {
  const totalElement = document.getElementById('totalDonated');
  const levelsElement = document.getElementById('levelsCompleted');
  
  if (totalElement) {
    totalElement.textContent = totalDonated;
  }
  
  if (levelsElement) {
    levelsElement.textContent = `${completedLevels}/4`;
  }
};

const updateAchievements = (progress) => {
  const firstDonorStatus = document.getElementById('firstDonorStatus');
  const consistentHelperStatus = document.getElementById('consistentHelperStatus');
  const waterHeroStatus = document.getElementById('waterHeroStatus');

  if (progress.totalDonated > 0 && firstDonorStatus) {
    firstDonorStatus.textContent = 'Unlocked!';
    firstDonorStatus.style.color = 'var(--success-500)';
  }

  if (progress.completedLevels.length >= 3 && consistentHelperStatus) {
    consistentHelperStatus.textContent = 'Unlocked!';
    consistentHelperStatus.style.color = 'var(--success-500)';
  }

  if (progress.completedLevels.length === 4 && waterHeroStatus) {
    waterHeroStatus.textContent = 'Unlocked!';
    waterHeroStatus.style.color = 'var(--success-500)';
  }
};