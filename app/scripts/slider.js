'use strict';
/* eslint-disable */
class Slider {
  constructor (options) {
    this.options = options;

    this._state = {
      dragStarted: false,
      x: 0,
      y: 0,
      deltax: 0,
      deltay: 0,
      animation: 0,
      dirty: false
    };

    this.lastEvent = false;
    this.timer = false;

    this.indicators = [];
    this.slides = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ];

    this.container = document.querySelector(options.element);
    this.slideContainer = document.createElement('div');
    this.slideIndicatorContainer = document.createElement('div');
    this.slideContainer.classList.add('slide-container');
    this.slideIndicatorContainer.classList.add('slide-indicator-container');

    this.slides.forEach((slide) => {
      slide.classList.add('slide');
      this.slideContainer.appendChild(slide);
    });

    this.container.appendChild(this.slideContainer);
    this.container.appendChild(this.slideIndicatorContainer);

    this.viewWidth = 0;

    document.addEventListener('mouseup', (evt) => this.endDrag(evt));
    document.addEventListener('mousemove', (evt) => this.onDrag(evt));
    this.container.addEventListener('mousedown', (evt) => this.startDrag(evt));
    this.container.addEventListener('touchstart', (evt) => this.startDrag(evt));
    this.container.addEventListener('touchmove', (evt) => this.onDrag(evt));
    this.container.addEventListener('touchend', (evt) => this.endDrag(evt));

    document.addEventListener('keyup', (evt) => {
      if (evt.keyCode === 39) {
        this.next();
      } else if (evt.keyCode === 37) {
        this.prev();
      }
    });

    window.addEventListener('resize', () => {
      this.resizeSlides();
      this.center = 1;
    });

    this.resizeSlides();
    this.buildIndicators();
    this.update();

    this.setTimer();

    this.current = options.slides[0].id;
    this.center = 1;
  }

  set current (id) {
    this.currentSlide = this.getSlide(id);
    let index = this.options.slides.indexOf(this.currentSlide);

    this.indicators.forEach((indicator) => indicator.classList.remove('selected'));
    this.indicators[index].classList.add('selected');

    if (this.slides[1].innerHTML !== this.currentSlide.content) {
      this.slides[1].innerHTML = this.currentSlide.content;
    }

    if (this.slides[2].innerHTML !== this.getSlide(this.currentSlide.next).content) {
      this.slides[2].innerHTML = this.getSlide(this.currentSlide.next).content;
    }
    if (this.slides[0].innerHTML !== this.getSlide(this.currentSlide.prev).content) {
      this.slides[0].innerHTML = this.getSlide(this.currentSlide.prev).content;
    }
  }

  set center (index) {
    this.state = {x: this.viewWidth * index};
  }

  resetPosition () {
    this.center = 1;
    this.state = {
      animation: this.options.animation || 300
    };

    setTimeout(() => {
      this.state = {animation: 0};
    }, this.options.animation || 300);
  }

  next () {

    this.center = 2;
    this.state = {
      animation: this.options.animation || 300
    };

    setTimeout(() => {
      let slide = this.slides.shift();
      this.slides.push(slide);
      this.center = 1;
      this.current = this.currentSlide.next;
      this.reflow();
      this.state = {animation: 0};
      this.setTimer();

    }, this.options.animation || 300);
  }

  prev () {
    this.center = 0;
    this.state = {
      animation: this.options.animation || 300
    };

    setTimeout(() => {
      let slide = this.slides.pop();
      this.slides.unshift(slide);
      this.center = 1;
      this.current = this.currentSlide.prev;
      this.reflow();
      this.state = {animation: 0};
      this.setTimer();

    }, this.options.animation || 300);
  }

  getSlide (id) {
    return this.options.slides.find((slide) => slide.id === id) || {content: ''};
  }

  buildIndicators () {
    this.indicators.length = 0;
    this.options.slides.forEach(() => {
      let element = document.createElement('div');
      element.classList.add('slide-indicator');
      this.indicators.push(element);
      this.slideIndicatorContainer.appendChild(element);
    });
  }

  resizeSlides () {
    this.viewWidth =this.container.offsetWidth;
    this.slides.forEach((slide, index) => {
      slide.style.width = this.viewWidth + 'px';
    });

    this.slideContainer.style.width = (this.viewWidth * 3) + 'px';
    this.reflow();
  }

  reflow () {
    this.slides.forEach((slide, index) => {
      slide.style.left = (this.viewWidth * index) + 'px';
    });
  }

  getPointer (evt) {
    let position = {};

    if (evt.touches && evt.touches.length) {
      position = {
        x: evt.touches[0].pageX,
        y: evt.touches[0].pageY,
        timeStamp: evt.timeStamp
      };
    } else {
      position ={
        x: evt.pageX,
        y: evt.pageY,
        timeStamp: evt.timeStamp
      };
    }

    if (this.lastEvent) {
      position.vx = (position.x - this.lastEvent.x ) / (position.timeStamp - this.lastEvent.timeStamp);
      position.vy = (position.y - this.lastEvent.y ) / (position.timeStamp - this.lastEvent.timeStamp);
    }

    return position;
  }

  get distToCenter () {
    return this.state.x - this.viewWidth;
  }

  get offset () {
    return (this.state.x - this.viewWidth) / this.viewWidth;
  }

  get state () {
    return this._state;
  }

  set state (state) {
    Object.keys(state).forEach((key) => {
      if (this._state[key] !== state[key]) {
        this._state[key] = state[key];
        this._state.dirty = true;
      }
    });
  }

  clearTimer () {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  setTimer () {
    this.clearTimer();
    if (this.options.interval) {
      this.timer = setTimeout(() => {
        this.next();
      }, this.options.interval);
    }
  }

  update () {
    if (this.state.dirty) {
      this.slideContainer.style.transform = `translate3d(${-this.state.x}px, 0, 0)`;
      this.slideContainer.style['-webkit-transform'] = `translate3d(${-this.state.x}px, 0, 0)`;
      this.slideContainer.style['-ms-transform'] = `translate3d(${-this.state.x}px, 0, 0)`;
      this.slideContainer.style['-o-transform'] = `translate3d(${-this.state.x}px, 0, 0)`;
      this.slideContainer.style['transition-duration'] = `${this.state.animation}ms`;

      this._state.dirty = false;
    }
    window.requestAnimationFrame(() => this.update());
  }

  startDrag (evt) {
    this.state.dragStarted = true;
    this.lastEvent = this.getPointer(evt);
    this.clearTimer();
  }

  onDrag (evt) {
    if (!this.state.dragStarted) {
      return;
    }

    let currentPosition = this.getPointer(evt);

    let dx = this.lastEvent.x - currentPosition.x;
    let dy = this.lastEvent.y - currentPosition.y;

    this.state = {
      x: this.state.x + dx,
      y: this.state.x + dy,
      deltax: this.state.deltax + dx,
      deltay: this.state.deltay + dy
    };

    this.lastEvent = this.getPointer(evt);
  }

  endDrag () {
    this.state.dragStarted = false;
    if (this.offset > 0.3 || this.lastEvent.vx < -0.3 && Math.abs(this.state.deltax) > 10) {
      this.next();
    } else if (this.offset < -0.3 || this.lastEvent.vx > 0.3 && Math.abs(this.state.deltax) > 10) {
      this.prev();
    } else {
      this.resetPosition();
    }

    this.setTimer();
    this.state = {
      deltax: 0,
      deltay: 0
    };
  }
}
