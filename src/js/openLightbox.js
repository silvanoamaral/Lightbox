var App = {
    slideClass: 'slideshow__slide',
    slideIndex: 1,
    passou: true,
    init: function() {
        try {
            App.handlers.init();          
        }catch (err) {
            console.error(err.message);
        }
    },
    events: {
        findToken: function() {
            return new Promise((resolve, reject) => {
                const urlSignup = 'https://locatestore.intellibrand.ai/auth';
                fetch(urlSignup, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    email: 'bayer@era-br.com',
                    password: '7abGFB4rcl'
                  })
                })
                .then(response => {
                  if(response.ok) {
                    return response.json();
                  } else {
                    throw new Error('Não foi possível fazer o login.');
                  }
                })
                .then(result => {
                  resolve(result);
                })
                .catch(error => {
                  const msg = 'Usuário Inválido';
                  console.log('Failed POST signup user', error.message);
                  reject(error);
                });
            });
        },
        findSeller: function(ean, data) {
            return new Promise((resolve, reject) => {
                const urlSeller = 'https://locatestore.intellibrand.ai/product/'+ean;
            
                fetch(urlSeller, {
                  method: 'GET',
                  headers: {
                    'Authorization': data.token
                  }
                })
                .then(response => {
                  if(response.ok) {
                    return response.json();
                  } else {
                    throw new Error('Não foi possível fazer o login.');
                  }
                })
                .then(result => {
                  resolve(result);
                })
                .catch(error => {
                  const msg = 'Error no retorno ean';
                  console.log('Failed GET findSeller', error.message);
                  reject(error);
                });
            });
        },
        isMobile : function(){
            if (navigator.userAgent.match(/iPad|iPhone|Android|BlackBerry|webOS/i) ) {
                return true;
            }
            else{
                return false;
            }
        },
        mascaraMoeda : function(valor){
            /*
                Máscara Moeda com Expressão Regular
            */
            var m = valor.toString(); //Exemplo 'R$ 3.942,49' ou 432,00;
            m=m.replace(/\D/g,""); //Remove tudo o que não é dígito
            m=m.replace(/(\d{2})$/,",$1"); //Coloca a virgula
            m=m.replace(/(\d+)(\d{3},\d{2})$/g,"$1.$2"); //Coloca o primeiro ponto

            return m;
        }
    },
    helpers: {       
        setSlides: function(result) {
            const itens = result.data;
            const nameProduct = itens.name;
            const imgProduct = itens.images[0].urls.big;

            var warning = document.createElement('p');
            warning.className = 'slideshow__slide-warning';
            warning.innerHTML = '<strong>Atenção:</strong> Após lavagem das mãos, puxe totalmente o êmbolo do aplicador. Coloque o comprimido vaginal no aplicador de forma que metade do comprimido fique fora do aplicador, com o lado arredondado para fora. Pressione ligeiramente com os dedos a ponta redonda do aplicador enquanto faz este procedimento.';

            const slideshowSlide = document.createElement('div');
            slideshowSlide.className = 'slideshow__slide';

            slideshowSlide.innerHTML = `
            <div class="slideshow__product">
                <div class="slideshow__slide-image ${ App.events.isMobile()? 'desk': 'mob' } ">
                <img src="${ imgProduct }" alt="${ nameProduct }" title="${ nameProduct }">
                </div>
                <h2 class="slideshow__slide-title">${ nameProduct }</h2>
                <div class="slideshow__slide-image ${ App.events.isMobile()? 'mob': 'desk' } ">
                <img src="${ imgProduct }" alt="${ nameProduct }" title="${ nameProduct }">
                </div>
            </div>`;

            slideshowSlide.querySelector('.slideshow__product').append(warning);

            const listSeller = document.createElement('ul');
            listSeller.className = 'list__seller';

            itens.offers.forEach(iten => {
                if(iten.available === true) {
                const seller = document.createElement('li');
                seller.innerHTML = '<div class="seller__logo"><img src="' + iten.retailerLogo + '" /></div>' +
                    '<div class="seller__details">' +
                    '<strong>R$ ' + App.events.mascaraMoeda(iten.price)  + '</strong>' +
                    '<p>Em estoque <span>&#128504;</span></p>' +
                    '</div>' +
                    '<div class="seller__buy">'+
                    '<a href="' + iten.url + '">Comprar</a>'+
                    '<p>Em estoque <span>&#128504;</span></p>'+
                    '</div>';

                    listSeller.appendChild(seller);
                }
            });

            var encontreFarmacia = document.createElement('h4');
            encontreFarmacia.className = 'slideshow__farm';
            encontreFarmacia.innerHTML = 'Encontre nas Farmácias';

            listSeller.prepend(encontreFarmacia);

            slideshowSlide.appendChild(listSeller);

            document.getElementsByClassName('content')[0].append(slideshowSlide);
        },
        lightBox: function() {
            const tokenPromise = App.events.findToken();
            tokenPromise.then((data) => {
                objEan.forEach((ean, key) => {                    
                    App.events.findSeller(ean, data).then(result => {
                        if(result.status === 200) {
                            App.helpers.setSlides(result);

                            if((key + 1) === objEan.length) {
                                //Last element, start carousel
                                App.carousel.init();
                            }
                        } else {
                            throw new Error('findSeller: ' + result.statusText);
                        }
                    });
                });
              }).catch(error => {
                console.log('Failed no retorno da promise', error.message);
            });
        }
    },
    carousel: {
        init: function() {
            try {
                App.carousel.startCarousel();
                App.carousel.event.btnBullets();

                if(App.passou) {
                    App.carousel.event.btnNext();
                    App.carousel.event.btnPrev();
                    App.carousel.event.btnClose();

                    App.passou = false;
                }
            } catch(e) {
                console.error('Error ao iniciar carousel', e.message);
            }
        },
        setSlideshowBullets: function(qntSlides) {
            for(var i = 1; i <= qntSlides.length; i++) {
                var bullets = document.createElement('span');
                bullets.className = 'dot';
                bullets.setAttribute('data-bullets',i);
                document.getElementsByClassName('slideshow__bullets')[0].append(bullets);
            }
        },
        showSlides: function(n) {
            var i;
            var slides = document.getElementsByClassName(App.slideClass);
            var dots = document.getElementsByClassName("dot");
        
            if (n > slides.length) {
                App.slideIndex = 1;
            }
         
            if (n < 1) {
                App.slideIndex = slides.length;
            }
        
            for (i = 0; i < slides.length; i++) {
                slides[i].classList.remove('active');
                //slides[i].style.display = "none"; 
            }
        
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
        
            slides[App.slideIndex-1].classList += ' active';
            if(dots[App.slideIndex-1]) {
                dots[App.slideIndex-1].className += ' active';
            }            
        },
        startCarousel: function() {
            var qntSlides = document.querySelectorAll('.slideshow .slideshow__slide');

            if(qntSlides.length > 0) {
                App.carousel.setSlideshowBullets(qntSlides);
                App.carousel.showSlides(App.slideIndex);

                if(qntSlides.length > 1) {
                    document.getElementsByClassName('slideshow__button')[0].style.display = 'block';
                    document.getElementsByClassName('slideshow__bullets')[0].classList += ' active';
                }
                document.querySelector('body').classList.add('fade__lightbox');
            }
        },
        plusSlides: function(n) {
            App.carousel.showSlides(App.slideIndex += n);
        },
        currentSlide: function(n) {
            App.carousel.showSlides(App.slideIndex = n);
        },
        event: {
            btnBullets: function() {
                document.querySelectorAll('.slideshow__bullets span.dot').forEach(iten => {
                    iten.addEventListener('click', function(event) {
                        var bullets = event.target.getAttribute('data-bullets');
                        App.carousel.currentSlide(Number(bullets));
                    });
                });
            },
            btnNext: function() {
                document.querySelector('.slideshow__button .next').addEventListener('click', function(event) {
                    var next = event.target.getAttribute('data-next');
                    App.carousel.plusSlides(Number(next));
                });
            },
            btnPrev: function() {
                document.querySelector('.slideshow__button .prev').addEventListener('click', function(event) {
                    var prev = event.target.getAttribute('data-prev');
                    App.carousel.plusSlides(Number(prev));
                });
            },
            btnClose: function() {
                document.querySelector('.slideshow__container .slideshow__close').addEventListener('click', function() {
                    document.querySelector('body').classList.remove('fade__lightbox');
                    document.querySelector('.slideshow__container .content').innerHTML = '';
                    document.querySelector('.slideshow__container .slideshow__bullets').innerHTML = '';
                    document.querySelector('.slideshow__container .slideshow__bullets').classList.remove('active');
                    document.querySelector('.slideshow__container .slideshow__button').style.display = 'none';
                });

                document.querySelector('.fade__lightbox .bgFloater').addEventListener('click', function() {
                    document.querySelector('body').classList.remove('fade__lightbox');
                    document.querySelector('.slideshow__container .content').innerHTML = '';
                    document.querySelector('.slideshow__container .slideshow__bullets').innerHTML = '';
                    document.querySelector('.slideshow__container .slideshow__bullets').classList.remove('active');
                    document.querySelector('.slideshow__container .slideshow__button').style.display = 'none';
                });
            }
        }
    },
    handlers: {
        init: function() {
            try {
                App.handlers.openLightBox();
            } catch(e) {
                console.error(e.message);
            }
        },
        openLightBox: function() {
            /* event clique para capturar o ean do botão comprar e abrir o Lightbox */
            document.getElementsByClassName('btn_comprar')[0].addEventListener('click', function(event) {
                objEan = event.target.getAttribute('data-ean').split(',');
                App.helpers.lightBox(objEan);
            });
        }
    }
}

App.init();