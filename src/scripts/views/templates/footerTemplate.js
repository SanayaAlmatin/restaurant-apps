// templates/footerTemplate.js

export function createFooter() {
    const footer = document.createElement("footer");

    const div1 = document.createElement("div");
    const section = document.createElement("section");

    const instagramLink = document.createElement("a");
    instagramLink.href = "#!";
    instagramLink.role = "button";
    instagramLink.setAttribute("data-title", "Instagram");
    instagramLink.style.backgroundColor = "#ac2bac";
    instagramLink.innerHTML = '<i class="fab fa-instagram"></i>';

    const githubLink = document.createElement("a");
    githubLink.href = "https://github.com/SanayaAlmatin";
    githubLink.target = "_blank";
    githubLink.role = "button";
    githubLink.setAttribute("data-title", "GitHub");
    githubLink.style.backgroundColor = "#333333";
    githubLink.innerHTML = '<i class="fab fa-github"></i>';

    section.appendChild(instagramLink);
    section.appendChild(githubLink);
    div1.appendChild(section);

    const div2 = document.createElement("div");
    div2.className = "text-footer";
    div2.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
    div2.innerHTML = `
        © 2024 Copyright:
        <p>Muchamad Sanaya Almatin (Id: F1837YB42)</p>
    `;

    footer.appendChild(div1);
    footer.appendChild(div2);

    return footer;
}