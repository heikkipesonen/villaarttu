/* eslint-disable */
'use strict';

const prefixes = ['moz', 'o', 'ms', 'webkit'];

class ParallaxScroller {

  constructor (layers) {
    this.container = window;
    this.scrollContent = document.body;

    this.layers = layers;
    this.maxScroll = 0;

    this.scrollContainer = document.createElement('div');
    this.scrollContainer.classList.add('parallax-wrapper');
    this.scrollContent.insertBefore(this.scrollContainer, this.scrollContent.firstChild);

    this._layers = this.layers.map((layer) => this.loadLayer(layer));

    this.container.addEventListener('scroll', () => this.applyScroll());
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  loadLayer (layer) {
    let me = this;
    let img = new Image();

    let renderLayer = {
      el: document.createElement('div'),
      layer,
      img: img,
      movementRatio: 0
    };

    this.scrollContainer.appendChild(renderLayer.el);

    img.onload = function () {
      renderLayer.el.appendChild(img);
      me.resize();
    };

    img.src = layer.image;

    return renderLayer;
  }

  resize () {
    this.scrollContainer.style.height = this.scrollContent.offsetHeight + 'px';
    this.scrollContainer.style.width = this.scrollContent.offsetWidth + 'px';

    let height = this.container.innerHeight;
    this.maxScroll = (this.scrollContent.scrollHeight - this.container.innerHeight);

    this._layers.forEach((layer) => {
      layer.movementRatio = this.scrollContent.scrollHeight / layer.el.offsetHeight;
    });

    this.applyScroll();
  }

  applyScroll () {
    let currentPosition = this.container.scrollY;

    this._layers.map((layer) => {
      prefixes.forEach((prefix) => {
        layer.el.style[`-${prefix}-transform`] = `translate3d(0, ${-currentPosition * layer.movementRatio}px, 0)`;
      });
      layer.el.style[`transform`] = `translate3d(0, ${-currentPosition * layer.movementRatio}px, 0)`;
    });
  }

}
