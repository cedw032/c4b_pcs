(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{34:function(e,n,t){e.exports=t(67)},39:function(e,n,t){},62:function(e,n){},66:function(e,n,t){},67:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),c=t(30),o=t.n(c),u=(t(39),t(1)),s=t(31),l=t.n(s).a.connect(),i=function(e){return Object(a.useEffect)(function(){return Object.entries(e).forEach(function(e){var n=Object(u.a)(e,2),t=n[0],a=n[1];l.on(t,a)}),function(){Object.entries(e).forEach(function(e){var n=Object(u.a)(e,2),t=n[0],a=n[1];l.removeEventListener(t,a)})}},[]),l},m=t(8),f=t.n(m),p=t(33),E=t(32),b=t(16),v=t.n(b),O=function(e,n){var t=Object(a.useState)([]),r=Object(u.a)(t,2),c=r[0],o=r[1],s=function(e){return o([].concat(Object(E.a)(c),[Object(p.a)({},e,{at:v()(e.at)})]))};console.log("peer",n);var l=i({message:function(e){return console.log("MESSAGE",e)||e.from==n&&s(e)}});return[c,function(t){s({content:t,at:v()().toISOString(),from:e}),l.emit("message",{to:n,content:t})}]},j=function(e){var n=e.username,t=e.endClient,c=O(n,t),o=Object(u.a)(c,2),s=o[0],l=o[1],i=Object(a.useState)(""),m=Object(u.a)(i,2),p=m[0],E=m[1],b=function(e){return f()("message",e.from===n&&"self",e.from!==n&&"peer")};return r.a.createElement("div",{className:"panel message-box"},s.map(function(e,n){return r.a.createElement("div",{key:n,className:b(e)},r.a.createElement("span",null,e.at.format("h:mma")," - "),r.a.createElement("span",null,e.from,": "),r.a.createElement("span",null,e.content))}),r.a.createElement("input",{value:p,onChange:function(e){return E(e.target.value)},onKeyDown:function(e){"Enter"===e.key&&(l(p),E(""))}}))},d=function(e){var n=Object(a.useState)(!1),t=Object(u.a)(n,2),c=t[0],o=t[1];return Object(a.useEffect)(function(){return function(){c&&clearTimeout(c)}},[c]),r.a.createElement("button",Object.assign({},e,{onClick:function(n){e.onClick&&e.onClick(),c&&clearTimeout(c),o(setTimeout(function(){o(!1)},140))},className:f()(e.className,c&&"clicked")}))},g=function(e){var n=e.onLogin,t=Object(a.useState)(),c=Object(u.a)(t,2),o=c[0],s=c[1],l=Object(a.useState)({username:"",password:""}),m=Object(u.a)(l,2),f=m[0],p=m[1],E=Object(a.useRef)();E.current=f;var b=i({login:function(e){if(e)s(e);else{var t=E.current;n(t.username)}}}),v=f.username,O=f.password;return r.a.createElement("div",{className:"panel"},o&&r.a.createElement("span",{className:"error"},o),r.a.createElement("div",{className:"row"},r.a.createElement("span",null,"username"),r.a.createElement("input",{value:v,onChange:function(e){return p({username:e.target.value,password:O})}})),r.a.createElement("div",{className:"row"},r.a.createElement("span",null,"password"),r.a.createElement("input",{value:O,onChange:function(e){return p({username:v,password:e.target.value})}})),r.a.createElement(d,{children:"Login",onClick:function(){b.emit("login",{username:v,password:O})}}))};t(66);var w=function(){var e=Object(a.useState)(""),n=Object(u.a)(e,2),t=n[0],c=n[1],o=Object(a.useState)([]),s=Object(u.a)(o,2),l=s[0],m=s[1];return i({endClients:m}),t?r.a.createElement("div",{className:"app"},r.a.createElement("div",{className:"panel"},l.map(function(e,n){return r.a.createElement(j,{key:n,username:t,endClient:e})}))):r.a.createElement(g,{onLogin:c})};o.a.render(r.a.createElement(w,null),document.getElementById("root"))}},[[34,1,2]]]);
//# sourceMappingURL=main.0623caae.chunk.js.map