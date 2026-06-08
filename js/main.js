const menuBtn = document.querySelector(".menu-btn");
const navbar = document.querySelector(".navbar");

menuBtn.addEventListener("click", () => {
navbar.classList.toggle("active");
});

window.addEventListener("scroll", () => {

const header = document.querySelector(".header");

if(window.scrollY > 100){
header.style.background = "#ffffff";
header.style.boxShadow = "0 5px 20px rgba(0,0,0,.08)";
}
else{
header.style.boxShadow = "0 2px 15px rgba(0,0,0,.08)";
}

});
