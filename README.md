# Inline script loader

Script loader that does not require module definitions and implements the `import`-like dependency injections. It downloads code via `XMLHttpRequest`, executes it using `Function` object and cache it in browser Local storage.

## Usage

```html
<script type="text/javascript">!function(){/*MINIFIED SCRIPT LOADER CODE*/}
("myapp.js");
</script>

```

```javascript
//myapp.js
'import jquery.js';
'import mymodule.js myModule';

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
