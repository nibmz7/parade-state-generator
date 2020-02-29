const Utils = {
  onclick: function(target, callback) {
    let element;
    //https://stackoverflow.com/questions/5748476/javascript-equivalent-of-mouseleave-for-touch-interactions
    target.onpointerdown = e => {
      target.classList.add('active');
      console.log(e);
      console.log('down');
      element = document.elementFromPoint(e.pageX,e.pageY);
      console.log(element);
    }
    target.onpointermove = e => {
      
    }
    target.onpointerup = e => {
      target.classList.remove('active');
      if(element === document.elementFromPoint(e.pageX,e.pageY)) {
        callback(e);
        console.log(element);
      }
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