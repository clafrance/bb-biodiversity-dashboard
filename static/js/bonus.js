function buildGauge(belly_data) {
  // Enter a speed between 0 and 180
  var level = belly_data;

  // Trig to calc meter point
  var degrees = 9 - level,
       radius = .5;
  var radians = degrees * Math.PI / 9;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'speed',
      text: level,
      hoverinfo: 'text+name'},
    { values: [20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6',
              '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(106, 134, 98, .5)', 'rgba(131, 165, 129, .5)', 'rgba(141, 179, 131, .5)', 
                     'rgba(181, 196, 145, .5)', 'rgba(200, 211, 150, .5)', 'rgba(216, 216, 170, .5)', 
                     'rgba(232, 230, 203, .5)', 'rgba(243, 241, 229, .5)', 'rgba(247, 243, 236, .5)',  'rgba(255, 255, 255, 0)']},
    labels: ['8.1-9', '7.1-8', '6.1-7', '5.1-6', '4.1-5', '3.1-4', '2.1-3', '1.1-2', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: 'Belly Button Washing Times per Week',
    height: 500,
    width: 500,
    margin: {
      l: 50,
      r: 0,
      b: 0,
      t: 150,
      pad: 4
    },
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);
}