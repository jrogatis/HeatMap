// JavaScript Document
/*jshint esversion: 6 */

const { 
	json,
	select,
	max, 
	min,
	scaleLinear,
	axisLeft, 
	axisBottom,
	range,
	tickStep,
	scaleOrdinal,
	format	
} = d3;

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const margin = { top: 120, right: 20, bottom: 100, left:90 };

const height = 680 - margin.top - margin.bottom,
  width = 1200 - margin.left - margin.right;

json(url, (error, json) =>{
	
	if (error) return console.warn(error);	
	const myData = json.monthlyVariance;
	const month = [];
		month[1] = "January";
		month[2] = "February";
		month[3] = "March";
		month[4] = "April";
		month[5] = "May";
		month[6] = "June";
		month[7] = "July";
		month[8] = "August";
		month[9] = "September";
		month[10] = "October";
		month[11] = "November";
		month[12] = "December";
	

	const maxYear = max(myData, (d)=>d.year); 
	const minYear = min(myData, (d)=>d.year); 
	const quantYear = range(minYear,maxYear,1).length;
	
	
	const colorsDefs = {
					 	lightgray      : '#819090',
						gray           : '#708284',
						mediumgray     : '#536870',
						darkgray       : '#475B62',						
						paleryellow    : '#FCF4DC',
						paleyellow     : '#EAE3CB',
						yellow         : '#A57706',				
						red            : '#D11C24',
						pink           : '#C61C6F',
						blue           : '#2176C7',					
						green          : '#738A05'
							  };
	

	  const colors = scaleLinear()
    		.domain([0,2.7, 3.9,5,6.1,8.3,9.4,10.5,11.6,12.7])
    		.range([colorsDefs.darkgray,
					colorsDefs.mediumgray,
					colorsDefs.gray,
					colorsDefs.lightgray,
					colorsDefs.paleryellow,
					colorsDefs.paleyellow,
					colorsDefs.yellow,
					colorsDefs.green,
					colorsDefs.pink,
					colorsDefs.red
				   ]);
	
	
	const yScale = scaleOrdinal()
            .domain(["January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
					"August",
					"September",
					"October",
					"November",
					"December"])
            .range([0,
					(height/12),
					2*(height/12),
					3*(height/12),
					4*(height/12),
					5*(height/12),
					6*(height/12),
					7*(height/12),
					8*(height/12),
				   9*(height/12),
				   10*(height/12),
				   11*(height/12)]);

	const xScale = scaleLinear()
			.domain([minYear,maxYear])
			.range([0,width]);
	
	const tooltip = select('body').append('div')
            .style('position', 'absolute')
            .style('padding', '0 10px')
            .style('background', 'black')
		    .style('color', 'white')
            .style('opacity', 0);
	
	const toolText = (d)  =>{
			const text = `<div id= toolTip>   
			   	<p><strong> ${d.year} - ${month[d.month]}  </strong>   
				<br> ${format(".4")(json.baseTemperature + d.variance)} &#8451 </p>
			    <p> ${format(".4")(d.variance)} &#8451 </<p>
			  	</div>`;
			
		return text;		
		
	};
	
	
	const chart = select('#chart')
		.attr('width', width + margin.left + margin.right);	

	chart
		.append('svg')
			.style('background', 'white')
			.style('opacity', 0.7)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
				.attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
				.selectAll('rect').data(myData, (d) => d)
				.enter().append('rect')
					.attr('id', (d,i)=> `item-${i}`)
					.style('fill', (d) => colors(json.baseTemperature + d.variance))
					.attr('width',(width/quantYear))
					.attr('height', (height/12))	   
					.attr('x', (d) => xScale(d.year))
					.attr('y', (d) => yScale(month[d.month]))
	
			.on('mouseover', (d,i)=> {
								
								select(`#item-${i}`)
									.style('cursor', 'pointer');
								tooltip.transition()
									.style('opacity', 0.6);

								tooltip.html(toolText(d))
									.style('left', (d3.event.pageX - 100) + 'px')
									.style('top',  (d3.event.pageY - 100) + 'px');
								})
			.on('mouseout', (d,i)=>{ 
								tooltip.style('opacity', 0);
			   					select(`#item-${i}`)
									.style('cursor', 'default');
			   
								 });
	
	const svg = chart.select('svg');
	
	svg.append('text')
			.style('font-size', '30px')
			.style('font-weight', 600)
			.attr('text-anchor', "middle")
			.attr('x', (width + margin.left)/2)
			.attr('y',30)
			.text("Monthly Global Land-Surface Temperature");		

	svg.append('text')
			.style('font-size', '24px')	
			.style('font-weight', 400)
			.attr('text-anchor', "middle")
			.attr('x', (width + margin.left)/2)
			.attr('y',60)
			.text("1753 - 2015");

	svg.append('text')
			.style('font-size', '16px')
			.attr('text-anchor', "middle")
			.attr('x', (width + margin.left)/2)
			.attr('y',75)
			.text('Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.');
	
	svg.append('text')
			.style('font-size', '16px')
			.attr('text-anchor', "middle")
			.attr('x', (width + margin.left)/2)
			.attr('y',95)
			.text('Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07');
	
	svg.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y",10)
		  .attr("x",0 - ((height / 2) + margin.top ))
		  .attr("dy", "1em")
		  .style("text-anchor", "middle")
		  .style('font-weight', 600)
		  .style('font-size', '20px')
		  .text("Months");  
	
	svg.append('text')
			.style('font-size', '20px')
			.attr('text-anchor', "middle")
			.attr('x', (width + margin.left)/2)
			.attr('y', height + margin.top + 40)
			.style('font-weight', 600)
			.text('Years');
	
	
	
	const hAxis = axisBottom(xScale)
        .ticks(tickStep(minYear, maxYear, 10));
		
    const hGuide = select('svg').append('g');
	
	hAxis(hGuide);

	hGuide.attr('transform', 
				`translate( ${ margin.left } , ${height+ margin.top })`)
		.style('font-size', '12px' )
		.style('font-weight', 400);
			
	const vAxis = axisLeft(yScale);
					
    const vGuide = select('svg').append('g');
	
    vAxis(vGuide);
			
    vGuide.attr('transform', 
				`translate( ${ margin.left } , ${ margin.top + (height/24) } )`)
		.style('font-size', '14px' )
		.style('font-weight', 400);
	
    vGuide.selectAll('path').remove();
    vGuide.selectAll('line').remove();
	
	
	svg.append('g')
				.attr('transform', 
					  `translate(${margin.left + width - (colors.range().length * 20) - 110 },${height + margin.top + 30})`)
				.selectAll('rect').data(colors.range(), (d)=> d )
				.enter().append('rect')
					.style('fill', (d) => d)
					.attr('width',30)
					.attr('height',20)	   
					.attr('x', (d, i) => i* 30)
					.attr('y',  0);
					
	
	svg.append('g')
				.attr('transform', 
					  `translate(${margin.left + width - (colors.range().length * 20) - 95 },${height + margin.top + 65})`)
				.selectAll('rect').data(colors.domain(), (d)=> d )
				.enter().append('text')	   
					.attr('x', (d, i) => i* 30)
					.attr('y',  0)
					.attr('text-anchor', "middle")
					.style('font-size', '12px' )
					.style('font-weight', 400)
					.text((d)=>d);
				
	
});