const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const enableDarkMode = () => {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
}

const disableDarkMode = () => {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    enableDarkMode();
} else {
    disableDarkMode();
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});
