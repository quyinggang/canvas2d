import{a as S,g as R}from"./index-4243d227.js";import{_ as H,r as P,o as k,b as B,c as q,p as K,e as F,d as U}from"./index-472deb67.js";const $=p=>(K("data-v-3edebe9b"),p=p(),F(),p),z=$(()=>U("span",{class:"tip"},"全量渲染1万个图形，请选择图形进行拖动",-1)),A=[z],D={__name:"Layer",setup(p){const w=P(null);return k(()=>{const d=w.value,l=d.getBoundingClientRect(),u=new Map,L=()=>{let o=!0;for(;o;){const e=R();if(!u.has(e))return o=!1,e}},I=(o,e,s)=>((1<<24)+(o<<16)+(e<<8)+s).toString(16).slice(1);class M{constructor(e){this.x=e.x,this.y=e.y,this.color=e.color,this.radius=e.radius,this.colorKey=L(),u.set(this.colorKey,this)}update(e){this.x=e.x,this.y=e.y}render(e,s){const{radius:t,color:n,x:i,y:x,colorKey:v}=this;e.save(),e.fillStyle=s?v:n,e.beginPath(),e.arc(i,x,t,0,2*Math.PI,!1),e.fill(),e.closePath(),e.restore()}}class f{constructor(e){this.domElement=document.createElement("canvas"),this.ctx=this.domElement.getContext("2d",{willReadFrequently:!!e.willReadFrequently}),this.setCanvasSize(e),this.setCanvasAttrs(),this.ctx.scale(e.pixel,e.pixel)}setCanvasSize(e){const{width:s,height:t,pixel:n}=e;this.width=s*n,this.height=t*n,this.styleWidth=s,this.styleHeight=t}setCanvasAttrs(){const{width:e,height:s,styleWidth:t,styleHeight:n,domElement:i}=this;i.width=e,i.height=s,i.style.cssText=`position:absolute;top:0;left:0;background:transparent;display:block;width:${t}px;height:${n}px;`}}class _{constructor(e){const{container:s,width:t,height:n}=e;this.content=s,this.children=[],this.canvas=new f({pixel:window.devicePixelRatio,width:t,height:n}),this.bufferHitCanvas=new f({pixel:1,width:t,height:n,willReadFrequently:!0}),this.width=t,this.height=n,this.mountCanvas()}mountCanvas(){this.content.appendChild(this.canvas.domElement)}add(e){this.children.push(e)}remove(e){const s=this.children,t=s.findIndex(n=>n===e);t!==-1&&s.splice(t,1)}getSelectedShape(e){const t=this.bufferHitCanvas.ctx.getImageData(Math.round(e.x),Math.round(e.y),1,1).data;if(t[3]===255){const i=`#${I(t[0],t[1],t[2])}`.toUpperCase();if(u.has(i))return u.get(i)}}render(){const{children:e,canvas:s,bufferHitCanvas:t,width:n,height:i}=this,{ctx:x}=s,{ctx:v}=t;x.clearRect(0,0,n,i);for(const E of e)E.render(x),E.render(v,!0)}}const m=l.width,y=l.height,a=new _({container:d,width:m,height:y});for(let o=0;o<1e4;o++)a.add(new M({x:S(0,m),y:S(0,y),radius:20,color:R()}));a.render();const c=new _({container:d,width:m,height:y});let h=null,g=!1,r=null;const b=()=>{g&&r&&(c.remove(r),c.render(),a.add(r),a.render(),console.log("---------end------"),console.log(a.children.length),console.log(c.children.length)),g=!1,window.removeEventListener("mousemove",C),window.removeEventListener("mouseup",b)},C=o=>{if(!g||!r)return;const e={x:o.pageX-l.left,y:o.pageY-l.top},s={x:e.x-h.x,y:e.y-h.y};r.update({x:r.x+s.x,y:r.y+s.y}),c.render(),h=e};d.addEventListener("mousedown",o=>{const{pageX:e,pageY:s}=o;h={x:e-l.left,y:s-l.top},g=!0;const t={...h},n=a.getSelectedShape(t);n&&(r=n,c.add(n),c.render(),a.remove(n),a.render(),console.log("-----start-------"),console.log(a.children.length),console.log(c.children.length)),window.addEventListener("mousemove",C),window.addEventListener("mouseup",b)})}),(d,l)=>(B(),q("div",{class:"box",ref_key:"boxElementRef",ref:w},A,512))}},W=H(D,[["__scopeId","data-v-3edebe9b"]]);export{W as default};
