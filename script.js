/* =========================================================
   DAVUKA & SONS HOLDING
   MAIN JAVASCRIPT
========================================================= */


document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuToggle =
        document.querySelector(".menu-toggle");

    const mainNav =
        document.querySelector(".main-nav");


    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function () {

            const isOpen =
                mainNav.classList.toggle("open");

            menuToggle.classList.toggle(
                "open",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

            document.body.style.overflow =
                isOpen ? "hidden" : "";

        });


        /* Close menu when clicking a link */

        const navLinks =
            mainNav.querySelectorAll("a");


        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                mainNav.classList.remove("open");

                menuToggle.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                document.body.style.overflow = "";

            });

        });

    }


    /* =====================================================
       CLOSE MOBILE MENU WHEN RESIZING
    ===================================================== */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 800) {

            if (mainNav) {
                mainNav.classList.remove("open");
            }

            if (menuToggle) {
                menuToggle.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

            document.body.style.overflow = "";

        }

    });


    /* =====================================================
       HEADER SCROLL EFFECT
    ===================================================== */

    const header =
        document.querySelector(".site-header");


    window.addEventListener("scroll", function () {

        if (!header) return;


        if (window.scrollY > 40) {

            header.style.background =
                "rgba(9,21,34,.96)";

            header.style.backdropFilter =
                "blur(12px)";

        } else {

            header.style.background = "";

            header.style.backdropFilter = "";

        }

    });


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm =
        document.querySelector(".contact-form");


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function () {

                /*
                    The form currently uses mailto:
                    so it opens the user's email client.

                    For a production website you can later
                    connect this form to Formspree, Netlify
                    Forms, PHP or another backend.
                */

            }
        );

    }


});
