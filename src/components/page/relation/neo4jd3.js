import * as d3 from 'd3'

const Neo4jd3 = (_selector, _options)=>{
	let container, selector, info, svg, svgNodes,svgRelationships, simulation,
      relationships = [], relationship, relationshipText,nodes = [], node,
      relationshipOutline,relationshipOverlay, highlighted, mouseoutTimeout,
      svgScale, svgTranslate,allPath= [],
      justLoaded = false,
      options = {
          arrowSize: 4, //箭头大小
          center: undefined, //中心点
          images: undefined,   //节点图片
          nodeRadius: 25 ,
          minCollision: 65, //两点间最小距离
          infoPanel: false,   //节点具体信息框
          neo4jData: undefined,  //节点，连线数据
          centerNode: undefined,  //中心节点
          relationshipColor: '#409EFF',  //节点关系连线颜色
          nodeOutlineFillColor: '#409EFF' ,//节点外边线
          zoomFit: false  //是否根据窗口自适应
      } 

  const merge = (target, source) =>{
      Object.keys(source).forEach((property) =>{
          target[property] = source[property];
      });
  }

  const appendInfoPanel = (container) =>{
      return container.append('div')
          .attr('class', 'neo4jd3-info');
  }

  const appendGraph = (container) =>{
      svg = container.append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('class', 'neo4jd3-graph')
          .call(d3.zoom().on('zoom', _ => {
              let scale = d3.event.transform.k,
                  translate = [d3.event.transform.x, d3.event.transform.y];

              if (svgTranslate) {
                  translate[0] += svgTranslate[0];
                  translate[1] += svgTranslate[1];
              }

              if (svgScale) {
                  scale *= svgScale;
              }

              svg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
          }))
          .on('dblclick.zoom', null)
          .on('click', _ => {
              let event = d3.event,
              target =  event.srcElement,   //  获取事件发生源
              data = d3.select(target).datum(); //  获取事件发生源的数据
              if(data == undefined) {
                  //    阻止事件向后传递
                  event.stopPropagation();
                  nodeRemoveActive()
                  hidePanel()
              }
          }, true)
          .append('g')
          .attr('width', '100%')
          .attr('height', '100%');

      svgRelationships = svg.append('g')
          .attr('class', 'relationships');

      svgNodes = svg.append('g')
          .attr('class', 'nodes');
  }

  const initSimulation = _ => {
      const simulation = d3.forceSimulation()
          .force('collide', d3.forceCollide().radius((d) => {
              return options.minCollision;
          }).iterations(2))
          .force('charge', d3.forceManyBody())
          .force('link',d3.forceLink().id((d) => {
              //console.log(d)
              return d.node_id;
          }))
          .force('center', d3.forceCenter(svg.node().parentElement.parentElement.clientWidth / 2, svg.node().parentElement.parentElement.clientHeight / 2))
          .on('tick', e => {
              // if(simulation.alpha()<=0.5) {  // 足够稳定时，才渲染一次
                  tick();
                  // simulation.stop();
              // }
          })
          .on('end', e => {
              if (options.zoomFit && !justLoaded) {
                  justLoaded = true;
                  zoomFit(2);
              }
          });

      return simulation;
  }

  const zoomFit = (transitionDuration) =>{
      let bounds = svg.node().getBBox(),
          parent = svg.node().parentElement.parentElement,
          fullWidth = parent.clientWidth,
          fullHeight = parent.clientHeight,
          width = bounds.width,
          height = bounds.height,
          midX = bounds.x + width / 2,
          midY = bounds.y + height / 2;

      if (width === 0 || height === 0) {
          return; // nothing to fit
      }

      svgScale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
      svgTranslate = [fullWidth / 2 - svgScale * midX, fullHeight / 2 - svgScale * midY];

      svg.attr('transform', 'translate(' + svgTranslate[0] + ', ' + svgTranslate[1] + ') scale(' + svgScale + ')');
  }

  const updateNodesAndRelationships = (n, r) => {
      updateRelationships(r);
      updateNodes(n);

      simulation.nodes(nodes);
      simulation.force('link').links(relationships);
  }

  const updateRelationships = (r) => {
      Array.prototype.push.apply(relationships, r);

      relationship = svgRelationships.selectAll('.relationship')
          .data(relationships, (d) => { return d.node_id; });

      let relationshipEnter = appendRelationshipToGraph();

      relationship = relationshipEnter.relationship.merge(relationship);

      relationshipOutline = svg.selectAll('.relationship .outline');
      relationshipOutline = relationshipEnter.outline.merge(relationshipOutline);

      // relationshipOverlay = svg.selectAll('.relationship .overlay');
      // relationshipOverlay = relationshipEnter.overlay.merge(relationshipOverlay);

      relationshipText = svg.selectAll('.relationship .lineText');
      relationshipText = relationshipEnter.text.merge(relationshipText);
  }

  const appendRelationshipToGraph = _ => {
      let relationship = appendRelationship(),
          text = appendTextToRelationship(relationship),
          outline = appendOutlineToRelationship(relationship)/*,
          overlay = appendOverlayToRelationship(relationship)*/;

      return {
          outline: outline,
          // overlay: overlay,
          relationship: relationship,
          text: text
      };
  }

  const appendRelationship = _ => {
      return relationship.enter()
          .append('g')
          .attr('class', 'relationship')
          .on('dblclick', (d) => {
              if (typeof options.onRelationshipDoubleClick === 'function') {
                  options.onRelationshipDoubleClick(d);
              }
          })
          .on('mouseenter', (d) => {
              //console.log(d)
          });
  }

  const appendTextToRelationship = (r) => {
      return r.append('text')
          .attr('class', 'lineText')
          .attr('fill',  options.relationshipColor)
          .attr('font-size', '10px')
          .attr('pointer-events', 'none')
          .attr('text-anchor', 'middle')
          .text((d) => {
              return d.prop;
          });
  }

  const appendOutlineToRelationship = (r) => {
      return r.append('path')
          .attr('class', 'outline')
          .attr('fill', options.relationshipColor)
          .attr('stroke', 'none');
  }
  
  const appendOverlayToRelationship = (r) => {
      return r.append('path')
          .attr('class', 'overlay')
          .attr('fill',options.relationshipColor );
  }

  const updateNodes = (n) => {
      Array.prototype.push.apply(nodes, n);
      nodes.forEach( (v) => {
          if(v.node_type == options.center){
              v.nodeRadius = options.nodeRadius*1.16
          }else{
              v.nodeRadius = options.nodeRadius*1.16
          }
      })
      node = svgNodes.selectAll('.node')
          .data(nodes, (d) =>{ return d.node_id; });
      let nodeEnter = appendNodeToGraph();
      node = nodeEnter.merge(node);
  }

  const appendNodeToGraph = _ => {
      let n = appendNode();

      appendRingToNode(n);
      appendOutlineToNode(n);

      if (options.images) {
          appendImageToNode(n);
      }

      appendTextToNode(n);

      // svg.selectAll('.text').style('opacity', 0)
      // svg.selectAll('.relationship .lineText').style('opacity', 0)
      // svg.selectAll('.relationship .outline').style('opacity', 0)

      return n;
  }

  const appendNode = _ => {
      return node.enter()
          .append('g')
          .attr('class', 'node')
          .attr('cursor', 'pointer')
          .on('click', (d) => {
              d.fx = d.fy = null;
              nodeActive(d)

              if (typeof options.onNodeClick === 'function') {
                  options.onNodeClick(d);
              }
          })
          .on('dblclick', (d) => {
              stickNode(d);

              if (typeof options.onNodeDoubleClick === 'function') {
                  options.onNodeDoubleClick(d);
              }
          })
          .on('mouseenter', (d) =>{
              if (info) {
                  // nodeActive(d)
                  // updateInfo(d);
              }

              if (typeof options.onNodeMouseEnter === 'function') {
                  options.onNodeMouseEnter(d);
              }
          })
          .on('mouseleave', (d) => {
              if (info) {
                  // clearInfo(d);
              }
              // nodeRemoveActive()
              if (typeof options.onNodeMouseLeave === 'function') {
                  options.onNodeMouseLeave(d);
              }
          })
          .call(d3.drag()
              .on('start', dragStarted)
              .on('drag', dragged)
              .on('end', dragEnded));
  }

  const appendOutlineToNode = (node) =>{
        return node.append('circle')
                   .attr('class', 'outline')
                   .attr('r', options.nodeRadius)
                  .style('fill', (d)=> {
                    let color = '#a5abb6'
                    if(d.node_type == 'woman'){
                      color = '#FF82AB'
                    }else if(d.node_type == 'man'){
                      color = '#66CDAA'
                    }else if(d.node_type == 'movie'){
                      color = '#FFC1C1'
                    }else if(d.node_type == 'director'){
                      color = '#00E5EE'
                    }
                    return color;
                 })                     
                   .style('stroke', (d) =>{
                       return options.nodeOutlineFillColor;
                   })
    }

  const appendRingToNode = (node) => {
      return node.append('circle')
                 .attr('class', 'ring')
                 .attr('r', options.nodeRadius * 1.02)
                 .style('fill', (d)=> {
                       return options.nodeOutlineFillColor;
                  })                                
                 .append('title').text((d)=> {
                     return toString(d.name);
                 });
  }

  const appendTextToNode = (node) => {
      return node.append('text')
                 .attr('class', 'text')
                 .attr('fill', '#ffffff')
                 .attr('font-size', '10px')
                 .attr('pointer-events', 'none')
                 .attr('text-anchor', 'middle')
                 .attr('y', '4px')
                 .html((d)=> {
                     return d.name;
                 });
  }

  const stickNode = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
  }

  const updateInfo = (d) => {
      clearInfo();
      let tipHtml = ''
      let attr = graphCom.tooltips[d.node_type]
      for(let key in attr){
          if(d[key]){
              tipHtml += attr[key] + ":\t" + d[key] +'<br/>';
          }
      }

      info.style('left', d.x+ 'px')
          .style('top', d.y+'px')
          .html(tipHtml)
          .style('opacity','1')
  }

  const clearInfo = _ => {
      info.html('')
          .style("opacity",0);
  }

  const dragStarted = (d) => {
      if (!d3.event.active) {
          simulation.alphaTarget(0.3).restart();
      }

      d.fx = d.x;
      d.fy = d.y;

      if (typeof options.onNodeDragStart === 'function') {
          options.onNodeDragStart(d);
      }
  }

  const dragged = (d) =>{
      stickNode(d);
  }

  const dragEnded = (d) => {
      if (!d3.event.active) {
          simulation.alphaTarget(0);
      }

      if (typeof options.onNodeDragEnd === 'function') {
          options.onNodeDragEnd(d);
      }
  }

  const appendImageToNode = (node)=> {
      return node.append('image')
          .attr('height', (d)=> {
              return d.node_type == options.center ? '120px': '60px';
          })
          .attr('x', (d)=> {
              return d.node_type == options.center ? '-60px': '-30px';
          })
          .attr('xlink:href', (d)=> {
              return  options.images[d.node_type];
          })
          .attr('y', (d)=> {
              return d.node_type == options.center ? '-60px': '-30px';
          })
          .attr('width', (d)=> {
              return d.node_type == options.center ? '120px': '60px';
          });
  }

  const tick = _ => {
      tickNodes();
      tickRelationships();
  }

  const tickNodes =  _ => {
      if (node) {
          node.attr('transform', (d) =>{
              return 'translate(' + d.x + ', ' + d.y + ')';
          });
      }
  }

  const tickRelationships =  _ => {
      if (relationship) {
          relationship.attr('transform', (d)=> {
              let angle = rotation(d.source, d.target);
              return 'translate(' + d.source.x + ', ' + d.source.y + ') rotate(' + angle + ')';
          });

          tickRelationshipsTexts();
          tickRelationshipsOutlines();
          // tickRelationshipsOverlays();
      }
  }

  const rotation = (source, target) => {
      return Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI;
  }

  const tickRelationshipsTexts = _ => {
      relationshipText.attr('transform', (d)=> {
          let offsetY = 0
          if(d.linknum >1){
              offsetY = 7
          }
          let angle = (rotation(d.source, d.target) + 360) % 360,
              mirror = angle > 90 && angle < 270,
              center = { x: 0, y: 0 },
              n = unitaryNormalVector(d.source, d.target),
              nWeight = mirror ? 2 : -3,
              point = { x: (d.target.x - d.source.x) * 0.5 + n.x * nWeight, y: (d.target.y - d.source.y) * 0.5 + n.y * nWeight },
              rotatedPoint = rotatePoint(center, point, angle);

          return 'translate(' + rotatedPoint.x + ', ' + (rotatedPoint.y + offsetY) + ') rotate(' + (mirror ? 180 : 0) + ')';
      });
  }

  const tickRelationshipsOutlines = _ => {
      relationship.each(function() {
          let rel = d3.select(this),
              outline = rel.select('.outline'),
              text = rel.select('.lineText'),
              bbox = text.node().getBBox()

          outline.attr('d', (d)=> {
              let offsetY = 0
              if(d.linknum >1){
                  offsetY = 7
              }
              let center = { x: 0, y: 0 },
                  angle = rotation(d.source, d.target),
                  textBoundingBox = bbox,
                  textPadding = 10,
                  u = unitaryVector(d.source, d.target),
                  textMargin = { x: (d.target.x - d.source.x - (textBoundingBox.width + textPadding) * u.x) * 0.5, y: (d.target.y - d.source.y - (textBoundingBox.width + textPadding) * u.y) * 0.5 },
                  n = unitaryNormalVector(d.source, d.target),
                  rotatedPointA1 = rotatePoint(center, { x: 0 + (d.source.nodeRadius + 1) * u.x - n.x, y: 0 + (d.source.nodeRadius + 1) * u.y - n.y }, angle),
                  rotatedPointB1 = rotatePoint(center, { x: textMargin.x - n.x, y: textMargin.y - n.y }, angle),
                  rotatedPointC1 = rotatePoint(center, { x: textMargin.x, y: textMargin.y }, angle),
                  rotatedPointD1 = rotatePoint(center, { x: 0 + (d.source.nodeRadius + 1) * u.x, y: 0 + (d.source.nodeRadius + 1) * u.y }, angle),
                  rotatedPointA2 = rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x - n.x, y: d.target.y - d.source.y - textMargin.y - n.y }, angle),
                  rotatedPointB2 = rotatePoint(center, { x: d.target.x - d.source.x - (d.target.nodeRadius + 1) * u.x - n.x - u.x * options.arrowSize, y: d.target.y - d.source.y - (d.target.nodeRadius + 1) * u.y - n.y - u.y * options.arrowSize }, angle),
                  rotatedPointC2 = rotatePoint(center, { x: d.target.x - d.source.x - (d.target.nodeRadius + 1) * u.x - n.x + (n.x - u.x) * options.arrowSize, y: d.target.y - d.source.y - (d.target.nodeRadius + 1) * u.y - n.y + (n.y - u.y) * options.arrowSize }, angle),
                  rotatedPointD2 = rotatePoint(center, { x: d.target.x - d.source.x - (d.target.nodeRadius + 1) * u.x, y: d.target.y - d.source.y - (d.target.nodeRadius + 1) * u.y }, angle),
                  rotatedPointE2 = rotatePoint(center, { x: d.target.x - d.source.x - (d.target.nodeRadius + 1) * u.x + (- n.x - u.x) * options.arrowSize, y: d.target.y - d.source.y - (d.target.nodeRadius + 1) * u.y + (- n.y - u.y) * options.arrowSize }, angle),
                  rotatedPointF2 = rotatePoint(center, { x: d.target.x - d.source.x - (d.target.nodeRadius + 1) * u.x - u.x * options.arrowSize, y: d.target.y - d.source.y - (d.target.nodeRadius + 1) * u.y - u.y * options.arrowSize }, angle),
                  rotatedPointG2 = rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x, y: d.target.y - d.source.y - textMargin.y }, angle);

             return 'M ' + rotatedPointA1.x + ' ' + (rotatedPointA1.y + offsetY)+
                  ' L ' + rotatedPointB1.x + ' ' + (rotatedPointB1.y + offsetY) +
                  ' L ' + rotatedPointC1.x + ' ' + (rotatedPointC1.y + offsetY) +
                  ' L ' + rotatedPointD1.x + ' ' + (rotatedPointD1.y + offsetY) +
                  ' Z M ' + rotatedPointA2.x + ' ' + (rotatedPointA2.y + offsetY) +
                  ' L ' + rotatedPointB2.x + ' ' + (rotatedPointB2.y + offsetY) +
                  ' L ' + rotatedPointC2.x + ' ' + (rotatedPointC2.y + offsetY) +
                  ' L ' + rotatedPointD2.x + ' ' + (rotatedPointD2.y + offsetY) +
                  ' L ' + rotatedPointE2.x + ' ' + (rotatedPointE2.y + offsetY) +
                  ' L ' + rotatedPointF2.x + ' ' + (rotatedPointF2.y + offsetY) +
                  ' L ' + rotatedPointG2.x + ' ' + (rotatedPointG2.y + offsetY) +
                  ' Z';
          });
      });
  }

  const tickRelationshipsOverlays = _ => {
      relationshipOverlay.attr('d', (d)=> {
          let center = { x: 0, y: 0 },
              angle = rotation(d.source, d.target),
              n1 = unitaryNormalVector(d.source, d.target),
              n = unitaryNormalVector(d.source, d.target, 1),
              rotatedPointA = rotatePoint(center, { x: 0 - n.x, y: 0 - n.y }, angle),
              rotatedPointB = rotatePoint(center, { x: d.target.x - d.source.x - n.x, y: d.target.y - d.source.y - n.y }, angle),
              rotatedPointC = rotatePoint(center, { x: d.target.x - d.source.x + n.x - n1.x, y: d.target.y - d.source.y + n.y - n1.y }, angle),
              rotatedPointD = rotatePoint(center, { x: 0 + n.x - n1.x, y: 0 + n.y - n1.y }, angle);

          return 'M ' + rotatedPointA.x + ' ' + rotatedPointA.y +
              ' L ' + rotatedPointB.x + ' ' + rotatedPointB.y +
              ' L ' + rotatedPointC.x + ' ' + rotatedPointC.y +
              ' L ' + rotatedPointD.x + ' ' + rotatedPointD.y +
              ' Z';

      });
  }

  const highlightObject = (obj) => {
      if (obj) {
          if (obj !== highlighted) {
              node.classed('inactive', (d) => {
                  //    console.log(isRelation(obj,d))
                  return obj !== d && !isRelation(obj,d)
              });
              relationship.classed('inactive', (d)=> {
                  return (obj !== d.source && obj !== d.target);
              });
              /*node.classed('active', function(d) {
                  return obj == d || isRelation(obj,d)
              });
              svg.selectAll('.active .text').style('opacity', 1)*/

              relationship.classed('active', (d) => {
                  return (obj == d.source || obj == d.target);
              });
              svg.selectAll('.active .lineText').style('opacity', 1)
              svg.selectAll('.active .outline').style('opacity', 1)
              svg.selectAll('.active .overlay').style('opacity', 0)
          }
          highlighted = obj;
      } else {
          // if (highlighted) {
              node.classed('inactive', false);
              relationship.classed('inactive', false);
          // }
          highlighted = null;

          // svg.selectAll('.text').style('opacity', 0)
          svg.selectAll('.relationship .lineText').style('opacity', 0)
          svg.selectAll('.relationship .outline').style('opacity', 0)
          svg.selectAll('.relationship .overlay').style('opacity', 1)

      }
      // $(".svgTools .sf-radio-wrapper .sf-checked-item").find("span").removeClass('sf-radio-selected')
  }

  const isRelation = (obj, d)=> {
      return relationship.filter(n=> {
          return (n.source.node_id == obj.node_id && n.target.node_id == d.node_id)||(n.target.node_id == obj.node_id && n.source.node_id == d.node_id)
      })._groups[0].length
  }
  const nodeActive =  (d)=> {
      if (mouseoutTimeout) {
          clearTimeout(mouseoutTimeout);
          mouseoutTimeout = null;
      }
      highlightObject(d);
  }

  const nodeRemoveActive = _ => {
      if (mouseoutTimeout) {
          clearTimeout(mouseoutTimeout);
          mouseoutTimeout = null;
      }
      mouseoutTimeout = setTimeout(e => {
          highlightObject(null)
      }, 300)

  }

  const allTextShow = _ => {
      if (mouseoutTimeout) {
          clearTimeout(mouseoutTimeout);
          mouseoutTimeout = null;
      }
      highlighted = null;
      node.classed('inactive', false);
      relationship.classed('inactive', false);

      svg.selectAll('.relationship .lineText').style('opacity', 1)
      svg.selectAll('.relationship .outline').style('opacity', 1)
      svg.selectAll('.relationship .overlay').style('opacity', 0)
  }

  const showPanel = _ => {
      $('.infoPanel').show()
      setTimeout( e => {
          $('.infoPanel').css('opacity', '1')
      },100)
  }

  const hidePanel =  _ => {
      $('.infoPanel').css('opacity', '0')
      setTimeout( e => {
          $('.infoPanel').hide()
      },500)
  }

  const unitaryNormalVector = (source, target, newLength)=> {
      let center = { x: 0, y: 0 },
          vector = unitaryVector(source, target, newLength);

      return rotatePoint(center, vector, 90);
  }

  const unitaryVector = (source, target, newLength)=> {
      let length = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)) / Math.sqrt(newLength || 1);

      return {
          x: (target.x - source.x) / length,
          y: (target.y - source.y) / length,
      };
  }

  const rotatePoint = (c, p, angle) => {
      return rotate(c.x, c.y, p.x, p.y, angle);
  }

  const rotate = (cx, cy, x, y, angle) => {
      let radians = (Math.PI / 180) * angle,
          cos = Math.cos(radians),
          sin = Math.sin(radians),
          nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
          ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

      return { x: nx, y: ny };
  }

  const saveSvg =  (name) => {
      let g = $(".chart-container svg").find('>g')
      saveSvgAsPng($(".chart-container svg")[0], name+".png",
          {
              backgroundColor: '#ccc',
              height: g.height(),
              width: g.width(),
              top: g.offset().top -180,  //减去svg距离浏览器顶部的距离
              left: g.offset().left - parseInt($("#main").css("margin-left"))  //减去svg距离浏览器左侧的距离
          });

  }

  const init =  ( _selector, _options) => {
      merge(options, _options);

      selector = _selector;

      container = d3.select(selector);

      container.html('');

      if (options.infoPanel) {
          info = appendInfoPanel(container);
      }

      appendGraph(container);

      simulation = initSimulation();

      if (options.neo4jData) {
          let nodes_data, links_data;
          nodes_data = options.neo4jData.nodes_data
          links_data = options.neo4jData.links_data

          links_data.sort((a, b) => {
               if (a.source > b.source) {
                  return 1;
               } else if (a.source < b.source) {
                   return -1;
               } else {
                  if (a.target > b.target) {
                      return 1;
                  }
                   if (a.target < b.target) {
                      return -1;
                   } else {
                      return 0;
                   }
               }
           });

           for (let i = 0; i < links_data.length; i++) {
               links_data[i].linknum = 1
               for (let j = 0; j < links_data.length ; j++) {
                   if(links_data[i].source == links_data[j].target && links_data[i].target == links_data[j].source){
                       links_data[i].linknum +=1
                   }
               }
           }
           // console.table(links_data)

          updateNodesAndRelationships(nodes_data, links_data)

      } else {
          console.error('Error: neo4jData is empty!');
      }
  }

  init(_selector, _options)

  return {
      showPanel: showPanel,
      hidePanel: hidePanel,
      inActive: nodeRemoveActive,
      saveSvg: saveSvg,
      allTextShow: allTextShow
  }
};

export default Neo4jd3;