const findToken = () => {
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
};

const findSeller = (ean, data) => {
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
};

function setSlides(result) {
  const itens = result.data;
  const nameProduct = itens.name;
  const imgProduct = itens.images[0].urls.big;

  const slideshowSlide = document.createElement('div');
  slideshowSlide.className = 'slideshow__slide';
  slideshowSlide.innerHTML = `
  <div class="slideshow__product">
    <div class="slideshow__slide-image">
      <img src="${ imgProduct }" alt="${ nameProduct }" title="${ nameProduct }">
    </div>
    <h2 class="slideshow__slide-title">${ nameProduct }</h2>
    <h3 class="slideshow__slide-sub">Resolve a candidiase, e alivia os sintomas desde o primeiro uso</h3>
    <p class="slideshow__slide-warning"><strong>Atenção:</strong> Após lavagem das mãos, puxe totalmente o êmbolo do aplicador. Coloque o comprimido vaginal no aplicador de forma que metade do comprimido fique fora do aplicador, com o lado arredondado para fora. Pressione ligeiramente com os dedos a ponta redonda do aplicador enquanto faz este procedimento.</p>
  </div>`;

  const listSeller = document.createElement('ul');
  listSeller.className = 'list__seller';

  itens.offers.forEach(iten => {
    if(iten.available === true) {
      const seller = document.createElement('li');
      seller.innerHTML = '<div class="seller__logo"><img src="' + iten.retailerLogo + '" /></div>' +
        '<div class="seller__details">' +
          '<strong>R$ ' + iten.price + '</strong>' +
          '<p>Em estoque <span>&#128504;</span></p>' +
        '</div>' +
        '<div class="seller__buy"><a href="' + iten.url + '">Comprar</a></div>';
      listSeller.appendChild(seller);
    }
  });

  slideshowSlide.appendChild(listSeller)

  document.getElementsByClassName('content')[0].append(slideshowSlide);
}

const tokenPromise = findToken();
tokenPromise.then((data) => {
  var objEan = ['7891106001755','7891106003230','7891106001762'];

  objEan.forEach(ean => {
    findSeller(ean, data).then(result => {
      if(result.status === 200) {
        setSlides(result);
      } else {
        throw new Error('findSeller: ' + result.statusText);
      }
    });
  });

}).catch(error => {
  console.log('Failed no retorno da promise', error.message);
});
