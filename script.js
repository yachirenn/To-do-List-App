const toggleBtn = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
    sidebar.classList.toggle('close');
    if (toggleBtn) toggleBtn.classList.toggle('rotate');

    Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
        ul.classList.remove('show');
        if (ul.previousElementSibling) ul.previousElementSibling.classList.remove('rotate');
    });
}

function toggleSubMenu(button) {
    const submenu = button.nextElementSibling;
    if (!submenu) return;

    submenu.classList.toggle('show');
    button.classList.toggle('rotate');

    if (sidebar.classList.contains('close')) {
        sidebar.classList.remove('close');
        if (toggleBtn) toggleBtn.classList.remove('rotate');
    }
}