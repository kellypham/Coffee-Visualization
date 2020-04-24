var chart;
var height = 200
var width = 300
const colorScale =  d3.scaleOrdinal(d3.schemeCategory10)
//DEFINE YOUR VARIABLES UP HERE

//Gets called when the page is loaded.
function init(){
  chart = d3.select('#vis').append('svg')
  vis = chart.append('svg:g')
  //PUT YOUR INIT CODE BELOW
}

//Called when the update button is clicked
function updateClicked(){
  d3.csv('data/CoffeeData.csv').then(update);
}

//Callback for when data is loaded
function update(rawdata){
  //PUT YOUR UPDATE CODE BELOW
  var x_choice = getXSelectedOption();
  var y_choice = getYSelectedOption();

  // Generate the 4 sets of summation stats
  var entries = d3.nest()
      .key(function(d){
        if (x_choice == "region") return d.region;
        else {return d.category;}
      })
      .rollup(function(d){
        return d3.sum(d,function(d){
          if (y_choice == "sales") return d.sales;
          else {return d.profit;}})})
      .entries(rawdata)


  const margin = 50;
  const w = 800;
  const h = 300;
  const width = 600 - 2 * margin;
  const height = 300 - 2 * margin;

  // define the scale
  var x = d3.scaleBand().range([0, width])
            .domain(entries.map((d)=> d.key))
            .range([10,450])
            .padding(0.05);

  var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0,d3.max(entries, function(d){ return d.value;})]);


  d3.selectAll("svg").remove();
  const svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h)

  // define the axis
  var xAxis = d3.axisBottom(x).tickSize(0);
  var yAxis = d3.axisRight(y).ticks(5);

  const chart = svg.append("g")
                  .attr("transform", "translate(80,0)");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(80," + height +")")
      .call(xAxis)
      .call(g => g.select(".domain").remove());

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", 'translate(530,0)')
      .call(yAxis);


  const bars = chart.selectAll("rect")
      .data(entries)
      .enter().append("rect")
      .attr("fill", function(d){ return colorScale(d.key);})
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) {return 20;})
      .attr("width", x.bandwidth());

  bars.transition()
        .duration(800)
        .ease(d3.easeCubic)
        .delay((entries, i) => i * 50)
        .attr("height", (d) => height - y(d.value))
        .attr("y", (d) => y(d.value))

}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
  var node = d3.select('#xdropdown').node()
  var i = node.selectedIndex
  return node[i].value
}

// Returns the selected option in the X-axis dropdown.
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node()
  var i = node.selectedIndex
  return node[i].value
}
