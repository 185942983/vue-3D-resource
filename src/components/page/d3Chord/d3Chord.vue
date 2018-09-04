<template>
 	<div class="chart-container">
 		<el-row :gutter="20">
		  <el-col :span="8">
		  	<div class="container">
		  		<h3>五大洲的人口组成</h3>
		  		<div id="chord" class="chart"></div>
		  	</div>
		  </el-col>
		  <el-col :span="16">
		  	<div class="container">
					<h3>中国-省份-城市</h3>
		  		<div id="tree" class="chart"></div>		  		
		  	</div>
		  </el-col>
		</el-row>
 	</div>
</template>

<script>
	import * as d3 from 'd3'

	export default {
	  name: 'd3Chord',
	  data() {
	  	return {
	  		continent: ['亚洲','欧洲','非洲','美洲','大洋洲'],
	  		population: [
	  			[9000, 870, 3000, 1000, 5200],
	  			[3400, 8000, 2300, 4922, 374],
	  			[2000, 2000, 7700, 4881, 1050],
	  			[3000, 8012, 5531, 500, 400],
	  			[3540, 4310, 1500, 1900, 300]
	  		],
	  		width: 0,
	  		height: 0
	  	}
	  },
	  methods: {
	  	initChord() {
	  		const svg = d3.select('#chord')
	  									.append('svg')
	  									.attr('width', '100%')
	  									.attr('height', '100%')
	  		const width = $('#chord').width()
	  		const height = $('#chord').height()
	  		const innerRadius = width/2 * 0.6
	  		const outerRadius = innerRadius * 1.1
	  		const chord = d3.chord()  //创建弦布局
	  									.padAngle(0.03) //各节点直接间隔
	  									.sortSubgroups(d3.ascending) //各节点所在行的数据排序 升序
	  		//定义一个弧线的布局函数
	  		const arc = d3.arc()
											.innerRadius(innerRadius)
	  									.outerRadius(outerRadius)	  
	  		//定义一个弦布局函数
	  		const ribbon = d3.ribbon()
	  										 .radius(innerRadius)
	  		//定义一个颜色函数 返回离散的颜色值
	  		const color = d3.scaleOrdinal()
	  										.domain(d3.range(5))
	  										.range(['#e83f68','#e88f3f','#35b4ff','#d9308b','#464cde'])		
	  		//定义一个组元素，包含节点和弦
	  		const gChord = svg.append('g')
	  								 .attr('transform', 'translate(' + width/2 + ',' + height/2 +')')
	  								 // chord(matrix)函数用来将matrix数组转换为chord diagram 所需的数据格式，通过datum将转换后用于显示弦图的数据绑定到 g元素上
	  								 .datum(chord(this.population))
	  		// 定义一组g元素，用来绑定弦图的 groups数据，即弧线
	  		const gGroups = gChord.append('g')
	  													.attr('class', 'groups')
	  													.selectAll('g')
	  													.data(chords => chords.groups)
	  													.enter()
	  													.append('g')
									  					.each( (d,i) => {
								  					 		d.angle = (d.startAngle + d.endAngle) / 2
								  					 		d.name = this.continent[i]
									  					})
	  		// group元素是用来放置弦图的“弧”的
	  		gGroups.append('path')
	  					 .style('fill', d => color(d.index))
	  					 .style('stroke', d => d3.rgb(color(d.index)).darker())
	  					 // 绑定arc布局到group的d属性上，用来画弧
	  					 .attr('d', arc)
	  		//节点添加文字
	  		gGroups.append('text')
	  					 .attr('class', 'group-text')
	  					 .attr('dy', '.35em')
	  					 .attr('transform', d => {
	  					 		let result  = 'rotate('+ (d.angle * 180 / Math.PI) +') '
	  					 		//平移到外半径之外
	  					 		result += 'translate(0,'+ -1 * (outerRadius + 10) +') ' 
	  					 		if( d.angle > Math.PI*3/4 && d.angle <Math.PI *5/4){
	  					 			result += "rotate(180)"
	  					 		}
	  					 		return result
	  					 })
	  					 .text(d => d.name)

	  		/*// 定义每段弧上的刻度 元素
	  		const groupTick = gGroups.selectAll('.group-tick')
	  															//为每段弧的刻度元素绑定数据，数据为当前弧上的刻度的角度数组
	  														 .data( d => this.groupTicks(d, 1e3))
	  														 .enter()
	  														 .append('g')
	  														 .attr('class', 'group-tick')
	  														  // 根据角度以及外半径定位刻度位置（这里的刻度指的是弦图上外围的小短刻度线）
	  														 .attr('transform', d => { return 'rotate('+ (d.angle*180/Math.PI -90) +') translate('+outerRadius+',0)'})
	  		// 绘制弦图外围的刻度线
	  		groupTick.append('line')
	  						 .attr('x2', 6)
	  		// 定义刻度线上的文字
	  		groupTick.filter(d => d.value % 5e3 === 0)// 不能被5整除的数字不显示
	  							.append('text')
	  							.attr('x', 8)
	  							.attr('dy', '.35em' )
	  							.attr('transform', d=> {return d.angle> Math.PI?'rotate(180) translate(-16)':null})
	  							.attr('text-anchor', d => { return d.angle > Math.PI?'end':null})
	  							.text(d => d.value)*/
	  		gChord.append('g')
	  					.attr('class', 'ribbons')
	  					.selectAll('path')
	  					.data(chords => chords)
	  					.enter()
	  					.append('path')
	  					.attr('class', 'ribbons-path')
	  					.attr('d', ribbon)
	  					// 弦的填充色是目标点的索引值确定的
	  					.attr('fill', d => color(d.target.index))
	  					.attr('stroke', d => d3.rgb(color(d.target.index)).darker())

	  		gGroups.selectAll('path')
	  					 .on('mouseover', d=> {this.fade(d,0)})
	  					 .on('mouseout', d=> {this.fade(d,1)})
	  	},
	  	// 该函数用来计算弧上的刻度的角度
	  	groupTicks(d, step) {
	  			// k 表示单位刻度
	  			const k = (d.endAngle -d.startAngle) / d.value
	  			return d3.range(0, d.value, step).map( value => {return {value: value, angle: value*k + d.startAngle} })
	  	},
	  	fade(g,opacity) {
	  		return d3.selectAll('.ribbons-path')
	  						 .filter( d => {
			  					return d.source.index != g.index && d.target.index != g.index
			  				})
			  				.transition()
			  				.style('opacity', opacity)
	  	},
	  	initTree() {
	
	  		d3.json('static/city.json', (error, data) => {

					const treeSvg = d3.select('#tree')
		  									.append('svg')
		  									.attr('width', '100%')
		  									.attr('height', '100%')
		  		const container = treeSvg.append('g')
	  												 .attr("transform", "translate(40,0)");		

					const root = d3.hierarchy(data, d=> d.children)
					const treeLayout = d3.tree()
						  								 .size([this.height, this.width])
						  								 .separation((a,b) => {//设定相邻接点直接的间隔
						  									 		return (a.parent == b.parent ? 1: 2)
						  									}) 
		  		const treeData = treeLayout(root)	  				
	  			// console.log(data)	  	
	  			//给第一个节点添加初始坐标x0和y0
	  			data.x0 = this.height/2
	  			data.y0 = 0

	  			// this.redraw(container,data)

	  			const nodes = treeData.descendants()
	  			const links = treeData.links()

	  			const link = container.selectAll('.link')
	  											.data(links)
	  											.enter()
	  											.append('path')
	  											.attr('class', 'link')
	  											.style('fill', 'none')
	  											.style('stroke', '#409EFF')
	  											.attr('d', d=> {return this.linkVertical(d)})


	  			const node = container.selectAll('.node')
	  											.data(nodes)
	  											.enter()
	  											.append('g')
	  											.attr('class', 'node')
	  											.attr('transform', d=> {//横向布局树结构
	  												// console.log(d)
	  												return `translate(${d.y},${d.x})` 
	  											})
	  			node.append('circle')
	  					.attr('r', 4.5)
	  					.attr('cursor', 'pointer')
	  					.style('stroke', '#409EFF')
	  					.style('fill', '#fff')
	  					.attr('class', d=>{
	  						return d.children?'parentNode': ''
	  					})
	  			node.append('text')
	  					.attr('dy', '.35em' )
	  					.attr('dx', d=> {return d.children? -8: 8})
	  					.style('text-anchor', d=> {return d.children?'end':'start'})
	  					.style('fill', '#111')
	  					.style('font-size', '12px')
	  					.text(d=> d.data.name)

	  			node.selectAll('.parentNode')
	  					.on('click', (d,i)=>{
	  							this.toggle(d)
	  					})
	  		})
	  	},
	  	linkHorizontal(d){//水平对角线
	  		return `M ${d.source.x},${d.source.y} C ${d.source.x},${(d.source.y+d.target.y)/2} ${d.target.x},${(d.source.y+d.target.y)/2} ${d.target.x},${d.target.y}`
	  	},
	  	linkVertical(d){//垂直对角线
	  		return `M ${d.source.y},${d.source.x} C ${(d.source.y+d.target.y)/2},${d.source.x} ${(d.source.y+d.target.y)/2} ${d.target.x}, ${d.target.y},${d.target.x}`
	  	},
	  	toggle(d){//切换开关 d为被单击的节点
	  		if(d.children){
	  				d._children = d.children
	  				d.children =  null
	  		}else{
	  			d.children = d._children
	  			d._children = null
	  		}
	  	},
	  	redraw(container,source){//重绘函数
				  		
				const root = d3.hierarchy(source, d=> d.children)
				const treeLayout = d3.tree()
					  								 .size([this.height, this.width])
					  								 .separation((a,b) => {//设定相邻接点直接的间隔
					  									 		return (a.parent == b.parent ? 1: 2)
					  									}) 
	  		const treeData = treeLayout(root)	  		
				const nodes = treeData.descendants()
	  		const links = treeData.links()

	  		//重新计算节点的y坐标
	  		nodes.forEach(d=> { 
	  			d.y = d.depth * 180
	  			//每一次调用重绘函数，都将当前节点的位置保存下来
	  			d.x0 = d.x 
	  			d.y0 = d.y
	  		})

	  		//获取节点的update部分
	  		const nodeUpdate = container.selectAll('.node')
	  													.data(nodes, d=> {return d.data.name})
	  		//获取节点的enter部分
	  		const nodeEnter = nodeUpdate.enter()
	  		//获取节点的exit部分
	  		const nodeExit = nodeUpdate.exit()

	  		//在给enter部分添加新的节点时，添加监听器 ，应用开关切换函数
	  		const enterNodes = nodeEnter.append('g')
								 .attr('class', 'node')
	  						 .attr('transform', d=> {
										// return `translate(${source.y0},${source.x0})` 
										return `translate(${d.y},${d.x})` 
									})	 
	  						 .on('click', d=> {
	  						 		this.toggle(d)
	  						 		this.redraw(container,d)
	  						 })
				enterNodes.append('circle')
		  					.attr('r', 4.5)
		  					.attr('cursor', 'pointer')
		  					.style('fill', d => {
		  						return d._children? '#409EFF': '#fff'
		  					})
		  					.style('stroke', '#409EFF')
  			enterNodes.append('text')
		  					.attr('dy', '.35em' )
		  					.attr('x', d=> {return d.children||d._children? -8: 8})
		  					.style('text-anchor', d=> {return d.children||d._children?'end':'start'})
		  					.style('fill', '#111')
		  					.style('font-size', '12px')
		  					.text(d=> d.data.name)	
		  					.style('fill-opacity', 1) 
		  	const updateNodes = nodeUpdate.transition()
		  																.duration(500)
		  																.attr('transform', d=>{
		  																	return `translate(${d.y},${d.x})` 
		  																}) 
		  	updateNodes.select('circle')
		  						 .attr('r', 4.5)
		  						 .style('fill', d=>{
		  						 	return d._children?'#409EFF':'#fff'
		  						 })	
		  	updateNodes.select('text')
		  					   .style('fill-opacity', 1) 	 	
		  	const exitNodes = nodeExit.transition()
		  														.duration(500)
		  														.attr('transform', d=> {
		  															return `translate(${d.source.y},${d.source.x})` 
		  														})	
		  														.remove()	  
				exitNodes.select('circle')
		  						 .attr('r', 0)
		  	exitNodes.select('text')
		  					   .style('fill-opacity', 0) 		

		  	//处理连线的update，enter，exit3部分
		  	const linkUpdate = container.selectAll('.link')
		  																 .data(links, d=> { return d.target.data.name})
		  	const linkEnter = linkUpdate.enter()
		  	const linkExit = linkUpdate.exit()

		  	linkEnter.insert('path', '.node')
		  					 .attr('class', 'link')
								 .style('fill', 'none')
	  						 .style('stroke', '#409EFF')		  					 
		  					 .attr('d', d=> {
		  					 		const o = {x: source.x0 ,y: source.y0 }
		  					 		return this.linkVertical({source: o, target: o})
		  					 })
		  					 .transition()
		  					 .duration(500)
		  					 .attr('d', this.linkVertical)
		  	linkUpdate.transition()
		  						.duration(500)
		  						.attr('d', this.linkVertical)
		    linkExit.transition()
		    				.duration(500)
		    				.attr('d', d=>{
										const o = {x: d.source.x ,y: d.source.y }
		  					 		return this.linkVertical({source: o, target: o})		    					
		    				})
		    				.remove()
		  																													 
	  	}
	  },
	  created() {
	  	// this.color = d3.scaleOrdinal(d3.schemeCategory20c)
	  },
	  mounted() {
			this.width = $('#tree').width() -100
		  this.height = $('#tree').height()			  	
	  	this.initChord()
	  	this.initTree()
	  }
}
</script>

<style lang="less" scoped>
	.chart-container{
    h3{
    	font-size: 1rem;
    	font-weight: normal;
    	text-align: center;
    }
    .chart{
    	height: 300px;
    }
	}
</style>
