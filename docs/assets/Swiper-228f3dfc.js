import{l as q}from"./index-4243d227.js";import{_ as F,r as _,o as G,b as H,c as J,d as o,p as K,e as N}from"./index-40fc49b6.js";const O=""+new URL("swiper-e05cc092.jpeg",import.meta.url).href;const Q=r=>(K("data-v-92346711"),r=r(),N(),r),Y={class:"box"},Z=Q(()=>o("div",{id:"swiper-container",class:"swiper-container"},[o("span",null,"向右滑动完成验证"),o("div",{id:"state",class:"verify--state"}),o("div",{id:"swiper",class:"swiper"},"→")],-1)),ee={__name:"Swiper",setup(r){const y=_(null),b=_(null),E=_(null);return G(()=>{const s=y.value.getBoundingClientRect(),u=b.value,c=window.devicePixelRatio;u.width=c*s.width,u.height=c*s.height;const d=E.value;d.width=42,d.height=c*s.height;const p=u.getContext("2d"),C=d.getContext("2d");p.scale(c,c);const h=document.getElementById("swiper"),i=document.getElementById("swiper-container"),$=document.getElementById("state");i.style.cssText=`width:${s.width}px;`;let f=!1,S=0,k=0,w=0,x=0;const l=s.width,A=s.height,a=40,v="state--active",I="state--success",R="state--error",W=h.clientWidth,U=e=>{h.style.transform=`translate(${e}px, 0)`},V=e=>{d.style.transform=`translate(${e}px, 0)`},j=e=>{$.style.width=`${e}px`},B=(e,t)=>{e.classList.add(t)},P=(e,t)=>{const n=e.classList;(Array.isArray(t)?t:[t]).forEach(g=>n.remove(g))},X=(e,t)=>Math.round(Math.random()*(t-e)+e),L=(e,t=0,n=0,m="clip")=>{e.strokeStyle="#fff",e.fillStyle="#fff",e.lineWidth=1,e.beginPath(),e.rect(t,n,a,a),e.stroke(),m==="clip"?e.clip():e.fill(),e.closePath()},z=()=>Math.abs(w-x)<10,M=e=>{if(!f)return;const t=e.pageX-s.left-S+k;t<0||t>l-W||(w=t,B(i,v),U(t),V((l-a-2)/(l-a)*t),j(t))},D=()=>{f=!1;const e=z();P(i,v),B(i,e?I:R),window.removeEventListener("mousemove",M),window.removeEventListener("mouseup",D)};q(O).then(e=>{const t=X(l/2,l-a+a/4),n=X(a,A-a-a/5);x=t,p.drawImage(e,0,0,s.width,s.height),L(p,t,n,"fill"),L(C,1,n);const m=p.getImageData(t,n,a,a);C.putImageData(m,1,n),h.onmousedown=g=>{f=!0,S=g.pageX-s.left,k=w,P(i,[v,R,I]),window.addEventListener("mousemove",M),window.addEventListener("mouseup",D)}})}),(T,s)=>(H(),J("div",Y,[o("div",{class:"center",ref_key:"boxElementRef",ref:y},[o("canvas",{class:"canvas",ref_key:"imageCanvasRef",ref:b},null,512),o("canvas",{class:"canvas-block",ref_key:"blockCanvasRef",ref:E},null,512),Z],512)]))}},ae=F(ee,[["__scopeId","data-v-92346711"]]);export{ae as default};