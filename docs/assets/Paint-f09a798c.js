import{_ as k,r as x,o as C,b as w,c as E,d as a,f as d,u as n}from"./index-9a21a5d4.js";const y={class:"group"},R={__name:"Paint",setup(P){const b=x(null),h=x(null);let u=()=>{},c=()=>{},p=()=>{},f=()=>{},m=()=>{},g=()=>{};return C(()=>{const e=b.value.getBoundingClientRect(),t=h.value,i=window.devicePixelRatio;t.width=i*e.width,t.height=i*e.height;const o=t.getContext("2d");o.scale(i,i);let r=!1;c=s=>{const l=s.target.value||"#000";o.strokeStyle=l},u=()=>{o.globalCompositeOperation="source-over",o.lineWidth=5},f=()=>{o.globalCompositeOperation="source-over",o.lineWidth=1},g=()=>{o.globalCompositeOperation="destination-out",o.lineWidth=30},p=()=>{o.clearRect(0,0,e.width,e.height)},m=()=>{const s=t.toDataURL();let l=document.createElement("a");l.href=s,l.download=`签名-${Date.now()}.png`,l.click(),l=null},t.onmousedown=s=>{r=!0;const l=s.pageX-e.left,v=s.pageY-e.top;o.beginPath(),o.moveTo(l,v)},t.onmousemove=s=>{if(!r)return;const l=s.pageX-e.left,v=s.pageY-e.top;o.lineTo(l,v),o.stroke()},t.onmouseup=()=>{r=!1,o.closePath()},t.onmouseleave=()=>{r=!1,o.closePath()}}),(_,e)=>(w(),E("div",{class:"box",ref_key:"boxElementRef",ref:b},[a("div",y,[a("button",{onClick:e[0]||(e[0]=d((...t)=>n(u)&&n(u)(...t),["stop"]))},"粗线条"),a("button",{onClick:e[1]||(e[1]=d((...t)=>n(f)&&n(f)(...t),["stop"]))},"细线条"),a("button",{onClick:e[2]||(e[2]=d((...t)=>n(m)&&n(m)(...t),["stop"]))},"保存签名"),a("input",{type:"color",onChange:e[3]||(e[3]=(...t)=>n(c)&&n(c)(...t))},null,32),a("button",{onClick:e[4]||(e[4]=(...t)=>n(g)&&n(g)(...t))},"橡皮擦"),a("button",{onClick:e[5]||(e[5]=d((...t)=>n(p)&&n(p)(...t),["stop"]))},"清空画布")]),a("canvas",{class:"canvas",ref_key:"canvasElementRef",ref:h},null,512)],512))}},D=k(R,[["__scopeId","data-v-11ca78d5"]]);export{D as default};