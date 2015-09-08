# Inline script loader

Script loader that does not require module definitions and implements the `import`-like dependency injections. It downloads code via `XHR`, executes it using the `Function` object and cache it in browser's local storage.

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
