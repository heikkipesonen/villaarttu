  'use strict';


  const sliderOptions = {
    element: '#slider',
    animation: 300,
    interval: 5000,
    slides: Array(12).fill(false).map((item, index) => {
      let i = index + 1;
      return {
        id: index,
        content: `<div class="slide-image" style="background-image: url('images/${i}.jpg')"></div>`,
        next: i > 11 ? 0 : i,
        prev: i - 2 < 0 ? 11 : i - 2
      };
    })
  };

  const parallaxLayers = [
    {
      image: 'images/villa-arttu-web-palikka1.png'
    },
    {
      image: 'images/villa-arttu-web-palikka2.png'
    }
  ];

  /* eslint-disable */
  var slider = new Slider(sliderOptions);
  var scroll = new ParallaxScroller(parallaxLayers);
  /* eslint-enable */

  const apiUrl = 'data.json';
  const container = document.getElementById('image-feed');

  function renderImageFeedItem (imageData) {
    return `
    <div class="image-feed-item col-xs-12 col-md-4 col-lg-3">
      <a href="${imageData.link}" target="_blank">
        <figure class="image-container" style="background-image: url('${imageData.images.standard_resolution.url}')"></figure>
      </a>
    </div>
    `;
  }

  container.classList.add('api-loading');

  fetch(apiUrl).then((blob) => {
    blob.json().then((data) => {
      container.classList.remove('api-loading');
      let content = data.items.map(renderImageFeedItem).join('');
      container.innerHTML = content;

      window.dispatchEvent(new Event('resize'));
    });
  });

  /* eslint-disable */
  function sliderNext () {
    slider.next();
  }

  function sliderPrev () {
    slider.prev();
  }
  /* eslint-enable */
