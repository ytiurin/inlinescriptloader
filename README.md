# Inline script loader

Script loader that does not require a module definition and implements the `import`-like dependency injections. It downloads code via `XHR`, executes it using the `new Function` constructor and cache it in the browser's local storage.

## Usage

```html
<!-- Inline script loader v0.2 --><script type="text/javascript">(function(){function n(a,b,c){for(var d=-1,f=a[e];f--;)if(a[f][b]===c){d=f;break}return d}function o(a){return-1<[4,5][g](parseInt(a/100))}function p(a,b,c,d){var e=new XMLHttpRequest;e[l]=b,e.d=c,e.onload=d,e.open(a,b,!0),e.send()}function q(b){for(var e,h,i,j,c=[],d=b.replace(/'|"/g,'"');-1<(e=d[g](a,e));e=h+1)i={},h=d[g]('"',e+1),j=d.substring(e,h).split(" "),j[1]&&(i[l]=j[1],"from"===j[2]&&j[3]&&(i.name=j[1],i[l]=j[3])),c[f](0,0,i);return c}function r(a,e){var f=this.ch;p("get",a,{},function(){var g=this;if(o(g.status))c[d]("Failed loading "+a+": "+g.statusText);else{if(f&&b)try{b.setItem(a+"[text]",g[h]),b.setItem(a+"[time]",g[i](j))}catch(l){c.warn("Caching script failed because: "+l[k])}e.call(g)}})}function s(a,b){for(var g=0;g<a[e];g++){for(var h=n(b,l,a[g]),i=[],j=[],o=b[h][m],p=0;p<o[e];p++)if(o[p].name){var q=n(b,l,o[p][l]);i[f](0,0,o[p].name),j[f](0,0,b[q].result)}var r=new Function(i,b[h].text);try{b[h].result=r.apply({},j)}catch(s){c[d]("Error executing script "+b[h].url+": "+s[k])}}try{this.uc&&this.uc(b[0].result)}catch(s){c[d]("Error executing user callback: "+s[k])}}function t(){function a(a,b,h){var i={};i[l]=a,i.text=b,i[m]=q(b),i.source=h,y[f](0,0,i);for(var j,n,o,p=i[m][e];p--;)o=i[m][p][l],n=A[g](a),-1<(j=A[g](o))?j>n&&(A[f](j,1),A[f](n,0,o)):(x++,A[f](n,0,o),d(o));--x<1&&(u&&(c.log(A),c.table(y)),s.bind({uc:k})(A,y))}function d(c){var d,e;t&&b&&null!==(d=b.getItem(c+"[text]"))&&null!==(e=b.getItem(c+"[time]"))?(a(c,d,"local"),p("head",c,{time:e},function(){var a=this;o(a.status)||a[i](j)===a.d.time||z(a[l],function(){var b;-1<(b=n(y,l,a[l]))&&(y[b].source="late remote")})})):z(c,function(){a(this[l],this[h],"remote")})}var k,t,u,v,w=arguments,x=0,y=[];w[1]&&("function"==typeof w[1]?k=w[1]:(v===(t=w[1].cache)&&(t=!0),v===(u=w[1].debug)&&(u=!1))),w[2]&&(k=w[2]);var z=r.bind({ch:t}),A=w[0][f]&&w[0][f](0)||w[0];x=A[e];for(var B=A[e];B--;)d(A[B])}var b,a='"import ',c=console,d="error",e="length",f="splice",g="indexOf",h="responseText",i="getResponseHeader",j="last-modified",k="message",l="path",m="dependencies";try{b=localStorage}catch(u){c.warn("Caching disabled because: "+u[k])}return t.apply(this,arguments),t})
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
