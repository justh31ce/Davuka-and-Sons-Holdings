const menuBtn = document.querySelector(".menu-btn");
const navbar = document.querySelector(".navbar");

menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
});

const reveals = document.querySelectorAll(
'.service-card,.why-card,.project-card,.timeline-item,.vm-card,.stat-card'
);

function revealOnScroll(){

reveals.forEach(item=>{

const windowHeight = window.innerHeight;
const top = item.getBoundingClientRect().top;

if(top < windowHeight - 100){
item.classList.add("show");
}

});

}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
