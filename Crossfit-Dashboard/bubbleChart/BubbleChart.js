class BubbleChart{

    constructor(data){
        this.renderBubbleChart(data);
    }

    renderBubbleChart(data){
        let svg = d3.select("#myChart"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        let format = d3.format(",d");

        let color = d3.scaleOrdinal(d3.schemeRdYlGn[6]);

        let pack = d3.pack()
            .size([width, height])
            .padding(1.5);

        let root = d3.hierarchy({children: data})
            .sum(function(data) { return data.value; })
            .each(function(data) {
                if (data.data.id) {
                    data.id = data.data.id;
                }
            });

        let node = svg.selectAll(".node")
            .data(pack(root).leaves())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(data) { return "translate(" + data.x + "," + data.y + ")"; });

        node.append("circle")
            .attr("id", function(data) { return data.id; })
            .attr("r", function(data) { return data.r; })
            .style("fill", function(data) { return color(data.id); });

        node.append("clipPath")
            .attr("id", function(data) { return "clip-" + data.id; })
            .append("use")
            .attr("xlink:href", function(data) { return "#" + data.id; });

        node.append("text")
            .attr("clip-path", function(data) { return "url(#clip-" + data.id + ")"; })
            .selectAll("tspan")
            .data(function(data) { return data.id.split(/(?=[A-Z][^A-Z])/g); })
            .enter().append("tspan")
            .attr("x", 0)
            .attr("y", 0)
            .text(function(data) { return data; });

        node.append("title")
            .text(function(data) { return data.id + "\n" + format(data.value); });
    }

}