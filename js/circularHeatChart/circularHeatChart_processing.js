//processes the chart and interactions with it
//create list for data
data = [];

//load csv
d3.csv("data/finished2.csv", function(error, data) { 
	  
	//for each line of csv pull values
	data.forEach(function(d){
			
		//sets the specfic values in the data array
		d.block = d.time
		d.room = d.Room
		d.value = +d.Enrollment
		d.instructor = d.Instructor
		d.start = d.Str_Start
		d.end = d.Str_End
		d.class = d.Class
		d.day = d.Day
		console.log("m", d)		 
	});


	//execute circularHeatChart.js method
	var chart = circularHeatChart()
	//define chart shape
	.innerRadius(90)
    .segmentHeight(30)
    .numSegments(140)
	//use this if the chart text is cut off on the top or right side
	.margin({top: 20, right: 0, bottom: 20, left: 20}) 
	//colors for values on chart first is lowest value, second is highest value
    .range(['#ffffff', '#ff0000'])
	//use empty quotes if you want to only label some radials or segments
    .radialLabels(['NetLab','SysLab','Small Database Lab', 'Medium Database Lab', 'Large Database Lab', 'Mac Lab 1', 'Mac Lab 2'])
    .segmentLabels([
		"MONDAY",'','','','','','','','','','','','','','','','','','','','','','','','','','','',
		"TUESDAY",'','','','','','','','','','','','','','','','','','','','','','','','','','','',
		"WEDNESDAY",'','','','','','','','','','','','','', '','','','','','','','','','','','','','', 
		"THURSDAY",'','','','','','','','','','','','','', '','','','','','','','','','','','','','',
		"FRIDAY",'','','','','','','','','','','','','','','','','','','','','','','','','','']);
	chart.accessor(function(d) {return d.value;})
	
	
//retrieve the chart object and add svg to it	
d3.select('#chart4')
    .selectAll('svg')
    .data([data])
    .enter()
    .append('svg')
    .call(chart);

//draw intial map
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var imageObj = new Image();
imageObj.src = 'gol2.png';
imageObj.onload = function () {
	context.drawImage(imageObj, 0, 0, 1500, 1500 * imageObj.height / imageObj.width);
};

//create tooltip and set classes within it
var tooltip = d3.select('#chart4')
    .append('div')
    .attr('class', 'tooltip');
    tooltip.append('div')
    .attr('class', 'day');
	tooltip.append('div')
    .attr('class', 'time');
    tooltip.append('div')
    .attr('class', 'value');
    tooltip.append('div')
    .attr('class', 'room');
	
/* events */
//when mouse moves
d3.selectAll("#chart4 path")
	//over data
	.on('mouseover', function() {
		//get that data
		var d = d3.select(this).data()[0];
		//if it has a non-zero value print this text
		if (d.value != 0) {
			d3.select("#info").text('On ' + d.day + ' at ' + d.block + ' in GOL-' + d.room + ', ' + d.instructor + ' has ' + d.class 
			+ ' from ' + d.start + ' to ' + d.end + ' with ' + d.value + ' students' );
		//otherwise print this
		} else {
			d3.select("#info").text('On ' + d.day + ' at ' + d.block + ', GOL-' + d.room + ' is empty' );
		}
		//put the data into the tooltip and create the <b>'s to hold the text
		tooltip.select('.day').html("<b> Day: " + d.day + "</b>");
		tooltip.select('.time').html("<b> Time: " + d.time + "</b>");
		tooltip.select('.room').html("<b> Room: GOL-" + d.room + "</b>");
		tooltip.select('.value').html("<b> Enrollment: " + d.value + "</b>");
		tooltip.style('display', 'block');
		tooltip.style('opacity',0.8);
		

		//set color and alpha of square around room
		var c = "rgba(255, 0, 0, " + (d.value / 40) + ")" 
		
		//make canvas empty
		context.clearRect(0, 0, canvas.width, canvas.height)
		
		//set context attributes
		context.fillStyle = c;
		context.strokeStyle = "#00ff55";
		context.lineWidth = '6';
		
		//redraw map
		context.drawImage(imageObj, 0, 0, 1500, 1500 * imageObj.height / imageObj.width);
		
		//draw room border on map, needs to redraw the entire canvas to do this
		if (d.room == 2160) {
			//rooom 2160
			context.fillRect(535, 48, 58, 84);
			context.beginPath();
			context.rect(535, 48, 58, 84);
			context.stroke();
		} else if (d.room == 2320) {
			//room 2320
			context.fillRect(481, 48, 52, 102);
			context.beginPath();
			context.rect(481, 48, 52, 102);
			context.stroke();
		} else if (d.room == 2520) {
			//room2520
			context.fillRect(322, 362, 48, 53);
			context.beginPath();
			context.rect(322, 362, 48, 53);
			context.stroke();
		} else if (d.room == 2620) {
			//room2620
			context.fillRect(322, 417, 68, 53);
			context.beginPath();
			context.rect(322, 417, 68, 53);
			context.stroke();
		} else if (d.room == 2650) {
			//room 2650
			context.fillRect(196, 417, 96, 50);
			context.beginPath();
			context.rect(196, 417, 96, 50);
			context.stroke();
		} else if (d.room == 3510) {
			//room3510
			context.fillRect(1070, 365, 42, 60);
			context.beginPath();
			context.rect(1070, 365, 42, 60);
			context.stroke();
		} else if (d.room == 3690) {
			//room3690
			context.fillRect(764, 417, 60, 55);
			context.beginPath();
			context.rect(764, 417, 60, 55);
			context.stroke();
		} 
	})
	//when mouse moves on chart
	.on('mousemove', function(d) {
		tooltip.style('top', (d3.event.pageY + 10) + 'px')
        .style('left', (d3.event.pageX - 25) + 'px');
    })
	//when mouse moves off chart
    .on('mouseout', function(d) {
		//redraw map
		context.drawImage(imageObj, 0, 0, 1500, 1500 * imageObj.height / imageObj.width);
        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
		d3.select("#info").text('');	
    });

//nothing happens here right now, could add features
d3.selectAll("#chart4 path").on('click', function() {
    var d = d3.select(this).data()[0];
	
});

}); //they stay open until the very end of the file. That means that all those blocks that occur after the d3.tsv bit are referenced to the 'data' array