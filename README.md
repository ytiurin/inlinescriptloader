# Inline module loader

Javascript module loader that denies a module definition relying on a file-as-module assumption and implements the `import`-like dependency injections. It downloads javascript module via `XHR`, executes it with the `new Function` constructor and cache it in browser's local storage.

## Usage

```html
<!-- Inline script loader v0.2 --><script type="text/javascript">(function(){function q(a,b,c){for(var d=-1,e=a[f];e--;)if(a[e][b]===c){d=e;break}return d}function r(a){return-1<[4,5][h](parseInt(a/100))}function s(a,b,c,d){var e=new XMLHttpRequest;e[m]=b,e.d=c,e.onload=d,e.open(a,b,!0),e.send()}function t(b){for(var e,f,i,j,c=[],d=b.replace(/'|"/g,'"');-1<(e=d[h](a,e));e=f+1)i={},f=d[h]('"',e+1),j=d.substring(e,f).split(" "),j[1]&&(i[m]=j[1],"from"===j[2]&&j[3]&&(i.name=j[1],i[m]=j[3])),c[g](0,0,i);return c}function u(a,b){var f=this.ch;s("get",a,{},function(){var g=this;if(r(g.status))d[e]("Failed loading "+a+": "+g.statusText);else{if(f&&c)try{c.setItem(a+"[text]",g[i]),c.setItem(a+"[time]",g[j](k))}catch(h){d.warn("Caching script failed because: "+h[l])}b[o](g)}})}function v(a,b){for(var c=0;c<a[f];c++){for(var h=q(b,m,a[c]),i=[],j=[],k=b[h][n],r=0;r<k[f];r++)if(k[r].name){var s=q(b,m,k[r][m]);i[g](0,0,k[r].name),j[g](0,0,b[s][p])}var t=new Function(i,b[h].text);try{b[h][p]=t[o]({},j)}catch(u){d[e]("Error executing script "+b[h].url+": "+u[l])}}var v=this;try{v.uc&&v.uc[o]({},v.up.map(function(a){return b[q(b,"path",a)][p]}))}catch(u){d[e]("Error executing user callback: "+u[l])}}function w(){function a(){w&&1>E&&1>z&&(d.log(D),d.table(A))}function e(b,c,d){var e={};e[m]=b,e.text=c,e[n]=t(c),e.source=d,A[g](0,0,e);for(var i,j,k,p=e[n][f];p--;)k=e[n][p][m],j=D[h](b),-1<(i=D[h](k))?i>j&&(D[g](i,1),D[g](j,0,k)):(E++,D[g](j,0,k),l(k));--E<1&&(a(),v.bind({uc:o,up:C})(D,A))}function l(b){var d,f;p&&c&&null!==(d=c.getItem(b+"[text]"))&&null!==(f=c.getItem(b+"[time]"))?(e(b,d,"local"),z++,s("head",b,{time:f},function(){var b=this;r(b.status)||b[j](k)===b.d.time?(z--,a()):B(b[m],function(){var c;-1<(c=q(A,m,b[m]))&&(A[c].source="late remote"),z--,a(),1>z&&x&&x()})})):B(b,function(){e(this[m],this[i],"remote")})}var o,x,p=!0,w=!1,y=arguments,z=0,A=[];y[1]&&("function"==typeof y[1]?o=y[1]:(b===(p=y[1].cache)&&(p=!0),b===(w=y[1].debug)&&(w=!1),x=y[1].onLateCache)),y[2]&&(o=y[2]);for(var B=u.bind({ch:p}),C=y[0].slice&&y[0].slice(0)||[y[0]],D=C.slice(0),E=D[f],F=D[f];F--;)l(D[F])}var b,c,a='"import ',d=console,e="error",f="length",g="splice",h="indexOf",i="responseText",j="getResponseHeader",k="last-modified",l="message",m="path",n="dependencies",o="apply",p="result";try{c=localStorage}catch(x){d.warn("Caching disabled because: "+x[l])}return w[o]({},arguments),w})
('myapp.js');
</script>
```
> Notice: You can copy/paste the above loader code as is and use it in you project.

```javascript
//myapp.js
'import jquery.js';
'import myModule from mymodule.js';

$(document).ready(function(){
  myModule.sayHello();
});
```

```javascript
//mymodule.js
return {
  sayHello:function(){
    alert('Hello world');
  }
};
```

## Configuration

To configure loader, you should pass arguments to it's constructor function.
```javascript
(function(){/*INLINE SCRIPT LOADER CODE*/})
(path[[, options], scriptsLoadedHandler]);
```

### Parameters

**path**

String or array of strings containing path(s) to javascript file(s).

**options**

Object containing configuration options. See **Possible options**.

**scriptsLoadedHandler**

Function to execute when all js files are loaded. Function recieve the result of the last executed script as an argument.

#### Possible options

**cache**

If `false`, loader will always download js files from the remote server, ignoring the local cache. Default is `true`.

**debug**

If `true`, loader will output debugging data to a console. Default is `false`.
