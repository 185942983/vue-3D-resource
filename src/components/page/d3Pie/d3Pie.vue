<template>
 	<div class="pie-container">
 		<!-- <svg>
			<defs>
	 			<filter id='GaussianBlur'>
	 				<feGaussianBlur in='SourceGraphic' stdDeviation='2'></feGaussianBlur>
	 			</filter>
	 		</defs> 				
 		</svg> -->
 		<el-row :gutter="20">
		  <el-col :span="8">
		  	<div class="container">
		  		<h3>2014年各大智能手机厂商在中国出货量</h3>
		  		<small>(单位：百万台)</small>
		  		<div id="basicPie" class="chart"></div>
		  	</div>
		  </el-col>
		  <el-col :span="8">
		  	<div class="container">
					<h3>2014年各大智能手机厂商在中国出货量</h3>
		  		<small>(单位：百万台)</small>
		  		<div id="ringPie" class="chart"></div>		  		
		  	</div>
		  </el-col>
		  <el-col :span="8">
		  	<div class="container">
					<h3>2014年各大智能手机厂商在中国出货量</h3>
		  		<small>(单位：百万台)</small>
		  		<div id="normalPie" class="chart"></div>		  		
		  	</div>
		  </el-col>
		</el-row>
 	</div>
</template>

<script>
	import * as d3 from 'd3'

	export default {
	  name: 'd3Pie',
	  data() {
	  	return {
	  		basicPieData: [
	  			['小米', 60.8], ['三星', 58.4], ['联想', 47.3], ['苹果', 46.6], ['华为', 41.3], ['酷派', 40.1], ['其他', 111.5]
	  		],
	  		// color: []
	  	}
	  },
	  methods: {
	  	initBasicPie() {
	  		const svg = d3.select('#basicPie')
	  									.append('svg')
	  									.attr('width', '100%')
	  									.attr('height', '100%')
	  		const width = $('#basicPie').width()
	  		const height = $('#basicPie').height()
	  		const pie = d3.pie()
	  									.value(d => d[1]);
	  		const piedata = pie(this.basicPieData)
	  		// console.log(piedata)
	  		//外半径和内半径 这里取svg画布的宽、高的最小值的一半，减去40，表示两边留有余地；
	  		const outerRadius = Math.min(width, height) * 0.5 - 40
	  		const innerRadius = 0
	  		//创建弧生成器
	  		const arc = d3.arc()
	  									.innerRadius(innerRadius)
	  									.outerRadius(outerRadius)
	  		//添加对应数目的弧组
	  		const arcs = svg.selectAll('g')
	  									.data(piedata)
	  									.enter()
	  									.append('g')
	  									.attr('transform', 'translate('+ (width/2) + ',' + (height/2) + ')')
	  		//添加弧的路径元素
	  		arcs.append('path')
	  				.attr('fill', (d,i)=> this.color(i) ) //设定弧的颜色
	  				.attr('d', d=> arc(d) ) //使用弧生成器获取路径
	  		//添加弧内的文字元素
	  		arcs.append('text')
	  				.attr('transform', d => {
	  						let x = arc.centroid(d)[0] * 1.4
	  						let y = arc.centroid(d)[1] * 1.4
	  						return 'translate('+ x +',' + y +')'
	  				})
	  				.attr('text-anchor', 'middle')
	  				.attr('font-size', '12px')	
	  				.text(d => {
	  					let percent = Number(d.value) / d3.sum(this.basicPieData, _d => _d[1]) * 100
	  					return percent.toFixed(1) + '%'
	  				})
	  		//添加链接弧外文字的直线元素
	  		arcs.append('line')
	  				.attr('stroke', 'black')
	  				.attr('x1', d => { return arc.centroid(d)[0] * 2 })
	  				.attr('y1', d => { return arc.centroid(d)[1] * 2 })
	  				.attr('x2', d => { return arc.centroid(d)[0] * 2.2 })
	  				.attr('y2', d => { return arc.centroid(d)[1] * 2.2 })
	  		//添加弧外的文字元素
	  		arcs.append('text')
						.attr('transform', d => {
	  						let x = arc.centroid(d)[0] * 2.5
	  						let y = arc.centroid(d)[1] * 2.5
	  						return 'translate('+ x +',' + y +')'
	  				})
	  				.attr('text-anchor', 'middle')
	  				.attr('font-size', '12px')	
	  				.text(d => d.data[0])	
	  	},
	  	initRingPie() {
				const svg = d3.select('#ringPie')
	  									.append('svg')
	  									.attr('width', '100%')
	  									.attr('height', '100%')
	  		const width = $('#basicPie').width()
	  		const height = $('#basicPie').height()
	  		const pie = d3.pie()
	  									.value(d => d[1]);
	  		const piedata = pie(this.basicPieData)
	  		// console.log(piedata)
	  		//外半径和内半径
	  		const outerRadius = Math.min(width, height) * 0.5 - 40
	  		const innerRadius = width/5
	  		//创建弧生成器
	  		const arc = d3.arc()
	  									.innerRadius(innerRadius)
	  									.outerRadius(outerRadius)
	  		//添加对应数目的弧组
	  		const arcs = svg.selectAll('g')
	  									.data(piedata)
	  									.enter()
	  									.append('g')
	  									.attr('transform', 'translate('+ (width/2) + ',' + (height/2) + ')')  									
	  		//添加弧的路径元素 
	  		arcs.append('path')
	  				.attr('fill', (d,i)=> this.color(i) ) //设定弧的颜色
	  				.attr('d', d=> arc(d) ) //使用弧生成器获取路径
						.on('mouseover', function(d,i){
							d3.select(this)
								.transition()  //开启过渡
								.duration(500) //过渡时间
								.attr('transform','scale(1.1)')
						})
						.on('mouseout', function(d,i){
							d3.select(this)
								.transition()  //开启过渡
								.duration(500) //过渡时间
								.attr('transform','scale(1)')
						})							
	  		//添加弧内的文字元素
	  		arcs.append('text')
	  				.attr('transform', d => {
	  						let x = arc.centroid(d)[0] * 1
	  						let y = arc.centroid(d)[1] * 1
	  						return 'translate('+ x +',' + y +')'
	  				})
	  				.attr('text-anchor', 'middle')
	  				.attr('font-size', '12px')	
	  				.text(d => {
	  					let percent = Number(d.value) / d3.sum(this.basicPieData, _d => _d[1]) * 100
	  					return percent.toFixed(1) + '%'
	  				})
	  		//添加链接弧外文字的直线元素
	  		arcs.append('line')
	  				.attr('stroke', 'black')
	  				.attr('x1', d => { return arc.centroid(d)[0] * 1.25 })
	  				.attr('y1', d => { return arc.centroid(d)[1] * 1.25 })
	  				.attr('x2', d => { return arc.centroid(d)[0] * 1.4 })
	  				.attr('y2', d => { return arc.centroid(d)[1] * 1.4 })
	  		//添加弧外的文字元素
	  		arcs.append('text')
						.attr('transform', d => {
	  						let x = arc.centroid(d)[0] * 1.5
	  						let y = arc.centroid(d)[1] * 1.5
	  						return 'translate('+ x +',' + y +')'
	  				})
	  				.attr('text-anchor', 'middle')
	  				.attr('font-size', '12px')	
	  				.text(d => d.data[0])		  		
	  	},
	  	initNormalPie() {
	  		const tooltip = d3.select('body')
	  											.append('div')
	  											.attr('class', 'tooltip')
	  											.style('position','absolute')
	  											.style('width','120px')
	  											.style('height','auto')
	  											.style('font-size','14px')
	  											.style('text-align','center')
	  											.style('color','#fff')
	  											// .style('border','1px solid #000')
	  											.style('background','rgba(0,0,0,0.4)')
	  											.style('border-radius','5px')
				const svg = d3.select('#normalPie')
	  									.append('svg')
	  									.attr('width', '100%')
	  									.attr('height', '100%')
	  		const width = $('#basicPie').width()
	  		const height = $('#basicPie').height()
	  		const pie = d3.pie()
	  									.value(d => d[1]);
	  		const piedata = pie(this.basicPieData)
	  		// console.log(piedata)
	  		//外半径和内半径
	  		const outerRadius = Math.min(width, height) * 0.5 - 40
	  		const innerRadius = 0
	  		//创建弧生成器
	  		const arc = d3.arc()
	  									.innerRadius(innerRadius)
	  									.outerRadius(outerRadius)
	  		//添加对应数目的弧组
	  		const arcs = svg.selectAll('g')
	  									.data(piedata)
	  									.enter()
	  									.append('g')
	  									.attr('transform', 'translate('+ (width/2) + ',' + (height/2) + ')')
	  									.on('mouseover', d=>{//鼠标移入
	  										tooltip.html(d.data[0] + '的出货量为' + '<br />' + d.data[1] + ' 百万台')
	  													 .style('left', d3.event.pageX +'px')
	  													 .style('top', d3.event.pageY + 20 +'px')
	  													 .style('opacity', 1)
	  									})
	  									.on('mousemove', d=>{//鼠标移动
												tooltip.style('left', d3.event.pageX +'px')
	  													 .style('top', d3.event.pageY + 20 +'px')
	  									})
	  									.on('mouseout', d=>{//鼠标移出
												tooltip.style('opacity', 0)
											})
	  		//添加链接弧外文字的直线元素
	  		arcs.append('polyline')
	  				.attr('stroke', 'black')
	  				.attr('fill', 'transparent')
	  				.attr('points', d => { 
	  						return arc.centroid(d)[0] * 2 + ',' + arc.centroid(d)[1] * 2 + " " +
	  									 arc.centroid(d)[0] * 2.2 + ',' + arc.centroid(d)[1] * 2.2 +  " " + 
	  									arc.centroid(d)[0] * 3  + ',' + arc.centroid(d)[1] * 2.2
	  				})
	  		//添加弧外的文字元素
	  		arcs.append('text')
						.attr('transform', d => {
	  						let x = arc.centroid(d)[0] * 2.5
	  						let y = arc.centroid(d)[1] * 2.5
	  						return 'translate('+ x +',' + y +')'
	  				})
	  				.attr('text-anchor', 'middle')
	  				.attr('font-size', '12px')	
	  				.text(d => d.data[0])		 
	  		//添加弧的路径元素
	  		arcs.append('path')
	  				.attr('fill', (d,i)=> this.color(i) ) //设定弧的颜色
	  				.attr('d', d=> arc(d) ) //使用弧生成器获取路径 	
	  				// .attr('filter', 'url(#GaussianBlur)')//使用滤镜
						.on('mouseover', function(d,i){
							d3.select(this)
								.attr('transform','scale(1.1)')
						})
						.on('mouseout', function(d,i){
							d3.select(this)
								.attr('transform','scale(1)')
						})
				//添加弧内的文字元素
	  		arcs.append('text')
	  				.attr('transform', d => {
	  						let x = arc.centroid(d)[0] * 1.4
	  						let y = arc.centroid(d)[1] * 1.4
	  						return 'translate('+ x +',' + y +')'
	  				})
	  				.attr('text-anchor', 'middle')
	  				.attr('font-size', '12px')	
	  				.text(d => {
	  					let percent = Number(d.value) / d3.sum(this.basicPieData, _d => _d[1]) * 100
	  					return percent.toFixed(1) + '%'
	  				})								  					
	  	},
	  	color(i) {
	  		const rgbs = ['#e83f68','#e88f3f','#35b4ff','#464cde','#ebc250','#52f3e3','#9380f4','#fffb0d','#f0786a','#d9308b']
	  		return rgbs[i]
	  	}
	  },
	  created() {
	  	// this.color = d3.scaleOrdinal(d3.schemeCategory20c)
	  },
	  mounted() {
	  	this.initBasicPie() 
	  	this.initRingPie() 
	  	this.initNormalPie()
	  }
	}
</script>

<style lang="less" scoped>
	.pie-container{
    h3{
    	font-size: 1rem;
    	font-weight: normal;
    	text-align: center;
    }
    small{
    	display: block;
    	text-align: center;
    }
    .chart{
    	height: 300px;
    }
	}
</style>
