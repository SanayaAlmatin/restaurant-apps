import 'regenerator-runtime';
import '../styles/main.scss';

document.addEventListener("DOMContentLoaded", function () {
    // Toggle untuk hamburger button
    document.querySelector(".hamburger-button").addEventListener("click", function () {
        this.classList.toggle("active");
        document.querySelector(".nav-menu").classList.toggle("active");
    });

    // Fungsi toggle untuk deskripsi
    function toggleDescription(button) {
        const description = button.previousElementSibling;
        description.classList.toggle("expanded");
        button.textContent = description.classList.contains("expanded") ? "Read Less" : "Read More";
    }

    // Attach toggleDescription function to buttons
    document.querySelectorAll(".toggle-button").forEach(button => {
        button.addEventListener("click", function () {
            toggleDescription(button);
        });
    });
});