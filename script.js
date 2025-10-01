// Menu responsive
const nav = document.querySelector("nav ul");
const header = document.querySelector("header");

const menuBtn = document.createElement("div");
menuBtn.innerHTML = "☰";
menuBtn.style.cursor = "pointer";
menuBtn.style.fontSize = "24px";
header.appendChild(menuBtn);

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
});
// Timeline interactive
const items = document.querySelectorAll(".timeline-item");
let index = 0;

function showItem(i) {
  items.forEach((item, idx) => {
    item.classList.remove("active");
    if (idx === i) {
      item.classList.add("active");
    }
  });
}

document.getElementById("next").addEventListener("click", () => {
  index = (index + 1) % items.length;
  showItem(index);
});

document.getElementById("prev").addEventListener("click", () => {
  index = (index - 1 + items.length) % items.length;
  showItem(index);
});
