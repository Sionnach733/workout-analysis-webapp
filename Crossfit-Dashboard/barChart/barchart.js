class BarChart {

    constructor(data){
        this.renderBarChart(data);
    }

     renderBarChart(data){

        // set the dimensions and margins of the graph
        let margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // set the ranges
        let x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
        let y = d3.scaleLinear()
            .range([height, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        let svg = d3.select("#mytoptrends").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        let format = d3.format(",d");

        // format the data
        data.forEach(function(d) {
            d.myAmt = +d.myAmt;
            d.mainsiteAmt = +d.mainsiteAmt;
        });

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.movement; }));
        y.domain([0, d3.max(data, function(d) { return d.myAmt>d.mainsiteAmt?d.myAmt:d.mainsiteAmt; })]);

        // append the rectangles for the bar chart
        let bar = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g");

        bar.append("rect")
            .attr("class", "bar1")
            .attr("x", function(d) { return x(d.movement); })
            .attr("width", x.bandwidth()/2)
            .attr("y", function(d) { return y(d.myAmt); })
            .attr("height", function(d) { return height - y(d.myAmt); });

        bar.append("rect")
            .attr("class", "bar2")
            .attr("x", function(d) { return x(d.movement) + x.bandwidth()/2; })
            .attr("width", x.bandwidth()/2)
            .attr("y", function(d) { return y(d.mainsiteAmt); })
            .attr("height", function(d) { return height - y(d.mainsiteAmt); });

        bar.append("title")
            .text(function(data) { return "My Workouts: " + format(data.myAmt) + "\nMainsite: " + format(data.mainsiteAmt); });

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
    }
}