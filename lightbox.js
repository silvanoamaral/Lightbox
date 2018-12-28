var slide = 'slideshow__slide';
var slideIndex = 1;

function detectmob() {
    if(window.innerWidth <= 800 && window.innerHeight <= 600) {
      return true;
    } else {
      return false;
    }
}

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

//mostra o slide
function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName(slide);
    var dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
        slideIndex = 1;
    }
 
    if (n < 1) {
        slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        //slides[i].style.display = "none"; 
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex-1].classList += ' active';
    dots[slideIndex-1].className += ' active';
}

//cria os bullets
function setSlideshowBullets(qntSlides) {
    for(var i = 1; i <= qntSlides.length; i++) {
        var bullets = document.createElement('span');
        bullets.className = 'dot';
        bullets.setAttribute('onclick','currentSlide('+ i +')');
        document.getElementsByClassName('slideshow__bullets')[0].append(bullets);
    }
}

function init() {
    var qntSlides = document.querySelectorAll('.slideshow .slideshow__slide');

    if(qntSlides.length > 1) {
        setSlideshowBullets(qntSlides);
        showSlides(slideIndex);       

        document.getElementsByClassName('slideshow__button')[0].style.display = 'block';
        document.getElementsByClassName('slideshow__bullets')[0].classList += ' active';
    }
}

window.setTimeout(function() {
    init();
},2000);
