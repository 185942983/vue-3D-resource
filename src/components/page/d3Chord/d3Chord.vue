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
 		<el-row :gutter="20">
		  <el-col :span="24">
		  	<div class="container">
		  		<h3>可折叠树结构</h3>
		  		<div id="collapseTree" class="chart1"></div>
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
	  		treeMap: null,
	  		treeRoot: null,
	  		treeSvg: null,
	  		index: 0,
	  		duration: 750
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
	  										.range(['#A7E2CB','#88D7D5','#A7ACE2','#CB8362','#EAD9F2'])		
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
	  					 .style('fill', d => color(d.index))
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
				const width = $('#tree').width() -100
		    const height = $('#tree').height()		
	  		d3.json('static/city.json', (error, data) => {

					const svg = d3.select('#tree')
		  									.append('svg')
		  									.attr('width', '100%')
		  									.attr('height', '100%')
		  		const container = svg.append('g')
	  												 .attr("transform", "translate(40,0)");		

					const root = d3.hierarchy(data, d=> d.children)
					const treeLayout = d3.tree()
						  								 .size([height, width])
						  								 .separation((a,b) => {//设定相邻接点直接的间隔
						  									 		return (a.parent == b.parent ? 1: 2)
						  									}) 
		  		const treeData = treeLayout(root)	  				
	  			// console.log(data)	  	

	  			const nodes = treeData.descendants()
	  			const links = treeData.links()

	  			const link = container.selectAll('.link')
	  											.data(links)
	  											.enter()
	  											.append('path')
	  											.attr('class', 'link')
	  											.style('fill', 'none')
	  											.style('stroke', '#AFD279')
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
	  					.style('stroke', '#AFD279')
	  					.style('fill', '#A7E2CB')
	  					.attr('class', d=>{
	  						return d.children?'parentNode': ''
	  					})
	  			node.append('text')
	  					.attr('dy', '.35em' )
	  					.attr('dx', d=> {return d.children? -8: 8})
	  					.style('text-anchor', d=> {return d.children?'end':'start'})
	  					.style('fill', '#fff')
	  					.style('font-size', '12px')
	  					.text(d=> d.data.name)
	  		})
	  	},
	  	linkHorizontal(d){//水平对角线
	  		return `M ${d.source.x},${d.source.y} C ${d.source.x},${(d.source.y+d.target.y)/2} ${d.target.x},${(d.source.y+d.target.y)/2} ${d.target.x},${d.target.y}`
	  	},
	  	linkVertical(d){//垂直对角线
	  		return `M ${d.source.y},${d.source.x} C ${(d.source.y+d.target.y)/2},${d.source.x} ${(d.source.y+d.target.y)/2} ${d.target.x}, ${d.target.y},${d.target.x}`
	  	},
	  	click(d){//切换开关 d为被单击的节点
	  		if(d.children){
	  				d._children = d.children
	  				d.children =  null
	  		}else{
	  			d.children = d._children
	  			d._children = null
	  		}
	  		this.update(d)
	  	},
	  	initCollapseTree(){
	  		// 设置图表的尺寸和边缘
	  		const margin = {top: 20,right: 90,bottom: 30, left: 90},
	  					width = $('#collapseTree').width() - margin.left -margin.right,
	  					height = $('#collapseTree').height() - margin.top -margin.bottom;
	  		// 将svg对象附加到页面主体 
	  		//将一个“组”元素附加到“svg” 
	  		//将“组”元素移动到左上角
	  		this.treeSvg = d3.select('#collapseTree')
	  									.append('svg')
	  									.attr('width', '100%')
	  									.attr('height', '100%')
	  									.call(d3.zoom()
	  										// 设置缩放区域为0.1-100倍
	  													.scaleExtent([0.1,100])
	  													.on('zoom', _ => {
	  														let scale = d3.event.transform.k,
	  																translate = [d3.event.transform.x, d3.event.transform.y]
	  																// console.log(scale,translate)
																this.treeSvg.attr('transform', `translate(${translate[0] + margin.left},${translate[1] + margin.top}) scale(${scale})`)
	  													})
											)
											.on('dblclick.zoom', null)
	  									.append('g')
	  									.attr('transform', `translate(${margin.left},${margin.top})`)

	  		// 声明树布局并分配大小
	  		this.treeMap = d3.tree().size([height,width])
	  		// 分配父节点，子节点，高度，深度
	  		d3.json('static/city.json', (error,treeData)=>{
	  				this.treeRoot = d3.hierarchy(treeData, d=> d.children)
	  				this.treeRoot.x0 = height/2
	  				this.treeRoot.y0 = 0
	  				console.log(this.treeRoot)
	  				// 从第二层起折叠子节点
	  				this.treeRoot.children.forEach(this.collapse)

	  				this.update(this.treeRoot)
	  		})
	  	},
	  	// 把节点和所有的子节点都折叠起来
	  	collapse(d){
	  		if(d.children){
	  				d._children = d.children
	  				d._children.forEach(this.collapse)
	  				d.children = null
	  		}
	  	},
	  	update(source){
	  		// 为节点分配x和y的位置
	  		const treeData = this.treeMap(this.treeRoot)
	  		// 计算新的树布局
	  		const nodes = treeData.descendants()
	  		const links = treeData.descendants().slice(1)
	  		// 每层之间间隔200
	  		nodes.forEach(d => {
	  			d.y = d.depth*200
	  		})
	  		// *****************节点部分****************
	  		let node = this.treeSvg.selectAll('g.node')
	  														 .data(nodes, d=>{
	  														 		return d.id || (d.id = ++this.index)
	  														 })
	  		let nodeEnter = node.enter()
	  													 .append('g')
	  													 .attr('class', 'node')
	  													 .attr('transform', d=>{
	  													 	 return `translate(${source.y0},${source.x0})`
	  													 })
	  													 .on('click', this.click)
	  		// 为节点添加圆
	  		nodeEnter.append('circle')
	  						 .attr('class', 'node')
	  						 .attr('r', 1e-6)
	  						 .style('stroke', '#EAD9F2')
	  						 .style('stroke-width', '3px')
	  						 .style('fill', d => {
		  							return d._children? '#6A97CD': '#fff'
		  					 })
		  	// 为节点添加标签
		  	nodeEnter.append('text')
		  					 .attr('dy', '.35em')
		  					 .attr('x', d=> {
		  					 		return d.children||d._children? -13: 13
		  					 })
		  					 .attr('text-anchor', d=>{
		  					 		return d.children||d._children? 'end': 'start'
		  					 })
		  					 .style('font', '12px sans-serif')
		  					 .style('fill', '#fff')
		  					 .text(d=> d.data.name)
		  	let nodeUpdate = nodeEnter.merge(node)
		  	// 转换到节点的适当位置
		  	nodeUpdate.transition()
		  						.duration(this.duration)
		  						.attr('transform', d=>{
		  							return `translate(${d.y},${d.x})`
		  						})
		  	// 更新节点属性和样式
		  	nodeUpdate.selectAll('circle.node')
		  						.attr('r', 8)
		  						.style('fill', d=>{
		  							return d._children?'#6A97CD': '#fff'
		  						})
		  						.attr('cursor', 'pointer')
		  	// 删除任何exit节点
		  	let nodeExit = node.exit().transition()
		  											 .duration(this.duration)
		  											 .attr('transform', d=>{
		  											 		return `translate(${source.y},${source.x})`
		  											 })
		  											 .remove()
		  	// 在exit时，将节点圆的大小减少为0
		  	nodeExit.selectAll('circle')
		  					.attr('r', 1e-6)
		  	// 在exit时减少文本标签的不透明度
		  	nodeExit.selectAll('text')
		  					.style('fill-opacity', 1e-6)

 				// ****************** 连接线部分 ******************
 				let link = this.treeSvg.selectAll('path.link')
 													        .data(links, d=> d.id)
 		    let linkEnter = link.enter()
 		    											.insert('path', 'g')
 		    											.attr('class', 'link')
 		    											.style('fill', 'none')
 		    											.style('stroke', '#EAD9F2')
 		    											.style('stroke-width', '2px')
 		    											.attr('d', d=>{
																const o = {x: source.x0 ,y: source.y0 }
		  					 								return this.diagonal(o,o) 		    												
 		    											})
 		    let linkUpdate = linkEnter.merge(link)
 		    linkUpdate.transition()
 		    					.duration(this.duration)
 		    					.attr('d', d=>{
 		    						return this.diagonal(d, d.parent)
 		    					})
 		    let linkExit = link.exit()
 		    										 .transition()
 		    										 .duration(this.duration)
 		    										 .attr('d' , d=>{
 		    										 		const o = {x: source.x ,y: source.y }
		  					 								return this.diagonal(o,o) 		
 		    										 })
 		    										 .remove()
 		    //储存旧的位置为了转换
 		    nodes.forEach(d=>{ 
 		    	d.x0 = d.x
 		    	d.y0 = d.y
 		    })
	  	},
	  	// 从父节点到子节点重新建立一个曲线（对角线）路径
	  	diagonal(s,d){
	  			return `M ${s.y} ${s.x} 
	  							C ${(s.y+d.y)/2} ${s.x},
	  							  ${(s.y+d.y)/2} ${d.x},
	  							  ${d.y} ${d.x}`
	  	}
	  },
	  created() {
	  	// this.color = d3.scaleOrdinal(d3.schemeCategory20c)
	  },
	  mounted() {		  	
	  	this.initChord()
	  	this.initTree()
	  	this.initCollapseTree()
	  }
}
</script>

<style lang="less" scoped>
	.chart-container{
    h3{
    	font-size: 0.8rem;
    	font-weight: normal;
    	background: rgba(12,39,92,0.6);
	    color: #0dcebd;
	    margin: 0 -30px 10px;
	    line-height: 36px;
	    padding-left: 20px;
    }
    .chart{
    	height: 300px;
    }
    .chart1{
    	height: 400px;
    }
    .el-row {
    	margin-bottom: 20px;
	    &:last-child {
	      margin-bottom: 0;
	    }
  	}
	}
</style>
