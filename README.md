# Inline script loader

Script loader that does not require a module definition and implements the `import`-like dependency injections. It downloads code via `XHR`, executes it using the `new Function` constructor and cache it in the browser's local storage.

## Usage

```html
<!-- Inline script loader v0.2 --><script type="text/javascript">(function(){function o(a,b,c){for(var d=-1,e=a[f];e--;)if(a[e][b]===c){d=e;break}return d}function p(a){return-1<[4,5][h](parseInt(a/100))}function q(a,b,c,d){var e=new XMLHttpRequest;e[m]=b,e.d=c,e.onload=d,e.open(a,b,!0),e.send()}function r(b){for(var e,f,i,j,c=[],d=b.replace(/'|"/g,'"');-1<(e=d[h](a,e));e=f+1)i={},f=d[h]('"',e+1),j=d.substring(e,f).split(" "),j[1]&&(i[m]=j[1],"from"===j[2]&&j[3]&&(i.name=j[1],i[m]=j[3])),c[g](0,0,i);return c}function s(a,b){var f=this.ch;q("get",a,{},function(){var g=this;if(p(g.status))d[e]("Failed loading "+a+": "+g.statusText);else{if(f&&c)try{c.setItem(a+"[text]",g[i]),c.setItem(a+"[time]",g[j](k))}catch(h){d.warn("Caching script failed because: "+h[l])}b.call(g)}})}function t(a,b){for(var c=0;c<a[f];c++){for(var h=o(b,m,a[c]),i=[],j=[],k=b[h][n],p=0;p<k[f];p++)if(k[p].name){var q=o(b,m,k[p][m]);i[g](0,0,k[p].name),j[g](0,0,b[q].result)}var r=new Function(i,b[h].text);try{b[h].result=r.apply({},j)}catch(s){d[e]("Error executing script "+b[h].url+": "+s[l])}}try{this.uc&&this.uc(b[0].result)}catch(s){d[e]("Error executing user callback: "+s[l])}}function u(){function a(){w&&1>y&&1>z&&(d.log(C),d.table(A))}function e(b,c,d){var e={};e[m]=b,e.text=c,e[n]=r(c),e.source=d,A[g](0,0,e);for(var i,j,k,o=e[n][f];o--;)k=e[n][o][m],j=C[h](b),-1<(i=C[h](k))?i>j&&(C[g](i,1),C[g](j,0,k)):(y++,C[g](j,0,k),l(k));--y<1&&(a(),t.bind({uc:u})(C,A))}function l(b){var d,f;v&&c&&null!==(d=c.getItem(b+"[text]"))&&null!==(f=c.getItem(b+"[time]"))?(e(b,d,"local"),z++,q("head",b,{time:f},function(){var b=this;p(b.status)||b[j](k)===b.d.time?(z--,a()):B(b[m],function(){var c;-1<(c=o(A,m,b[m]))&&(A[c].source="late remote"),z--,a()})})):B(b,function(){e(this[m],this[i],"remote")})}var u,v=!0,w=!1,x=arguments,y=0,z=0,A=[];x[1]&&("function"==typeof x[1]?u=x[1]:(b===(v=x[1].cache)&&(v=!0),b===(w=x[1].debug)&&(w=!1))),x[2]&&(u=x[2]);var B=s.bind({ch:v}),C=x[0][g]&&x[0][g](0)||[x[0]];y=C[f];for(var D=C[f];D--;)l(C[D])}var b,c,a='"import ',d=console,e="error",f="length",g="splice",h="indexOf",i="responseText",j="getResponseHeader",k="last-modified",l="message",m="path",n="dependencies";try{c=localStorage}catch(v){d.warn("Caching disabled because: "+v[l])}return u.apply(this,arguments),u})
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
(function(){/*INLINE SCRIPT LOADER CODE*/})
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
