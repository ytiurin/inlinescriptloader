# Inline script loader

Script loader that does not require a module definition and implements the `import`-like dependency injections. It downloads code via `XHR`, executes it using the `new Function` cunstructor and cache it in browser's local storage.

## Usage

```html
<script type="text/javascript">!function(){/*MINIFIED SCRIPT LOADER CODE*/}
("myapp.js");
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

## Loader code

```html
<!-- Inline script loader --><script type="text/javascript">!function(){function u(a){return-1<[4,5][m](parseInt(a/100))}function v(a,b,c){d.onload=c,d.open(a,b,!0),d.send()}function w(c){for(var d=[],f=b[j];f--;)b[f].url===c.url&&b[l](f,1);for(var h,i,k,o,g=c.text.replace(/'|"/g,'"');-1<(h=g[m](e,h));h=i+1)k={},i=g[m]('"',h+1),o=g[n](h,i).split(" "),o[1]&&(k.path=o[1],"from"===o[2]&&o[3]&&(k.name=o[1],k.path=o[3]),a[l](0,0,k.path));c.dependencies=d,b[l](0,0,c),y()}function x(a){v("get",a,function(){if(u(this.status))h[i]("Failed loding "+a+": "+this.statusText);else{if(B.cache&&g)try{g[p](a+"[url]",this[q]),g[p](a+"[text]",this[r]),g[p](a+"[time]",this[s](t))}catch(b){h.warn("Caching script failed because: "+b.message)}w({url:this[q],text:this[r],source:"remote"})}})}function y(){if(a[j]){var e,f,m,d=a[l](-1);B.cache&&g&&null!==(e=g[o](d+"[url]"))&&null!==(f=g[o](d+"[text]"))&&null!==(m=g[o](d+"[time]"))?v("head",d,function(){var a=this[s](t)!==m;!u(this.status)&&a?x(d):w({url:e,text:f,source:"local"})}):x(d)}else{for(var n,p,q,r=0;r<b[j];r++){q=b[r].dependencies,n={aNs:[],aVs:[]};for(var y=0;y<q[j];y++)for(var z=b[j];z--;)if(c[q[y].path]===b[z].url){n.aNs[k](q[y].name),n.aVs[k](b[z].result);break}p=new Function(n.aNs,b[r].text);try{b[r].result=p.apply({},n.aVs)}catch(A){h[i]("Error executing script "+b[r].url+": "+A.message)}}try{C&&C(b[0].result)}catch(A){h[i]("Error executing user callback: "+A.message)}B.debug&&h.table(b)}}var g,a=[],b=[],c={},d=new XMLHttpRequest,e='"import ',f=arguments,h=console,i="error",j="length",k="push",l="splice",m="indexOf",n="substring",o="getItem",p="setItem",q="responseURL",r="responseText",s="getResponseHeader",t="last-modified";try{g=localStorage}catch(z){h.warn("Caching disabled because: "+z.message)}var C,A=f[0],B={};A&&(Array.isArray(A)?a=A[l](0):a[l](0,0,A),f[1]&&("function"==typeof f[1]?C=f[1]:B=f[1]),f[2]&&(C=f[2]),void 0===B.cache&&(B.cache=!0),y())}
('YOUR APP PATH');
</script>
```
