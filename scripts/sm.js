document.addEventListener('DOMContentLoaded', function () {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('content section');

    function setActiveLink() {
        const scrollPosition = window.scrollY + window.innerHeight * 0.75; // About a fourth from the bottom
        let index = sections.length;

        while (--index >= 0 && scrollPosition < sections[index].offsetTop) {}

        sidebarLinks.forEach((link) => link.classList.remove('active'));
        if (index >= 0) {
            sidebarLinks[index].classList.add('active');
        }
    }

    sidebarLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 75,
                    behavior: 'smooth',
                });
            }
        });
    });

    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('load', setActiveLink);
});
