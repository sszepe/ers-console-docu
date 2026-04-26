// Close mobile nav when clicking a sidebar link
document.querySelectorAll('.sidebar-link').forEach(function(link) {
  link.addEventListener('click', function() {
    document.body.classList.remove('nav-open');
  });
});
