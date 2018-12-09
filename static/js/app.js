function buildMetadata(sample) {

  //// Builds the metadata panel
  let url = `/metadata/${sample}`;

  d3.json(url).then(function(data) {

    // Select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Clear any existing metadata
    panel.html("");

    var div = panel.append("div");
    Object.entries(data).forEach(function([key, value]) {
      keyUpper = key.toUpperCase()
      if (keyUpper != "WFREQ") {
        if (!value) {
          div.append("p").text(`${keyUpper}: N/A`);
        } else {
          div.append("p").text(`${keyUpper}: ${value}`);
        }
      };
    });

    // Call buildGauge function to build Gauge Chart
    buildGauge(data.WFREQ);
  });
}



//// Function to build the bubble Chart and Pie Chart
function buildCharts(sample) {

  // Fetch the sample data for the plots
  let url = `/samples/${sample}`;

  // Call d3.json function to get data from the url
  d3.json(url).then (function(sample_data) {

    // Create Bubble Chart using the date from samples/sample route
    var trace1 = {
      x: sample_data.otu_ids,
      y: sample_data.sample_values,
      type: "scatter",
      mode: "markers",
      text: sample_data.otu_labels,
      hoverinfo: "x+y",
      marker: {
        size: sample_data.sample_values,
        color: sample_data.otu_ids
      }
    };

    var data = [trace1];

    var layout = {
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        autorange: true,
        title: "Sample Values"
      },
      height: 800,
      // width: 2000,
      // autosize: true,
      showlegend: false
    };

    Plotly.newPlot("bubble", data, layout);


    // Create Pie Chart  using the date from samples/sample route
    // Create arrays to hold the data
    var sample_values = sample_data.sample_values.map(value => value);
    var otu_ids = sample_data.otu_ids.map(value => value);
    var otu_labels = sample_data.otu_labels.map(value => value);

    // Sort the sample values in descending order, and get top 10
    var sample_values_sorted = sample_data.sample_values.map(value => value);
    sample_values_sorted = sample_values_sorted.sort(function compareFunction(firstNum, secondNum) {
      return secondNum - firstNum;
    }).slice(0, 10);

    var otu_ids_sorted = [];
    var otu_labels_sorted = [];

    // Get the otu_ids and otu_labels for the top 10 sample values
    for (var i=0; i<sample_values_sorted.length; i++) {
      var index_of_sample_value = sample_values.indexOf(sample_values_sorted[i]);

      var otu_id = otu_ids[index_of_sample_value];
      var otu_label = otu_labels[index_of_sample_value];

      otu_ids_sorted.push(otu_ids[index_of_sample_value]);
      otu_labels_sorted.push(otu_labels[index_of_sample_value]);

      sample_values.splice(index_of_sample_value, 1 );
      otu_ids.splice(index_of_sample_value, 1 );
      otu_labels.splice(index_of_sample_value, 1 );
    };

    // Build the pie chart
    data = [{
      values: sample_values_sorted,
      labels: otu_ids_sorted,
      hoverinfo: 'label+percent+value',
      // text: otu_labels_sorted,
      type: "pie"
    }];

    var 
    layout = {
      // autosize: false,
      showlegend: true,
      height: 450,
      width: 450,
      margin: {
        l: 50,
        r: 0,
        b: 0,
        t: 0,
        pad: 4
      }
    };

    Plotly.newPlot("pie", data, layout);
  });
}



// Function to initilize the page
function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


// Function to build new charts when select a sample value
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}


// Function to create the gauge chart
function buildGauge(belly_data) {

  var level = belly_data;

  // Trig to calc meter point
  var degrees = 9 - level,
       radius = .5;
  var radians = degrees * Math.PI / 9;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -0.0 -0.025 L 0.0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'frequency',
      text: level,
      hoverinfo: 'text+name'},
      { values: [2, 2, 2, 2, 2, 2, 2, 2, 2, 18],
    // { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6',
              '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:['rgba(106, 134, 98, .5)', 'rgba(131, 155, 129, .5)', 'rgba(141, 179, 131, .5)', 
                     'rgba(181, 196, 145, .5)', 'rgba(200, 211, 150, .5)', 'rgba(216, 216, 170, .5)', 
                     'rgba(230, 230, 203, .5)', 'rgba(240, 237, 224, .5)', 'rgba(247, 243, 236, .5)', 'rgba(255, 255, 255, 0)'] },
    // labels: ['8.1-9', '7.1-8', '6.1-7', '5.1-6', '4.1-5', '3.1-4', '2.1-3', '1-2', '0-1', ''],
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


// Initialize the dashboard by calling the init function
init();




