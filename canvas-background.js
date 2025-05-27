// canvas-background.js

(() => {
    const canvas = document.getElementById('canvas-background'); // gets a reference to the HTML <canvas> element
    const context = canvas.getContext('2d'); // get the rendering context for the canvas
    
    // get document's width and height
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // set background to be fullscreen
    canvas.width = width;
    canvas.height = height;
    
    const drawBackground = () => {
      // The inner circle is at x=0, y=0, with radius=height
      // The outer circle is at x=0, y=0, with radius=width
      const gradient = context.createRadialGradient(0, 0, height, 0, 0, width);
      // offset and color
      gradient.addColorStop(0, '#002D62');
      gradient.addColorStop(0.5, '#0066b2');
      gradient.addColorStop(1, '#6699CC');
  
      // make canvas the color of gradient
      context.fillStyle = gradient;
      // place its top-left corner at (0, 0), and
      // and give it a size of "width" wide by "height" tall.
      context.fillRect(0, 0, width, height);
    };
        
    const drawForeground = () => {
      context.fillStyle = '#13274F';
      context.fillRect(0, height * 0.95, width, height);
      
      context.fillStyle = '#002D62';
      context.fillRect(0, height * 0.955, width, height);
    };
  
    drawBackground();
    drawForeground();
  })();