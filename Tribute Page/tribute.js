document.addEventListener('DOMContentLoaded', function() {
    const fadeIns = document.querySelectorAll('.fade-in');
    const slideIns = document.querySelectorAll('.slide-in');

    const appearOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeIns.forEach(fadeIn => {
        appearOnScroll.observe(fadeIn);
    });

    slideIns.forEach(slideIn => {
        appearOnScroll.observe(slideIn);
    });
});
