const tooltip = document.getElementById('tooltip');

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(res => res.json())
    .then(res => {
        createGraph(res.map( r => [new Date(1970, 0, 1, 0, r.Time.split(':')[0], r.Time.split(':')[1]), r.Year]));
    })

function createGraph(data) {
    console.log(data);
    var width = $(window).width() - 480,
        height = $(window).height() - 280,
        xPadding = 60,
        yPadding = 40,
        xyrPadding = 40,
        barWidth = (width) / (data.length);



    var xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[1] - 1), d3.max(data, d => d[1] + 1)])
        .range([xPadding, width + xPadding]);

    var timeFormat = d3.timeFormat("%M:%S");

    var yScale = d3.scaleTime()
        .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])])
        .range([yPadding, height + yPadding]);



    var svg = d3.select('body').append('svg')
        .attr('width', width + xPadding + xyrPadding)
        .attr('height', height + yPadding + xyrPadding);

    svg.selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', d => d[1])
        .attr('data-yvalue',d => d[0])
        .attr('r', 6)
        .attr('cx', d => xScale(d[1]) )
        .attr('cy', d => yScale(d[0]) + yPadding - xyrPadding)
        .on('mousemove',  (d, item) => {
            // console.log(d, item)
            let yearLine = "";
            // switch(item[0].substring(5, 7)) {
            //     case '01':
            //         yearLine = item[0].substring(0, 4) + ' Q1';
            //         break;
            //     case '04':
            //         yearLine = item[0].substring(0, 4) + ' Q2';
            //         break;
            //     case '07':
            //         yearLine = item[0].substring(0, 4) + ' Q3';
            //         break;
            //     case '10':
            //         yearLine = item[0].substring(0, 4) + ' Q4';
            //         break;
            //     default:
            //         yearLine = 'hahahah';
            //       // code block
            //   };

            let gdpLine = "$ " + item[1].toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' Billion'

            tooltip.style.left = d.pageX + xyrPadding + 'px';
            tooltip.style.top = d.pageY - xyrPadding + 'px';
            tooltip.innerHTML = yearLine + "<br/>" + gdpLine;
            tooltip.setAttribute("data-year", item[1]);
        })
        .on('mouseover', () => tooltip.style.visibility = "visible")
        .on('mouseout', () => tooltip.style.visibility = "hidden")



    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    var xAxisGroup = svg.append('g')
        .attr('transform', `translate(0, ${height + xyrPadding})`)
        .attr('id', 'x-axis')
        .call(xAxis);

    var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    var yAxisGroup = svg.append('g')
        .attr('transform', `translate(${xPadding}, -${yPadding-xyrPadding})`)
        .attr('id', 'y-axis')
        .call(yAxis);
}
