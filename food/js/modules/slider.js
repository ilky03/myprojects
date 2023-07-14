function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {

    const nextSlideBtn = document.querySelector(nextArrow),
          prevSlideBtn = document.querySelector(prevArrow),
          slides = document.querySelectorAll(slide),
          slider = document.querySelector(container),
          currentSlide = document.querySelector(currentCounter),
          totalSlides = document.querySelector(totalCounter),
          slidesWrapper = document.querySelector(wrapper),
          slidesArea = document.querySelector(field),
          slideWidth = window.getComputedStyle(slidesWrapper).width,
          indicators = document.createElement('ol'),
          intervalForSlider = setInterval(() => changeSlide(1), 5000);

    let slideIndex = 1,
        offset = 0;

    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.classList.add('dot');
        dot.setAttribute('data-slide-to', i+1);
        dot.addEventListener('click', (e) => {
            const posNum = e.target.getAttribute('data-slide-to');
            changeSlide(+posNum + 1);
        });
        indicators.append(dot);
    }

    const dots = document.querySelectorAll('.dot');

    currentSlide.textContent = addZero(slideIndex);
    totalSlides.textContent = addZero(slides.length);
    dots[slideIndex - 1].style.opacity = '1';
    
    slider.style.position = 'relative';
    slidesArea.style.width = 100 * slides.length + "%";
    slidesArea.style.display = 'flex';
    slidesArea.style.transition = '1s all';
    slidesWrapper.style.overflow = 'hidden';

    function addZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else return num;
    }
    
    function changeSlide(n) {
        if (n == 1 || n == -1) {
            slideIndex += n;
            if (slideIndex < 1) {
                offset = parseFloat(slideWidth) * (slides.length - 1);
                slideIndex = slides.length;
            } else if (slideIndex > slides.length) {
                offset = 0;
                slideIndex = 1;
            } else {
                offset += n * parseFloat(slideWidth);
            }
        } else { 
            slideIndex = n - 1;
            offset = (n - 2) * parseFloat(slideWidth);
        };
        
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = '1';

        clearInterval(intervalForSlider);

        currentSlide.textContent = addZero(slideIndex);

        slidesArea.style.transform = `translateX(${-offset}px)`
    }
    
    nextSlideBtn.addEventListener('click', () => {
        changeSlide(1);
    });

    prevSlideBtn.addEventListener('click', () => {
        changeSlide(-1);
    });

}

export default slider;