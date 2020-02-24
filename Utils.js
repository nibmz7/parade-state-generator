const Utils = {
  onclick: function(target, callback) {
    let dragging = false;
    target.onpointerdown = e => {
      dragging = false;
    }
    target.onpointermove = e => {
      dragging = true;
    }
    target.onpointerup = e => {
      if (dragging) return;
      callback(e);
    }
  },

  animate: function(element, animation, callback) {
    const listener = (e) => {
      element.removeEventListener('animationend', listener);
      callback();
    }
    element.addEventListener('animationend', listener);
    element.classList.add(animation);
  }
}

export default Utils;