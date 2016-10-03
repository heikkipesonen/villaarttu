  'use strict';


  const sliderOptions = {
    element: '#slider',
    animation: 300,
    slides: [
      {
        id: 1,
        content: '<div class="slide-image" style="background-image: url(https://hd.unsplash.com/photo-1470104240373-bc1812eddc9f)"></div>',
        next: 2,
        prev: 4
      },
      {
        id: 2,
        content: '<div class="slide-image" style="background-image: url(https://hd.unsplash.com/photo-1470229722913-7c0e2dbbafd3)"></div>',
        next: 3,
        prev: 1
      },
      {
        id: 3,
        content: '<div class="slide-image" style="background-image: url(https://hd.unsplash.com/photo-1471074454408-f7db62d99254)"></div>',
        next: 4,
        prev: 2
      },
      {
        id: 4,
        content: '<div class="slide-image" style="background-image: url(https://hd.unsplash.com/photo-1470660513416-5494d0eab742)"></div>',
        next: 1,
        prev: 3
      }
    ]
  };

  /* eslint-disable */
  new Slider(sliderOptions);
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
    });
  });
