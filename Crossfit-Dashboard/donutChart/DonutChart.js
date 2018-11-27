class DonutChart{

    constructor(data){
        this.renderDonutChart(data);
    }

    renderDonutChart(data){
        let canvas = document.querySelector("canvas"),
            context = canvas.getContext("2d");

        let width = canvas.width,
            height = canvas.height,
            radius = Math.min(width, height) / 2;

        let colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];

        let arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 70)
            .context(context);

        let labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40)
            .context(context);

        let pie = d3.pie()
            .sort(null)
            .value((d) => d.average);

        context.translate(width / 2, height / 2);


        let arcs = pie(data);

        arcs.forEach((d, i) => {
            context.beginPath();
            arc(d);
            context.fillStyle = colors[i];
            context.fill();
        });

        context.beginPath();
        arcs.forEach(arc);
        context.strokeStyle = "#fff";
        context.stroke();

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#000";
        arcs.forEach((d) => {
            let c = labelArc.centroid(d);
            context.fillText(d.data.source, c[0], c[1]);
        });
    }

}