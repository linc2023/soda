(function(p,m){typeof exports=="object"&&typeof module<"u"?m(exports,require("react"),require("mobx"),require("@soda/core"),require("@soda/common")):typeof define=="function"&&define.amd?define(["exports","react","mobx","@soda/core","@soda/common"],m):(p=typeof globalThis<"u"?globalThis:p||self,m(p.sodaDesigner=p.sodaDesigner||{},p.window.React,p.window.mobx,p.window.sodaCore,p.window.sodaCommon))})(this,function(p,m,u,c,O){"use strict";var Me=Object.defineProperty;var Se=(p,m,u)=>m in p?Me(p,m,{enumerable:!0,configurable:!0,writable:!0,value:u}):p[m]=u;var a=(p,m,u)=>Se(p,typeof m!="symbol"?m+"":m,u);var A={exports:{}},b={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ee=m,te=Symbol.for("react.element"),ne=Symbol.for("react.fragment"),se=Object.prototype.hasOwnProperty,oe=ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,re={key:!0,ref:!0,__self:!0,__source:!0};function L(o,n,t){var s,e={},r=null,i=null;t!==void 0&&(r=""+t),n.key!==void 0&&(r=""+n.key),n.ref!==void 0&&(i=n.ref);for(s in n)se.call(n,s)&&!re.hasOwnProperty(s)&&(e[s]=n[s]);if(o&&o.defaultProps)for(s in n=o.defaultProps,n)e[s]===void 0&&(e[s]=n[s]);return{$$typeof:te,type:o,key:r,ref:i,props:e,_owner:oe.current}}b.Fragment=ne,b.jsx=L,b.jsxs=L,A.exports=b;var d=A.exports;function ie(o=16,n=""){const t=[];for(let s=0;s<o/4;s++)t.push((Math.random()*1e6>>0).toString(36));return t.join(n)}var j=(o=>(o[o.Property=0]="Property",o[o.String=1]="String",o[o.Number=2]="Number",o[o.Boolean=3]="Boolean",o[o.Color=4]="Color",o[o.Array=5]="Array",o[o.Tuple=6]="Tuple",o[o.Function=7]="Function",o[o.Method=8]="Method",o[o.Object=9]="Object",o))(j||{});function E(o){const n=o.match(/^@([^/]+)/);let t="";n&&(t=n[1].toLowerCase(),o=o[t.length+2].toUpperCase()+o.slice(t.length+3));const s=o.split(/-/).map((e,r)=>r===0&&t.length===0?e.toLowerCase():e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join("");return t?`${t}${s}`:s}function k(o){return(o==null?void 0:o.length)>0?o.split(".")[0]:"1"}function ae(o,n=""){return`${o??E(n)}`}function z(o,n){let t=null;for(;o;)if(o.tag===5&&(t=o.stateNode),o=o.return,n(o))return{fiber:o,element:t};return{fiber:null,element:null}}function ce(o){for(;o.tag!==5;)o=o.child;return o==null?void 0:o.stateNode}function pe(o,n){var i,l,h;const t=Object.keys(o).find(g=>g.startsWith("__reactFiber"));let s=z(o[t],n),e=s,r=null;for(;e.fiber;)!r&&((i=e.fiber)!=null&&i.type.__isContainer__)&&(r=e),r||(s=e),e=z(e.fiber,n);return{element:s.element,type:(l=s.fiber)==null?void 0:l.type,id:(h=s.fiber)==null?void 0:h.key}}const T=c.createRequest("",{useProxy:!1});var le=Object.defineProperty,de=(o,n,t,s)=>{for(var e=void 0,r=o.length-1,i;r>=0;r--)(i=o[r])&&(e=i(n,t,e)||e);return e&&le(n,t,e),e};class U extends c.BaseComponent{constructor(){super(...arguments);a(this,"a",9998)}render(){return d.jsx("div",{children:"多 setter 测试"})}}de([c.reactive],U.prototype,"a");class he extends c.BaseComponent{constructor(){super(...arguments);a(this,"onClick");a(this,"onSearch");a(this,"setText",(t={message:"服务端异常"})=>{console.log(t)})}getText(t){return console.log(t),""}render(){return d.jsx("div",{children:"事件、方法测试"})}}var ue=Object.defineProperty,q=(o,n,t,s)=>{for(var e=void 0,r=o.length-1,i;r>=0;r--)(i=o[r])&&(e=i(n,t,e)||e);return e&&ue(n,t,e),e};class $ extends c.BaseComponent{constructor(){super(...arguments);a(this,"str1","初始值");a(this,"str2");a(this,"num",2);a(this,"obj");a(this,"password");a(this,"bool",!0);a(this,"multiLine");a(this,"color","#409eff");a(this,"url","http://127.0.0.1:8080/img.png");a(this,"select","x3x");a(this,"radio");a(this,"tuple",["初始值",123]);a(this,"tupleWithLabel");a(this,"arr");a(this,"editor","");a(this,"onClick");a(this,"getText",()=>this.str1)}setText(t){this.str1=t}render(){return d.jsx("div",{className:"button",children:"TODO：所有类型测试"})}}q([c.reactive],$.prototype,"num"),q([c.reactive],$.prototype,"bool");var ge=Object.defineProperty,W=(o,n,t,s)=>{for(var e=void 0,r=o.length-1,i;r>=0;r--)(i=o[r])&&(e=i(n,t,e)||e);return e&&ge(n,t,e),e};class F extends c.BaseComponent{constructor(){super(...arguments);a(this,"str","初始值")}test(t){this.str=t}render(){return d.jsx("span",{children:this.str})}}W([c.reactive],F.prototype,"str");let Y=class extends F{constructor(){super(...arguments);a(this,"str","初始值");a(this,"str2","xx")}test(t){this.str=t}render(){return console.log(this.props,111),d.jsxs("span",{children:["继承测试：",this.str+"___"+this.str2]})}};W([c.reactive],Y.prototype,"str2");var me=Object.defineProperty,G=(o,n,t,s)=>{for(var e=void 0,r=o.length-1,i;r>=0;r--)(i=o[r])&&(e=i(n,t,e)||e);return e&&me(n,t,e),e};class fe extends c.BaseComponent{render(){return d.jsxs("div",{children:[d.jsx("div",{children:"sadsddd"})," ",this.props.children]})}}class M extends c.BaseComponent{constructor(){super(...arguments);a(this,"num",1);a(this,"num2",1)}render(){return console.log(this.props),d.jsxs("div",{children:["组件选中测试",d.jsx("button",{className:"button",onClick:()=>{this.num++},children:"aaa"}),d.jsx(fe,{children:d.jsx("span",{children:"sssss"})})]})}}G([c.reactive],M.prototype,"num"),G([c.reactive],M.prototype,"num2"),console.log(2222);class X extends c.TypeEditor{render(){return d.jsx(O.Input,{...this.props})}}a(X,"name","文本输入");class H extends c.TypeEditor{render(){return d.jsx(O.ColorPicker,{...this.props})}}a(H,"name","颜色选择器");class J extends c.TypeEditor{render(){return d.jsx(O.Switch,{...this.props})}}a(J,"name","布尔");class V extends c.TypeEditor{render(){return d.jsx(O.InputNumber,{...this.props})}}a(V,"name","数字输入");var ye=Object.defineProperty,ve=Object.getOwnPropertyDescriptor,v=(o,n,t,s)=>{for(var e=s>1?void 0:s?ve(n,t):n,r=o.length-1,i;r>=0;r--)(i=o[r])&&(e=(s?i(n,t,e):i(e))||e);return s&&e&&ye(n,t,e),e};class y{constructor(){a(this,"groups",[]);a(this,"propsMeta",{});a(this,"urls",[]);u.makeObservable(this)}init(n=[],t=[]){this.groups=n,this.groups.sort(({order:e=0},{order:r=0})=>+e-+r);const s={};for(let e=0;e<n.length;e++){const r=n[e];s[r.library]=t[e]}this.propsMeta=s}async register(n){const[t,s]=await Promise.all([Promise.all(n.map(e=>T.get(`${e}/manifest.json`))),Promise.all(n.map(e=>T.get(`${e}/prop-meta.json`)))]);this.init(t,s)}getPropMetas(n,t){var s;return((s=this.propsMeta[n])==null?void 0:s[t])??[]}get componentMeta(){return this.groups.map(n=>n.components.map(t=>({...t,displayName:t.displayName??t.componentName,packageName:n.library,packageVersion:n.version}))).reduce((n,t)=>n.concat(t),[])}get componentMap(){const n={};return this.groups.forEach(t=>{const{library:s,name:e,version:r}=t,i=`${ae(s,e)}${k(r)}`,l=window[i];!n[s]&&l&&(n[s]=[l])}),Object.keys(n).length?n:{sodaBase1:{Span:M,A:Y,Button:$,EventTest:he,MixinTest:U,version:"1.0.0"}}}getEditors(n){const t=s=>{switch(s){case j.Number:return V;case j.Color:return H;case j.Boolean:return J;case j.String:default:return X}};return n.map((s,e)=>{const r=t(s.type);return{editor:()=>r,status:e===0}})}}v([c.reactive],y.prototype,"groups",2),v([c.reactive],y.prototype,"propsMeta",2),v([c.reactive],y.prototype,"urls",2),v([u.action],y.prototype,"init",1),v([u.action],y.prototype,"register",1),v([u.action],y.prototype,"getPropMetas",1),v([c.computed],y.prototype,"componentMeta",1),v([c.computed],y.prototype,"componentMap",1),v([u.action],y.prototype,"getEditors",1);var Pe=Object.defineProperty,Ne=Object.getOwnPropertyDescriptor,S=(o,n,t,s)=>{for(var e=s>1?void 0:s?Ne(n,t):n,r=o.length-1,i;r>=0;r--)(i=o[r])&&(e=(s?i(n,t,e):i(e))||e);return s&&e&&Pe(n,t,e),e};class C{constructor(){a(this,"uiPlugins",{});a(this,"uiPluginSorted",!1);u.makeObservable(this)}async register(n,t,s={allowOverride:!1}){const e=async(r,i)=>{r.pluginName=t;const{placement:l}=r,{allowOverride:h}=i,{uiPlugins:g}=this;this.uiPluginSorted=!1,g[l]||(g[l]=[]);const _=g[l].findIndex(P=>P().pluginName===r.pluginName);if(_>=0){if(!h)throw new Error(`UIPlugin with name ${t} exists`);g[l][_]=()=>r;return}g[l].push(()=>r)};if(!Array.isArray(n))e(n,s);else for(const r of n)e(r,s)}getUiPluginsByPlacement(n,t){var e;if(!this.uiPluginSorted)for(const r in t)t[r].sort((i,l)=>{const{groupIndex:h,priority:g}=i(),{groupIndex:_,priority:P}=l();return h!==_?h-_:g-P});const s={};return(e=t[n])==null||e.forEach(r=>{const{groupIndex:i=0}=r();s[i]||(s[i]=[]),s[i].push(r)}),Object.keys(s).sort((r,i)=>Number(r)-Number(i)).map(r=>({groupCode:"group-"+r,plugins:s[r]}))}}S([c.reactive],C.prototype,"uiPlugins",2),S([u.action],C.prototype,"register",1),S([u.action],C.prototype,"getUiPluginsByPlacement",1);var _e=Object.defineProperty,xe=Object.getOwnPropertyDescriptor,D=(o,n,t,s)=>{for(var e=s>1?void 0:s?xe(n,t):n,r=o.length-1,i;r>=0;r--)(i=o[r])&&(e=(s?i(n,t,e):i(e))||e);return s&&e&&_e(n,t,e),e};class x{constructor(){a(this,"device","PC");a(this,"scenario","WEB");a(this,"mode","DESIGN");a(this,"$project_name","soda");u.makeObservable(this)}get designMode(){return this.mode==="DESIGN"}async init(n){this.device=n.device??"PC",this.mode=n.mode??"DESIGN",this.scenario=n.scenario??"WEB"}}D([c.reactive],x.prototype,"device",2),D([c.reactive],x.prototype,"scenario",2),D([c.reactive],x.prototype,"mode",2),D([c.reactive],x.prototype,"$project_name",2),D([u.computed],x.prototype,"designMode",1),D([u.action],x.prototype,"init",1);class B{static $on(n,t,s={allowOverride:!0}){f.event.on(n,t,s)}static $emit(n,...t){f.event.emit(n,...t)}}class K extends c.Component{$on(n,t,s={allowOverride:!0}){B.$on(n,t,s)}$emit(n,...t){B.$emit(n,...t)}}class Q{constructor(){a(this,"destroy");a(this,"priority",0);a(this,"uniqueName","");a(this,"exec");a(this,"mode","ALL")}}function I(o,n={}){const t=f.plugin.uiPlugins;return f.plugin.getUiPluginsByPlacement(o,t).map(({plugins:e})=>e.map((r,i)=>{const l=r(),h=`${o}-plugin-${l.pluginName}-${i}`;return m.createElement(l,{...n,key:h})}))}class De{constructor(){a(this,"logicPluginMap",{})}on(n,t,s={allowOverride:!1}){const e=(i,l)=>{const{logicPluginMap:h}=this;h[i]||(h[i]=[]);const g=l.uniqueName??n,_=h[i].findIndex(P=>(g==null?void 0:g.length)>0&&P.uniqueName===g||P.exec===l.exec);if(_>=0){s.allowOverride||console.warn(`LogicPlugin with name ${g} exist`),h[i][_]=l;return}h[i].push(l),h[i].sort((P,$e)=>P.priority-$e.priority)},r=(i,l)=>{if(typeof i=="function"){const h=new Q;return h.exec=i,h.uniqueName=l,h}return i};Array.isArray(n)?n.forEach(i=>{e(i,r(t,i))}):e(n,r(t,n))}async off(n,t){var r;const{logicPluginMap:s}=this,e=s[n].findIndex(i=>i===t);if(e>=0){const i=s[n][e];await((r=i.destroy)==null?void 0:r.call(i)),s[n].splice(e,1)}}async emit(n,...t){if(!n||n.length===0)return;const s=async e=>{for(const r of this.logicPluginMap[e]??[])await r.exec(...t??[])};if(Array.isArray(n))for(const e of n)await s(e);else await s(n)}}var je=Object.defineProperty,we=Object.getOwnPropertyDescriptor,R=(o,n,t,s)=>{for(var e=s>1?void 0:s?we(n,t):n,r=o.length-1,i;r>=0;r--)(i=o[r])&&(e=(s?i(n,t,e):i(e))||e);return s&&e&&je(n,t,e),e};class w{constructor(){a(this,"schema",{components:[{package:"@soda/base",version:"1.0.0",componentName:"A"},{package:"@soda/base",version:"1.0.0",componentName:"Button"},{package:"@soda/base",version:"1.0.0",componentName:"Span"},{package:"@soda/base",version:"1.0.0",componentName:"EventTest"},{package:"@soda/base",version:"1.0.0",componentName:"MixinTest"}],componentsTree:[{componentName:"Page",id:"aqasiz7lkk7a3dy222z1",children:[{componentName:"A",id:"aqasiz7lkk7a3dyz1",props:{}},{componentName:"EventTest",id:"aqasiz7lkk7a3dyz12",props:{}},{componentName:"Button",id:"kje68elzgza63nve2",props:{}},{componentName:"A",id:"aqasiz7lkk7a3dyz",props:{}},{componentName:"Span",id:"kje68elzgza63nve",props:{}},{componentName:"MixinTest",id:"kje68elzgza63nv11e",props:{}}]}]});u.makeObservable(this)}getNodeSchemaById(n){const t=s=>{for(const e of s){if(e.id===n)return e;if(Array.isArray(e.children)){const r=t(e.children);if(r)return r}}return null};return t(this.schema.componentsTree)}getNextNodeSchemaById(n){const t=s=>{for(let e=0;e<s.length;e++){const r=s[e];if(r.id===n)return e<s.length-1?s[e+1]:null;if(Array.isArray(r.children)){const i=t(r.children);if(i)return i}}return null};return t(this.schema.componentsTree)}getLibraryByComponentName(n,t){const s=this.schema.components.map(({package:e,version:r,componentName:i})=>{const l=E(e)+k(r);return{packageName:e,version:r,componentName:i,libName:l,component:t[l][i]}}).find(e=>e.component===n)??{libName:null,componentName:null};return{packageName:s.libName,componentName:s.componentName}}getParents(n){const t=[],s=e=>{for(let r=0;r<e.length;r++){const i=e[r];if(i.id===n)break;Array.isArray(i.children)&&(t.push(i),s(i.children))}};return s(this.schema.componentsTree),t.length===0&&t.push(this.schema.componentsTree[0]),t}getParent(n){const t=this.getParents(n);return(t==null?void 0:t.length)>0?t[0]:null}deleteNode(n){const t=this.getParent(n),s=t.children.findIndex(r=>r.id===n),e=t.children[s];return t.children.splice(s,1),e}setSchema(n){this.schema=n}insertNodeSchema(n,t){const s=this.getParent(t.id),e=s.children.findIndex(i=>i.id===t.id),r={id:ie(),...n};e===-1?s.children.push(r):s.children.splice(e,0,r),this.schema={...this.schema}}}R([c.reactive],w.prototype,"schema",2),R([u.action],w.prototype,"deleteNode",1),R([u.action],w.prototype,"setSchema",1),R([u.action],w.prototype,"insertNodeSchema",1);const f={package:new y,plugin:new C,environment:new x,event:new De,page:new w};class Z extends c.Component{render(){var l,h;const{style:n={}}=this.props,{x:t,y:s,width:e,height:r}=((h=(l=this.props.designNode)==null?void 0:l.element)==null?void 0:h.getBoundingClientRect())??{x:0,y:0,width:0,height:0,style:{}},i=!(e===0||r===0);return d.jsx("div",{className:"soda-borderBox",style:{pointerEvents:"none",...n,position:"absolute",left:t,top:s,width:e,height:r,outline:`${this.props.borderWidth??2}px ${this.props.borderStyle} rgb(44, 115, 253)`,display:i?"block":"none"},children:this.props.itemRender})}}class Oe extends c.Component{render(){return d.jsx(Z,{borderStyle:"solid",designNode:this.props.designNode})}}var be=Object.defineProperty,Ce=Object.getOwnPropertyDescriptor,N=(o,n,t,s)=>{for(var e=s>1?void 0:s?Ce(n,t):n,r=o.length-1,i;r>=0;r--)(i=o[r])&&(e=(s?i(n,t,e):i(e))||e);return s&&e&&be(n,t,e),e};p.PageDesigner=class extends K{constructor(){super(...arguments);a(this,"positionRef",m.createRef());a(this,"webRenderRef",m.createRef());a(this,"dragDomRef",m.createRef());a(this,"componentMap",f.package.componentMap);a(this,"designNode");a(this,"hoverNode");a(this,"moveNode");a(this,"offsetX",0);a(this,"offsetY",0);a(this,"chooseNode",t=>{const s=f.page.getLibraryByComponentName(t.type,this.componentMap);t.componentName=s.componentName,t.libary=s.packageName,this.$emit("designNode:change",t,this.webRenderRef.current.$refs[t.id]),this.designNode=t});a(this,"refreshDesignNode",()=>{this.designNode={...this.designNode}});a(this,"hidePositionRef",()=>{this.positionRef.current.style.height="0px"});a(this,"changePositionRef",t=>{t.preventDefault();const s=this.findDesignInfoByDOM(t.target);let e=s.element.previousElementSibling;if(s.type.__isContainer__){const g=s.element.childNodes;e=g[g.length-1]}const{x:r,y:i,height:l,width:h}=(e??s.element).getBoundingClientRect();this.positionRef.current.style.top=`${i}px`,this.positionRef.current.style.left=`${r+(e?h:0)-4}px`,this.positionRef.current.style.height=`${l}px`});a(this,"changeDragDOMRef",t=>{var s;(s=this.moveNode)!=null&&s.componentName&&(this.dragDomRef.current.style.left=t.clientX-this.offsetX+"px",this.dragDomRef.current.style.top=t.clientY-this.offsetY+"px",this.dragDomRef.current.innerHTML=this.moveNode.componentName,this.dragDomRef.current.style.display="inline")});a(this,"insertComponent",t=>{const s=JSON.parse(t.dataTransfer.getData("componentMeta")),e=this.findDesignInfoByDOM(t.target);f.page.insertNodeSchema(s,e),this.hidePositionRef()});a(this,"onPointerUp",t=>{const s=this.findDesignInfoByDOM(t.target);if(this.moveNode&&this.moveNode.id!==s.id){const e=f.page.deleteNode(this.moveNode.id);f.page.insertNodeSchema(e,s)}this.dragDomRef.current.style.display="none",this.hidePositionRef(),this.moveNode=null,setTimeout(()=>this.refreshDesignNode())});a(this,"onPointerLeave",()=>{this.hoverNode=null});a(this,"onPointerMove",t=>{t.preventDefault(),this.moveNode?(this.changePositionRef(t),this.changeDragDOMRef(t)):this.hoverNode=this.findDesignInfoByDOM(t.target)});a(this,"onPointerDown",t=>{const s=this.findDesignInfoByDOM(t.target);s&&(this.offsetX=t.clientX-s.element.getBoundingClientRect().left,this.offsetY=t.clientY-s.element.getBoundingClientRect().top,this.moveNode=s,this.chooseNode(s))});a(this,"findDesignInfoByDOM",t=>pe(t,e=>(e==null?void 0:e.tag)==1&&(e==null?void 0:e.type.__sodaComponent)))}render(){return d.jsxs("div",{className:`${f.environment.$project_name}-designer-main`,onPointerLeave:this.onPointerLeave,onDragLeave:this.hidePositionRef,onDragOver:this.changePositionRef,onPointerMove:this.onPointerMove,onPointerUp:this.onPointerUp,onDrop:this.insertComponent,onPointerDown:this.onPointerDown,children:[d.jsx(c.WebRender,{ref:this.webRenderRef,schema:f.page.schema,componentMap:this.componentMap}),d.jsxs("div",{className:"design-tool",children:[d.jsx(Oe,{designNode:this.designNode}),d.jsx(Z,{designNode:this.hoverNode,borderWidth:1,borderStyle:"dashed"}),d.jsx("div",{ref:this.dragDomRef,style:{padding:"8px 10px",boxShadow:"0px 0px 2px 2px #eeeeee",color:"#555555",position:"absolute",pointerEvents:"none"}}),d.jsx("span",{ref:this.positionRef,style:{borderLeft:"4px solid #1772f6",position:"absolute"}})]})]})}componentDidMount(){this.$on("designNode:propsChange",(t,s)=>{const e=f.page.getNodeSchemaById(this.designNode.id);e.props[t]=s,this.webRenderRef.current.modifyNodeProps(this.designNode.id,t,s),setTimeout(()=>this.refreshDesignNode())}),this.$on("designNode:changeDesignNodeById",t=>{const e=this.webRenderRef.current.$refs[t]._reactInternals,r=ce(e);this.chooseNode({element:r,type:e==null?void 0:e.type,id:e==null?void 0:e.key})})}},N([c.reactive],p.PageDesigner.prototype,"designNode",2),N([c.reactive],p.PageDesigner.prototype,"hoverNode",2),N([c.action],p.PageDesigner.prototype,"chooseNode",2),N([c.action],p.PageDesigner.prototype,"refreshDesignNode",2),N([c.action],p.PageDesigner.prototype,"onPointerUp",2),N([c.action],p.PageDesigner.prototype,"onPointerLeave",2),N([c.action],p.PageDesigner.prototype,"onPointerMove",2),p.PageDesigner=N([c.Widget],p.PageDesigner);class Re extends c.Component{render(){return d.jsxs("div",{className:`${f.environment.$project_name}-designer`,style:this.props.style,children:[d.jsx("div",{className:`${f.environment.$project_name}-designer-left`,style:{width:240,height:"100%"},children:I("left")}),d.jsx(p.PageDesigner,{}),d.jsx("div",{className:`${f.environment.$project_name}-designer-right`,style:{width:300,height:"100%"},children:I("right")})]})}}p.App=Re,p.Event=B,p.LogicPlugin=Q,p.UIPlugin=K,p.globalState=f,p.pluginRunder=I,Object.defineProperty(p,Symbol.toStringTag,{value:"Module"})});