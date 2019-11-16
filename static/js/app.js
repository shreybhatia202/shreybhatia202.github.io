// Global variables
let names         = [];
let metadata      = []; 
let samples       = [];
let subjectIdData = [];
let otu_ids       = [];
let all_otu_ids   = [];
let values        = [];
let allValues     = [];
let tmpHover      = [];
let bubbleHoverText= [];
let hovertext     = [];
let labels        = [];
let currSubjectId = "963";


// Sort array in desc order.
let sortArrayDesc = (a,b) => b-a;

// Split the dataset. 
d3.json("./static/data/samples.json")
    .then( data =>  {
        names = data.names; 
        names.unshift("Choose other ID...");
        metadata = data.metadata;
        samples  = data.samples; 

        // Grab dropdown element  
        let dropdown = d3.select("#selDataset");

        // Clear drop-down content 
        dropdown.text("");

        // // Populate dropdown 
        dropdown
        .selectAll("option")
        .data(names)
        .enter()
        .append("option")  
            .text( d => d);
        
        filterData ( );
        init();
});


// Event for select Subject Id
d3.select("#selDataset").on('change', () => {

  currSubjectId = d3.event.target.value;
  if (parseInt( currSubjectId )) { 

    filterData();

    updBarChart();

    updBubbleChart();

    updDemoInfo();

  }
});


// Update  Bar Chart;
let updBarChart = ( ) => {
var layoutBar = {
  title: 'Subject ID ' + currSubjectId
};
Plotly.relayout("bar", layoutBar);
Plotly.restyle("bar", "x", [values]);
Plotly.restyle("bar", "y", [labels]);
Plotly.restyle("bar", "hovertext", [hovertext]);
};

// Update Bubble Chart
let updBubbleChart = ( ) => {

let marker =  {
  size: allValues,
  color: all_otu_ids
}; 

Plotly.restyle("bubble", "x", [all_otu_ids]);
Plotly.restyle("bubble", "y", [allValues]);
Plotly.restyle("bubble", "hovertext", [bubbleHoverText]);
Plotly.restyle("bubble", "marker", [marker]);
};

// Update Demographic Info
let updDemoInfo = () => {
const tmpDemoInfo = metadata.find( obj => {
  return obj.id === parseInt(currSubjectId);
});
demoInfo = Object.entries( tmpDemoInfo ).map(  obj =>  obj[0] + ": " + obj[1] );      
var item = d3.select('#sample-metadata ul')
    .selectAll('li')
    .data(demoInfo);
// Enter
item
    .enter()
    .append('li')
    .attr('class', 'li')
    .text( d => d);
// Update
item
    .text( d => d );
// Exit
item.exit().remove();
};

// Create the charts
let init = () => {

// Plot Bar Chart
// ******************************  
var barTrace = {
  x: values,
  y: labels,
  hovertext: hovertext,
  orientation: 'h',
  marker: {
    color: 'rgba(0,200,191,0.6)',
    width: 0.2
  },
  type: 'bar'
};

var barData = [barTrace];
var barLayout = {
  title: 'Subject ID ' + currSubjectId
};

Plotly.newPlot('bar', barData, barLayout);

// Plot Bubble Chart 
// *************************  
var bubbleTrace = {
  x: all_otu_ids,
  y: allValues,
  hovertext: bubbleHoverText,
  mode: 'markers',
  marker: {
    size: allValues,
    color: all_otu_ids
  }
};

bubbleData = [bubbleTrace];

bubbleLayout = {
  xaxis: { title: "OTU ID"},
  yaxis: { title: "Samples" }
};

Plotly.newPlot('bubble', bubbleData, bubbleLayout);

updDemoInfo();

};


// Filter Data according with the subject Id selected.
let  filterData = ( ) => {

subjectIdData = samples.find( obj => obj.id === currSubjectId);

// the values for the bar chart
values        = subjectIdData.sample_values.slice();
values.sort(sortArrayDesc);
values = values.slice(0, 10).reverse();

// the labels for the bar chart 
otu_ids       = subjectIdData.otu_ids.slice(0,10);
otu_ids.reverse();
labels          = otu_ids.map( val => 'OTU ' + val );

// For the x values Bubble and the marker colors
all_otu_ids   = subjectIdData.otu_ids.slice();
all_otu_ids.reverse();

// For the y values Bubble and marker size 
allValues     = subjectIdData.sample_values.slice();
allValues.reverse();

// the hovertext for the chart
tmpHover      = subjectIdData.otu_labels.slice(0,10);
tmpHover.reverse();
hovertext     = tmpHover.map( text => text.replace(/;/g, " ") );

// Hover Text for Bubble chart (text values)
bubbleHoverText= subjectIdData.otu_labels.slice(); 
bubbleHoverText.reverse();

}