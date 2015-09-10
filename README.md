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
