
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDarkMode = body.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode);
});

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedDarkMode = localStorage.getItem('darkMode');

if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDarkMode)) {
    body.classList.add('dark');
}
