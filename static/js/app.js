function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  let url = `/metadata/${sample}`;

  d3.json(url).then(function(data) {

    // console.log(data);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    var div = panel.append("div");
    Object.entries(data).forEach(function([key, value]) {
      keyUpper = key.toUpperCase()
      if (keyUpper != "WFREQ") {
        div.append("p").text(`${keyUpper}: ${value}`);
      };
    });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  let url = `/samples/${sample}`;

  d3.json(url).then (function(data) {
    console.log(data);
        console.log(data.otu_ids);

    // Bubble Chart using the date from samples/sample route

    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      type: "scatter",
      mode: "markers",
      text: data.otu_labels,
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    };

    data = [trace1];

    var layout = {
      title: "Chart",
      xaxis: {
        title: "OTU IDs"
      },
      yaxis: {
        autorange: true,
        title: "Sample Values"
      },

      showlegend: false
    };

    Plotly.newPlot("bubble", data, layout);


    // @TODO: Build a Pie Chart


    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
}

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

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();








        // function sortObject (objectToSort) {
        //     // User JSON parse() and stringify() to break references.
        //     var ids = JSON.parse(JSON.stringify(objectToSort.ids));

        //     // By default array sort is as strings, so for numbers
        //     // we must supply a compare function.
        //     ids.sort(function (a, b) {
        //         if (a > b) {
        //             return -1;
        //         }
        //         if (a < b) {
        //             return 1;
        //         }
        //         return 0;
        //     });
            
        //     // We use this to gather names for the sorted ids.
        //     var names = [];
        //     // Iterate over the sorted ids.
        //     ids.forEach(function (id, index) {
        //         // Get the index of the id in the object to sort.
        //         var objIdsIndex = objectToSort.ids.indexOf(id);

        //         // Get the corresponding name for the id.
        //         var nameAtIndex = objectToSort.names[objIdsIndex];

        //         // Put the name at the same index as the sorted ids.
        //         names.push(nameAtIndex);                
        //     });
        //     // Replace the ids and names of the object to sort with
        //     // the sorted its and the names we put in the same order.
        //     objectToSort.ids = ids;
        //     objectToSort.names = names;
        // }
