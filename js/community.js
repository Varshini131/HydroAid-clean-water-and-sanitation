import { initAuthState, requireAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const isAuthenticated = await requireAuth();
  if (!isAuthenticated) return;

  // Initialize auth state
  await initAuthState();

  // Initialize community page
  initCommunityPage();
});

const initCommunityPage = () => {
  const joinCommunityForm = document.getElementById('joinCommunityForm');

  // Handle community join form
  joinCommunityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(joinCommunityForm);
    const communityData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    // Here you would normally save to Supabase
    console.log('Community join request:', communityData);
    
    // For demo purposes, just show success
    alert('Thank you for joining our community! We\'ll be in touch soon.');
    joinCommunityForm.reset();
  });

  // Add click handlers for social links (demo purposes)
  const socialLinks = document.querySelectorAll('.social-link');
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const platform = link.classList.contains('whatsapp') ? 'WhatsApp' :
                      link.classList.contains('instagram') ? 'Instagram' :
                      link.classList.contains('telegram') ? 'Telegram' :
                      link.classList.contains('discord') ? 'Discord' : 'Social';
      
      alert(`This would open the ${platform} link in a real application.`);
    });
  });

  // Volunteer button handler
  const volunteerBtn = document.querySelector('.volunteer-section .btn');
  if (volunteerBtn) {
    volunteerBtn.addEventListener('click', () => {
      alert('Thank you for your interest in volunteering! We\'ll contact you with opportunities.');
    });
  }
};