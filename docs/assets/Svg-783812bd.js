import{l as x}from"./index-4243d227.js";import{r as w,o as v,b as p,c as u}from"./index-36847955.js";const _={__name:"Svg",setup(C){const c=w(null);return v(()=>{const o=c.value,h=o.getBoundingClientRect();class r{constructor(t,s,e){this.x=t,this.y=s,this.image=e}render(t){const{x:s,y:e,image:n}=this;t.drawImage(n,s,e)}}class d{constructor(t){this.domElement=document.createElement("canvas"),this.ctx=this.domElement.getContext("2d"),this.setCanvasSize(t),this.setCanvasAttrs(),this.ctx.scale(t.pixel,t.pixel)}setCanvasSize(t){const{width:s,height:e,pixel:n}=t;this.width=s*n,this.height=e*n,this.styleWidth=s,this.styleHeight=e}setCanvasAttrs(){const{width:t,height:s,styleWidth:e,styleHeight:n,domElement:a}=this;a.width=t,a.height=s,a.style.cssText=`width:${e}px;height:${n}px;`}}class g{constructor(t){const{width:s,height:e,container:n}=t;this.content=n,this.width=s,this.height=e,this.children=[],this.canvas=new d({pixel:window.devicePixelRatio,width:s,height:e}),this.mountCanvas()}mountCanvas(){this.content.appendChild(this.canvas.domElement)}add(t){this.children.push(t)}render(){const{children:t,canvas:s}=this,e=s.ctx;e.clearRect(0,0,this.width,this.height);for(const n of t)e.save(),n.render(e),e.restore()}}const l=new g({container:o,width:h.width,height:h.height}),m=`data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" height="210" width="500">
        <polygon
          points="100,10 40,198 190,78 10,78 160,198"
          style="fill: lime; stroke: purple; stroke-width: 5; fill-rule: evenodd"
        />
      </svg>
  `)}`;x(m).then(i=>{const t={x:h.width*.5-i.width*.5,y:h.height*.5-i.height*.5};l.add(new r(t.x,t.y,i)),l.render()})}),(o,h)=>(p(),u("div",{class:"box",ref_key:"boxElementRef",ref:c},null,512))}};export{_ as default};