(function(s,a){arguments[0]["sodaCore"] = {"version":"1.0.0"}; typeof exports=="object"&&typeof module<"u"?a(exports,require("react"),require("mobx"),require("mobx-react"),require("axios")):typeof define=="function"&&define.amd?define(["exports","react","mobx","mobx-react","axios"],a):(s=typeof globalThis<"u"?globalThis:s||self,a(s.sodaCore=s.sodaCore||{},s.window.React,s.window.mobx,s.window.mobxReact,s.axios))})(this,function(s,a,d,g,m){"use strict";var I=Object.defineProperty;var H=(s,a,d)=>a in s?I(s,a,{enumerable:!0,configurable:!0,writable:!0,value:d}):s[a]=d;var C=(s,a,d)=>H(s,typeof a!="symbol"?a+"":a,d);var j={exports:{}},p={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var O=a,R=Symbol.for("react.element"),T=Symbol.for("react.fragment"),_=Object.prototype.hasOwnProperty,E=O.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,S={key:!0,ref:!0,__self:!0,__source:!0};function x(n,e,t){var r,o={},u=null,c=null;t!==void 0&&(u=""+t),e.key!==void 0&&(u=""+e.key),e.ref!==void 0&&(c=e.ref);for(r in e)_.call(e,r)&&!S.hasOwnProperty(r)&&(o[r]=e[r]);if(n&&n.defaultProps)for(r in e=n.defaultProps,e)o[r]===void 0&&(o[r]=e[r]);return{$$typeof:R,type:n,key:u,ref:c,props:o,_owner:E.current}}p.Fragment=T,p.jsx=x,p.jsxs=x,j.exports=p;var i=j.exports;class h extends a.Component{constructor(){super(...arguments);C(this,"state",{})}get mode(){return this.props.mode}setState(){throw new Error("setState is not allowed")}componentDidCatch(t,r){console.log(t,r)}}class P extends h{get canDesign(){return this.props.mode==="DESIGN"}render(){const{placeholder:e="拖拽组件到此",className:t="",style:r}=this.props,{children:o}=this.props;return this.canDesign?i.jsx("div",{style:r,className:`${t}`,children:(o==null?void 0:o.length)>0?o:i.jsx("div",{className:"default-page-containerEmpty",children:i.jsx("div",{className:"default-page-containerPlaceholder",children:e})})}):i.jsx(i.Fragment,{children:o})}}class ${render(){throw new Error("Method not implemented.")}}function U(n){return g.observer.call(n,n),class extends n{constructor(e){super(e),d.makeObservable(this)}}}async function q(n){return n.status===200?n.data.code===200?n.data.data:n.data:n}class N{constructor(e="",t=q,r=!0){this.baseUrl=e,this.responseHandler=t,this.useProxy=r}async request(e,t){t.headers||(t.headers={}),t.headers["origin-url"]=e;const r=this.useProxy?await m("/soda-app",t):await m(e,t);return this.responseHandler(r)}get(e,t={},r={}){return this.request(`${this.baseUrl}${e}`,{method:"GET",...r,params:t})}delete(e,t={},r={}){return this.request(`${this.baseUrl}${e}`,{method:"DELETE",...r,data:t})}post(e,t={},r={}){return this.request(`${this.baseUrl}${e}`,{method:"POST",...r,data:t})}put(e,t={},r={}){return this.request(`${this.baseUrl}${e}`,{method:"PUT",...r,data:t})}upload(e,t={},r={}){const o={"Content-Type":"multipart/form-data"};return this.request(`${this.baseUrl}${e}`,{method:"POST",...r,data:t,headers:o})}}function M(n,{responseHandler:e,useProxy:t}={}){return new N(n,e,t)}const k=m;function D(n){const e=n.match(/^@([^/]+)/);let t="";e&&(t=e[1].toLowerCase(),n=n[t.length+2].toUpperCase()+n.slice(t.length+3));const r=n.split(/-/).map((o,u)=>u===0&&t.length===0?o.toLowerCase():o.charAt(0).toUpperCase()+o.slice(1).toLowerCase()).join("");return t?`${t}${r}`:r}function L(n){return(n==null?void 0:n.length)>0?n.split(".")[0]:"1"}class w extends h{render(){const{children:e}=this.props;return i.jsx("div",{className:"default-page",children:e})}}class W extends h{constructor(){super(...arguments);C(this,"refsMap",{})}get $refs(){return this.refsMap}getComponent(t,r){const o=({package:l,version:f,componentName:b})=>{const y=D(l)+L(f);return r[y][b]},u=this.props.schema.components.find(({componentName:l})=>t===l);let c=u?o(u):null;return c||(t==="Page"?c=w:c=a.forwardRef(()=>i.jsxs("div",{children:[t,"组件不存在"]}))),c}schemasToComponent(t,r=this.props.componentMap){return t.map(o=>{const{componentName:u,id:c,children:l,props:f={},advanced:{isContainer:b=!0}={isContainer:!0}}=o,y=this.getComponent(u,r),v=Array.isArray(l)?this.schemasToComponent(l,r):null;return i.jsx(y,{id:c,...f,ref:F=>this.refsMap[c]=F,children:b?i.jsx(P,{children:v}):v},c)})}}class A extends W{render(){const{componentsTree:e}=this.props.schema;return i.jsx(i.Fragment,{children:this.schemasToComponent(e)})}}Object.defineProperty(s,"action",{enumerable:!0,get:()=>d.action}),Object.defineProperty(s,"computed",{enumerable:!0,get:()=>d.computed}),Object.defineProperty(s,"makeObservable",{enumerable:!0,get:()=>d.makeObservable}),Object.defineProperty(s,"reactive",{enumerable:!0,get:()=>d.observable}),Object.defineProperty(s,"Provider",{enumerable:!0,get:()=>g.Provider}),s.Component=h,s.Container=P,s.Page=w,s.ReactRenderer=$,s.WebRender=A,s.Widget=U,s.axios=k,s.createRequest=M,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})});
