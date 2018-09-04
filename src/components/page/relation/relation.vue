<template>
  <div class="chart-container">
  	
  </div>
</template>

<script>
	import Neo4jd3 from './neo4jd3.js'
	export default {
		name: 'd3Relation',
		data: function(){
	    return {
	    		graph_nodes: [
	    			{
	    				name: '导演',
	    				node_id: '1',
	    				node_type: 'director',
	    			},
						{
	    				name: '电影1',
	    				node_id: '2',
	    				node_type: 'movie',
	    			},
						{
	    				name: '电影2',
	    				node_id: '3',
	    				node_type: 'movie',
	    			}	,
						{
	    				name: '女演员1',
	    				node_id: '4',
	    				node_type: 'woman',
	    			}	,
						{
	    				name: '女演员2',
	    				node_id: '5',
	    				node_type: 'woman',
	    			}	,
						{
	    				name: '女演员3',
	    				node_id: '6',
	    				node_type: 'woman',
	    			}	,
						{
	    				name: '女演员4',
	    				node_id: '7',
	    				node_type: 'woman',
	    			}	,
						{
	    				name: '女演员5',
	    				node_id: '8',
	    				node_type: 'woman',
	    			}	,
						{
	    				name: '女演员6',
	    				node_id: '9',
	    				node_type: 'woman',
	    			}	,
						{
	    				name: '女演员7',
	    				node_id: '10',
	    				node_type: 'woman',
	    			}	,
						{
	    				name: '女演员8',
	    				node_id: '11',
	    				node_type: 'woman',
	    			}	,
						{
	    				name: '男演员1',
	    				node_id: '12',
	    				node_type: 'man',
	    			}	,
						{
	    				name: '男演员2',
	    				node_id: '13',
	    				node_type: 'man',
	    			}	 ,
						{
	    				name: '男演员3',
	    				node_id: '14',
	    				node_type: 'man',
	    			}	,
						{
	    				name: '男演员4',
	    				node_id: '15',
	    				node_type: 'man',
	    			}	,
						{
	    				name: '男演员5',
	    				node_id: '16',
	    				node_type: 'man',
	    			}	,
						{
	    				name: '男演员6',
	    				node_id: '17',
	    				node_type: 'man',
	    			}	,
						{
	    				name: '男演员7',
	    				node_id: '18',
	    				node_type: 'man',
	    			}	,
						{
	    				name: '男演员8',
	    				node_id: '19',
	    				node_type: 'man',
	    			}	   			
	    		],
	    		graph_links: [
	    			{
	    				source: '1',
	    				target: '2',
	    				prop: '关系一'
	    			},
						{
	    				source: '1',
	    				target: '3',
	    				prop: '关系一'
	    			},
						{
	    				source: '4',
	    				target: '2',
	    				prop: '关系二'
	    			},
						{
	    				source: '5',
	    				target: '2',
	    				prop: '关系二'
	    			} ,
						{
	    				source: '6',
	    				target: '2',
	    				prop: '关系二'
	    			} ,
						{
	    				source: '7',
	    				target: '2',
	    				prop: '关系二'
	    			} ,
						{
	    				source: '12',
	    				target: '2',
	    				prop: '关系二'
	    			} ,
						{
	    				source: '13',
	    				target: '2',
	    				prop: '关系二'
	    			} ,
						{
	    				source: '14',
	    				target: '2',
	    				prop: '关系二'
	    			} ,
						{
	    				source: '15',
	    				target: '2',
	    				prop: '关系二'
	    			},
						{
	    				source: '8',
	    				target: '3',
	    				prop: '关系二'
	    			} ,
						{
	    				source: '9',
	    				target: '3',
	    				prop: '关系二'
	    			},
						{
	    				source: '10',
	    				target: '3',
	    				prop: '关系二'
	    			},
						{
	    				source: '11',
	    				target: '3',
	    				prop: '关系二'
	    			},
						{
	    				source: '16',
	    				target: '3',
	    				prop: '关系二'
	    			} ,
						{
	    				source: '17',
	    				target: '3',
	    				prop: '关系二'
	    			}  ,
						{
	    				source: '18',
	    				target: '3',
	    				prop: '关系二'
	    			}  ,
						{
	    				source: '19',
	    				target: '3',
	    				prop: '关系二'
	    			},
						{
	    				source: '19',
	    				target: '7',
	    				prop: '关系三'
	    			}   ,
						{
	    				source: '11',
	    				target: '13',
	    				prop: '关系三'
	    			}     			
	    		],
	    		centerNode: {
						name: '导演',
    				node_id: '1',
    				node_type: 'direator'    			
	    		},
	    		neo4jd3: null
	    }   
	  },
	  mounted() {
	  	this.initGraph()
	  },		
	  methods: {
	  	initGraph() {
	  		this.neo4jd3 = new Neo4jd3('.chart-container', {
          center: 'director',
          neo4jData: {
              nodes_data: this.graph_nodes,
              links_data: this.graph_links
          },
          centerNode: this.centerNode,
          onNodeClick: (node) =>{
              // initGraphTab(node)
          },
          zoomFit: false
      	})
	  	}
	  }
	}
</script>

<style scoped>
   .chart-container{
   		width: calc(100% + 80px);
	    height: calc(100% + 80px);
	    margin: -40px;
	    overflow: hidden;
   }
	
</style>
