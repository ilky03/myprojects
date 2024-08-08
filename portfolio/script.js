const toggleThemeBtn = document.querySelector('.toggle-theme');

function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    toggleThemeBtn.setAttribute('src', themeName == 'theme-dark' ? 'img/icons/light_mode.svg' : 'img/icons/dark_mode.svg');
    document.documentElement.className = themeName;
}

function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
}

(function () {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-dark');
    } else {
        setTheme('theme-light');
    }
})();

const showMoreBtn = document.querySelector('.show-more-btn');
const hiddenCard = document.querySelector('.card-extented__hidden');

showMoreBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hiddenCard.classList.toggle('hide');
});



