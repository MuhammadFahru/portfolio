const contentData = {
    home: {
        type: "text",
        html: `
            <p>> Loading profile...</p>
            <br>
            <p><strong>I'm Fahru</strong></p>
            <p>a full-stack developer who enjoys turning ideas into reliable web and mobile products. I care about clean code, scalable systems, and interfaces that just feel right.</p>
            <p class="blink">_</p>
        `,
    },
    contact: {
        type: "interactive",
        intro: `<p>> Secure channel established.</p><p>> Select a link to connect:</p>`,
        links: [
            { icon: "ri-mail-send-line", label: "fahrumuhammad.ozi@gmail.com", url: "mailto:fahrumuhammad.ozi@gmail.com" },
            { icon: "ri-github-line", label: "github.com/MuhammadFahru", url: "https://github.com/MuhammadFahru" },
            { icon: "ri-linkedin-line", label: "linkedin.com/in/muhammadfahru/", url: "https://linkedin.com/in/muhammadfahru/" },
        ],
    },
};

let currentMenuIndex = 0;
let currentLinkIndex = 0;
let navigationMode = "menu"; 

const menuItems = document.querySelectorAll(".menu-item");
const display = document.getElementById("content-display");
const hintText = document.getElementById("hint-text");
const clock = document.getElementById("clock");

setInterval(() => {
    const now = new Date();
    clock.innerText = now.toLocaleTimeString("en-GB",{ hour: "2-digit",minute: "2-digit",second: "2-digit" });
},1000);


function renderMenu() {
    menuItems.forEach((item,index) => {
        if (index === currentMenuIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

function loadContent() {
    const target = menuItems[currentMenuIndex].getAttribute("data-target");
    const data = contentData[target];

    navigationMode = "menu";
    currentLinkIndex = 0;

    if (data.type === "text") {
        display.innerHTML = data.html;
        hintText.innerText = "Use ARROW keys to navigate";
    } else if (data.type === "interactive") {
        let html = data.intro;
        html += `<div id="contact-list">`;
        data.links.forEach((link,idx) => {
            html += `
            <div class="contact-link-item" id="link-${idx}" onclick="handleLinkClick(${idx})">
                <i class="${link.icon}"></i>
                <span>${link.label}</span>
            </div>`;
        });
        html += `</div>`;
        display.innerHTML = html;
        hintText.innerText = "Press ENTER or TAB to focus links";
    }
}

function renderLinkFocus() {
    document.querySelectorAll(".contact-link-item").forEach((el) => el.classList.remove("focused"));

    const activeLink = document.getElementById(`link-${currentLinkIndex}`);
    if (activeLink) {
        activeLink.classList.add("focused");
        activeLink.scrollIntoView({ behavior: "smooth",block: "nearest" });
    }
    hintText.innerText = "UP/DOWN to select, ENTER to open, ESC to back";
}

function triggerLink() {
    const target = menuItems[currentMenuIndex].getAttribute("data-target");
    if (target === "contact" && navigationMode === "content") {
        const url = contentData["contact"].links[currentLinkIndex].url;
        window.open(url,"_blank");
    }
}


document.addEventListener("keydown",(e) => {
    if (navigationMode === "menu") {
        if (e.key === "ArrowUp") {
            currentMenuIndex = currentMenuIndex > 0 ? currentMenuIndex - 1 : menuItems.length - 1;
            renderMenu();
            loadContent();
        } else if (e.key === "ArrowDown") {
            currentMenuIndex = currentMenuIndex < menuItems.length - 1 ? currentMenuIndex + 1 : 0;
            renderMenu();
            loadContent();
        } else if (e.key === "Enter" || e.key === "Tab") {
            const target = menuItems[currentMenuIndex].getAttribute("data-target");
            if (target === "contact") {
                e.preventDefault();
                navigationMode = "content";
                renderLinkFocus();
            }
        }
    } else if (navigationMode === "content") {
        const linkCount = contentData["contact"].links.length;

        if (e.key === "ArrowUp") {
            currentLinkIndex = currentLinkIndex > 0 ? currentLinkIndex - 1 : linkCount - 1;
            renderLinkFocus();
        } else if (e.key === "ArrowDown") {
            currentLinkIndex = currentLinkIndex < linkCount - 1 ? currentLinkIndex + 1 : 0;
            renderLinkFocus();
        } else if (e.key === "Enter") {
            triggerLink();
        } else if (e.key === "Escape" || e.key === "Backspace") {
            navigationMode = "menu";
            document.querySelectorAll(".contact-link-item").forEach((el) => el.classList.remove("focused"));
            hintText.innerText = "Use ARROW keys to navigate";
        }
    }
});

menuItems.forEach((item,index) => {
    item.addEventListener("click",() => {
        currentMenuIndex = index;
        renderMenu();
        loadContent();
    });
});

window.handleLinkClick = function (index) {
    currentLinkIndex = index;
    navigationMode = "content";
    renderLinkFocus();
    triggerLink();
};

loadContent();