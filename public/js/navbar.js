const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileSidebar = document.getElementById("mobile-sidebar");
const mobileClose = document.getElementById("mobile-close");
const mobileOverlay = document.getElementById("mobile-overlay");


function openMobileMenu() {

    mobileSidebar.classList.add("active");
    mobileOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeMobileMenu() {

    mobileSidebar.classList.remove("active");
    mobileOverlay.classList.remove("active");

    document.body.style.overflow = "";
}


if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener("click", openMobileMenu);

}


if (mobileClose) {

    mobileClose.addEventListener("click", closeMobileMenu);

}


if (mobileOverlay) {

    mobileOverlay.addEventListener("click", closeMobileMenu);

}