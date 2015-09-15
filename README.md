# Inline script loader

Script loader that does not require a module definition and implements the `import`-like dependency injections. It downloads code via `XHR`, executes it using the `new Function` constructor and cache it in the browser's local storage.

## Usage

```html
<!-- Inline script loader v0.1 --><script type="text/javascript">!function(){function z(a){return-1<[4,5][o](parseInt(a/100))}function A(a,b,c){var d=new XMLHttpRequest;d[y]=e++,d.onload=function(){f--,c.apply(this,arguments),1>f&&g&&g()},d.open(a,b,!0),f++,d.send()}function B(d){for(var e=[],g=c[l];g--;)c[g].url===d.url&&c[n](g,1);for(var i,j,k,m,h=d.text.replace(/'|"/g,'"');-1<(i=h[o](a,i));i=j+1)k={},j=h[o]('"',i+1),m=h[p](i,j).split(" "),m[1]&&(k.path=m[1],"from"===m[2]&&m[3]&&(k.name=m[1],k.path=m[3]),b[n](0,0,k.path));d[x]=e,c[n](0,0,d),1>f&&E()}function C(a,b){A("get",a,function(){if(z(this.status))j[k]("Failed loding "+a+": "+this.statusText);else{if(H.cache&&i)try{i[r](a+"[url]",this[s]),i[r](a+"[text]",this[t]),i[r](a+"[time]",this[u](v))}catch(c){j.warn("Caching script failed because: "+c[w])}b&&b.call(this)}})}function D(a){var b,d,f,g=H.cache&&i&&null!==(b=i[q](a+"[url]"))&&null!==(d=i[q](a+"[text]"))&&null!==(f=i[q](a+"[time]"));return g&&(B({order:e++,url:b,text:d,source:"local"}),g&&A("head",a,function(){var b=this[u](v)!==f;!z(this.status)&&b&&C(a,function(){var a;-1<(a=c.map(function(a){return a.url}).indexOf(this[s]))&&(c[a].source="late remote")})})),g}function E(){if(b[l])for(var a;b[l];)a=b[n](0,1),D(a)||C(a,function(){B({order:this[y],url:this[s],text:this[t],source:"remote"})});else{c=c.sort(function(a,b){return a[y]<b[y]});for(var e,f,h,i=0;i<c[l];i++){h=c[i][x],e={aNs:[],aVs:[]};for(var o=0;o<h[l];o++)for(var p=c[l];p--;)if(d[h[o].path]===c[p].url){e.aNs[m](h[o].name),e.aVs[m](c[p].result);break}f=new Function(e.aNs,c[i].text);try{c[i].result=f.apply({},e.aVs)}catch(q){j[k]("Error executing script "+c[i].url+": "+q[w])}}try{I&&I(c[0].result)}catch(q){j[k]("Error executing user callback: "+q[w])}g=function(){H.debug&&j.table(c)}}}var g,i,a='"import ',b=[],c=[],d={},e=0,f=0,h=arguments,j=console,k="error",l="length",m="push",n="splice",o="indexOf",p="substring",q="getItem",r="setItem",s="responseURL",t="responseText",u="getResponseHeader",v="last-modified",w="message",x="dependencies",y="order";try{i=localStorage}catch(F){j.warn("Caching disabled because: "+F[w])}var I,G=h[0],H={};G&&(Array.isArray(G)?b=G[n](0).reverse():b[n](0,0,G),h[1]&&("function"==typeof h[1]?I=h[1]:H=h[1]),h[2]&&(I=h[2]),void 0===H.cache&&(H.cache=!0),E())}
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
