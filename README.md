# Inline script loader

Script loader that does not require a module definition and implements the `import`-like dependency injections. It downloads code via `XHR`, executes it using the `new Function` constructor and cache it in the browser's local storage.

## Usage

```html
<!-- Inline script loader v0.1 --><script type="text/javascript">!function(){function y(a){return-1<[4,5][n](parseInt(a/100))}function z(a,b,c){var d=new XMLHttpRequest;d[x]=e++,d.onload=function(){f--,c.apply(this,arguments)},d.open(a,b,!0),f++,d.send()}function A(d){for(var e=[],g=c[k];g--;)c[g].url===d.url&&c[m](g,1);for(var i,j,l,p,h=d.text.replace(/'|"/g,'"');-1<(i=h[n](a,i));i=j+1)l={},j=h[n]('"',i+1),p=h[o](i,j).split(" "),p[1]&&(l.path=p[1],"from"===p[2]&&p[3]&&(l.name=p[1],l.path=p[3]),b[m](0,0,l.path));d[w]=e,c[m](0,0,d),1>f&&D()}function B(a){z("get",a,function(){if(y(this.status))i[j]("Failed loding "+a+": "+this.statusText);else{if(G.cache&&h)try{h[q](a+"[url]",this[r]),h[q](a+"[text]",this[s]),h[q](a+"[time]",this[t](u))}catch(b){i.warn("Caching script failed because: "+b[v])}A({order:this[x],url:this[r],text:this[s],source:"remote"})}})}function C(a){var b,c,d,e=G.cache&&h&&null!==(b=h[p](a+"[url]"))&&null!==(c=h[p](a+"[text]"))&&null!==(d=h[p](a+"[time]"));return e&&z("head",a,function(){var e=this[t](u)!==d;!y(this.status)&&e?B(a):A({order:this[x],url:b,text:c,source:"local"})}),e}function D(){if(b[k])for(var a;b[k];)a=b[m](0,1),C(a)||B(a);else{c=c.sort(function(a,b){return a[x]<b[x]});for(var e,f,g,h=0;h<c[k];h++){g=c[h][w],e={aNs:[],aVs:[]};for(var n=0;n<g[k];n++)for(var o=c[k];o--;)if(d[g[n].path]===c[o].url){e.aNs[l](g[n].name),e.aVs[l](c[o].result);break}f=new Function(e.aNs,c[h].text);try{c[h].result=f.apply({},e.aVs)}catch(p){i[j]("Error executing script "+c[h].url+": "+p[v])}}try{H&&H(c[0].result)}catch(p){i[j]("Error executing user callback: "+p[v])}G.debug&&i.table(c)}}var h,a='"import ',b=[],c=[],d={},e=0,f=0,g=arguments,i=console,j="error",k="length",l="push",m="splice",n="indexOf",o="substring",p="getItem",q="setItem",r="responseURL",s="responseText",t="getResponseHeader",u="last-modified",v="message",w="dependencies",x="order";try{h=localStorage}catch(E){i.warn("Caching disabled because: "+E[v])}var H,F=g[0],G={};F&&(Array.isArray(F)?b=F[m](0).reverse():b[m](0,0,F),g[1]&&("function"==typeof g[1]?H=g[1]:G=g[1]),g[2]&&(H=g[2]),void 0===G.cache&&(G.cache=!0),D())}
('myapp.js');
</script>
```

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

You can copy/paste the above loader code as is and use it in you project.

## Configuration

To configure loader, you should pass arguments to it's constructor function.
```javascript
!function(){/*INLINE SCRIPT LOADER CODE*/}
(path[[, options], scriptsLoadedHandler]);
```

### Parameters

**path**

String or array of strings representing the path(s) to the javascript file(s) that should be loaded.

**options**

Object containing configuration options. See **Possible options**.

**scriptsLoadedHandler**

Function to execute when all scripts are loaded. Function recieve the result of the last executed script as an argument.

#### Possible options

**cache**

If `false`, loader will always get scripts from the remote server, ignoring the local cache. Default is `true`.

**debug**

If `true`, loader will output debugging data to a console. Default is `false`.
