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

const tokenPromise = findToken();
tokenPromise.then((data) => {
  const url = 'https://locatestore.intellibrand.ai/product/7891106001755';

  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': data.token
    }
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Could not reach the API: ' + response.statusText);
    }
  }).then(result => {
    const itens = result.data;
    const nameProduct = itens.name;
    const imgProduct = itens.images[0].urls.small;

    const slideshowSlide = document.createElement('div');
    slideshowSlide.className = 'slideshow__slide';
    slideshowSlide.innerHTML = `
    <div class="slideshow__product">
      <div class="slideshow__slide-image">
        <img src="${ imgProduct }" alt="${ nameProduct }" title="${ nameProduct }">
      </div>
      <h2 class="slideshow__slide-title">${ nameProduct }</h2>
      <h3 class="slideshow__slide-sub"></h3>
      <p class="slideshow__slide-warning"></p>
    </div>`;

    const listSeller = document.createElement('ul');
    listSeller.className = 'list__seller';

    itens.offers.forEach(iten => {
      if(iten.available === true) {
        const seller = document.createElement('li');
        seller.innerHTML = '<div class="seller__logo"><img src="' + iten.retailerLogo + '" /></div>' +
          '<div class="seller__details">' +
            '<strong>R$ ' + iten.price + '</strong>' +
            '<p>Em estoque</p>' +
          '</div>' +
          '<a href="' + iten.url + '" class="seller__buy">Comprar</a>';
        listSeller.appendChild(seller);
      }
    });

    slideshowSlide.appendChild(listSeller)

    document.getElementsByClassName('content')[0].append(slideshowSlide);
  }).catch(error => {
    console.log(error.message);
  });
}).catch(error => {
  console.log('Failed no retorno da promise', error.message);
});
