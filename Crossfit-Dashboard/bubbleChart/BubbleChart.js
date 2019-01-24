import {toPercentageRange, calculateValueForHeatmap} from '../utils/utils.js';

export class BubbleChart{

    constructor(data){
        this.renderBubbleChart(data);
    }

    renderBubbleChart(data){
        let svg = d3.select("#myChart"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        let format = d3.format(",d");
        let percentFormat = d3.format(".0%");

        let color = d3.schemeRdYlGn[6];

        let pack = d3.pack()
            .size([width, height])
            .padding(1.5);

        let root = d3.hierarchy({children: data})
            .sum((data) => data.value)
            .each((data) => {
                if (data.data.id) {
                    data.id = data.data.id;
                    data.percentage = data.data.percentage;
                    data.ratio = data.data.ratio;
                }
            });

        let node = svg.selectAll(".node")
            .data(pack(root).leaves())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", (data) => "translate(" + data.x + "," + data.y + ")");

        node.append("circle")
            .attr("id", (data) =>  data.id)
            .attr("r", (data) => data.r)
            .style("fill", (data) => color[toPercentageRange(calculateValueForHeatmap(data.percentage))]);

        node.append("clipPath")
            .attr("id", (data) => "clip-" + data.id)
            .append("use")
            .attr("xlink:href", (data) => "#" + data.id);

        node.append("text")
            .attr("clip-path", (data) => "url(#clip-" + data.id + ")")
            .selectAll("tspan")
            .data((data) => data.id.split(/(?=[A-Z][^A-Z])/g))
            .enter().append("tspan")
            .attr("x", 0)
            .attr("y", 0)
            .text((data) => data);

        node.append("title")
            .text((data) => data.id + "\nTimes: " + format(data.value) + "\n" + percentFormat(data.ratio));
    }

}