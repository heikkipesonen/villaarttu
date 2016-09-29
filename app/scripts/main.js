(function App () {
  const slide_images = [
    'https://hd.unsplash.com/photo-1470104240373-bc1812eddc9f',
    'https://hd.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    'https://hd.unsplash.com/photo-1471074454408-f7db62d99254'
  ];

  const api_url = 'http://localhost:8888/villaarttu/proxy.php';
  const container = document.getElementById('image-feed');
  const slider = document.getElementById('slider');

  container.classList.add('api-loading');

  fetch(api_url).then((blob) => {
    blob.json().then((data) => {
      container.classList.remove('api-loading');
      let content = data.items.map(renderImageFeedItem).join('');
      container.innerHTML = content;
    });
  });

  function renderImageFeedItem (imageData) {
    return `
    <div class="image-feed-item col-xs-12 col-md-4 col-lg-3">
      <a href="${imageData.link}" target="_blank">
        <figure class="image-container" style="background-image: url('${imageData.images.standard_resolution.url}')"></figure>
      </a>
    </div>
    `;
  }

  function setActiveSlide(target) {
    let active = slider.querySelector('.slide-active')
    let activeTab = slider.querySelector('.tab-active')

    if (active) active.classList.remove('slide-active');
    if (activeTab) activeTab.classList.remove('tab-active');

    slider.querySelector(`[data-image="${target}"]`).classList.add('slide-active');
    slider.querySelector(`[data-target="${target}"]`).classList.add('tab-active');
  }

  let images = slide_images.map((imagePath) => {
    return `
        <div class="slide" data-image="${imagePath}">
          <div class="slide-image" style="background-image: url('${imagePath}')"></div>
        </div>
      `;
    }).join('');

  let tabs = slide_images.map((imagePath) => {
      return `
        <div class="slider-tab" data-target="${imagePath}"></div>
      `;
  }).join('');

  tabs = `<div class="slider-tabs-wrapper">${tabs}</div>`;


  slider.innerHTML = images + tabs;
  let sliderTabElements = slider.querySelectorAll('.slider-tab');
  for (let i = 0; i < sliderTabElements.length; i++) {
    let element = sliderTabElements[i];

    element.addEventListener('click', (evt) => setActiveSlide(evt.srcElement.getAttribute('data-target')));
    element.addEventListener('touchend',  (evt) => setActiveSlide(evt.srcElement.getAttribute('data-target')));
  }

  setActiveSlide(slide_images[0]);

})();
