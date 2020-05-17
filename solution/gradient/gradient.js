function Gradient(callback) {
  this.first_color = [255, 255, 255, 1];
  this.second_color = [0, 0, 0, 1];
  this.from = document.querySelector('#from');
  this.to = document.querySelector('#to');
  this.gradient = document.querySelector('#gradient');
  this.callback = callback;

  new Picker({
      parent: document.querySelector('#from'),
      popup: true,
      color: 'rgb(255, 255, 255)',
      onDone: color => {
        this.first_color = color.rgba;
        this.updateGradient();
      },
      onChange: color => {
        this.from.style['background-color'] = `rgba(${color.rgba.join(', ')})`;
      },
      onClose: color => {
        this.from.style['background-color'] = `rgba(${this.first_color.join(', ')})`;
      }
  });

  new Picker({
      parent: document.querySelector('#to'),
      popup: true,
      color: 'rgb(0, 0, 0)',
      onDone: color => {
        this.second_color = color.rgba;
        this.updateGradient();
      },
      onChange: color => {
        this.to.style['background-color'] = `rgba(${color.rgba.join(', ')})`;
      },
      onClose: color => {
        this.to.style['background-color'] = `rgba(${this.second_color.join(', ')})`;
      }
  });

  this.updateGradient = function() {
    let first = from.style['background-color'] = `rgba(${this.first_color.join(', ')})`;
    let second = to.style['background-color'] = `rgba(${this.second_color.join(', ')})`;
    gradient.style['background'] = `linear-gradient(to right, ${first}, ${second})`;
    this.callback();
  }
}
