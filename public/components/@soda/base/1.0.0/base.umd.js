(function(t,a){arguments[0]["sodaBase1"] = {"version":"1.0.0"}; typeof exports=="object"&&typeof module<"u"?a(exports,require("react"),require("@soda/core")):typeof define=="function"&&define.amd?define(["exports","react","@soda/core"],a):(t=typeof globalThis<"u"?globalThis:t||self,a(t.sodaBase1=t.sodaBase1||{},t.window.React,t.window.sodaCore))})(this,function(t,a,u){"use strict";var A=Object.defineProperty;var E=(t,a,u)=>a in t?A(t,a,{enumerable:!0,configurable:!0,writable:!0,value:u}):t[a]=u;var s=(t,a,u)=>E(t,typeof a!="symbol"?a+"":a,u);var v={exports:{}},f={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var j=a,O=Symbol.for("react.element"),y=Symbol.for("react.fragment"),b=Object.prototype.hasOwnProperty,P=j.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,w={key:!0,ref:!0,__self:!0,__source:!0};function _(o,e,i){var n,r={},d=null,p=null;i!==void 0&&(d=""+i),e.key!==void 0&&(d=""+e.key),e.ref!==void 0&&(p=e.ref);for(n in e)b.call(e,n)&&!w.hasOwnProperty(n)&&(r[n]=e[n]);if(o&&o.defaultProps)for(n in e=o.defaultProps,e)r[n]===void 0&&(r[n]=e[n]);return{$$typeof:O,type:o,key:d,ref:p,props:r,_owner:P.current}}f.Fragment=y,f.jsx=_,f.jsxs=_,v.exports=f;var l=v.exports,x=Object.defineProperty,C=Object.getOwnPropertyDescriptor,c=(o,e,i,n)=>{for(var r=n>1?void 0:n?C(e,i):e,d=o.length-1,p;d>=0;d--)(p=o[d])&&(r=(n?p(e,i,r):p(r))||r);return n&&r&&x(e,i,r),r};t.Button=class extends u.Component{constructor(){super(...arguments);s(this,"str1","初始值");s(this,"str2");s(this,"num",2);s(this,"obj");s(this,"password");s(this,"bool",!0);s(this,"multiLine");s(this,"color","#409eff");s(this,"url","http://127.0.0.1:8080/img.png");s(this,"select","x3x");s(this,"radio");s(this,"tuple",["初始值",123]);s(this,"tupleWithLabel");s(this,"arr");s(this,"editor","");s(this,"onClick");s(this,"getText",()=>this.str1)}setText(i){this.str1=i}render(){return l.jsx("div",{className:"button",children:"按钮111"})}},c([u.reactive],t.Button.prototype,"num",2),c([u.reactive],t.Button.prototype,"bool",2),t.Button=c([u.Widget],t.Button);var S=Object.defineProperty,B=Object.getOwnPropertyDescriptor,h=(o,e,i,n)=>{for(var r=n>1?void 0:n?B(e,i):e,d=o.length-1,p;d>=0;d--)(p=o[d])&&(r=(n?p(e,i,r):p(r))||r);return n&&r&&S(e,i,r),r};t.A=class extends u.Component{constructor(){super(...arguments);s(this,"str","初始值")}test(i){this.str=i}render(){return l.jsx("span",{children:this.str})}},h([u.reactive],t.A.prototype,"str",2),t.A=h([u.Widget],t.A);var R=Object.defineProperty,D=Object.getOwnPropertyDescriptor,m=(o,e,i,n)=>{for(var r=n>1?void 0:n?D(e,i):e,d=o.length-1,p;d>=0;d--)(p=o[d])&&(r=(n?p(e,i,r):p(r))||r);return n&&r&&R(e,i,r),r};class T extends u.Component{render(){return l.jsxs("div",{children:[l.jsx("div",{children:"sadsddd"})," ",this.props.children]})}}t.Span=class extends u.Component{constructor(){super(...arguments);s(this,"num",1)}render(){return console.log(this.props),l.jsxs("div",{children:[l.jsx("button",{className:"button",onClick:()=>{this.num++},children:"aaa"}),l.jsx(T,{children:l.jsx("span",{children:"sssss"})})]})}},m([u.reactive],t.Span.prototype,"num",2),t.Span=m([u.Widget],t.Span);const $=1;function g(o,e){return o+e}t.a=$,t.add=g,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})});