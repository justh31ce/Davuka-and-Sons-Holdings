
function toggleMenu() {
  document.getElementById('navMenu').classList.toggle('active');
}

const faders = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('appear');
  });
});
faders.forEach(el => observer.observe(el));

