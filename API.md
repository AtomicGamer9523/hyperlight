# API

## DOM attribute API

```html
<img
    $src = "image${ HyperLight.get('dark') ? '-dark' : '' }.png"
    alt = "Example"
    s.width = "100px"
    s.height = "50px"
    lazyload
    eval = "console.log('Loaded image', this)"
>
```

### Added Attributes

#### `lazyload`

Only really useful for images.

This is a shorthand for `loading="lazy"` and `decoding="async"`.

Example:

```html
<img lazyload src="image.png" alt="Example">
```

Identical to:

```html
<img loading="lazy" decoding="async" src="image.png" alt="Example">
```

#### `eval`

Evaluates the given JS code when the element is loaded.
The `this` keyword refers to the element itself.
And can be used to mutate the element.

Example:

```html
<div eval = "console.log('This is a div', this)"></div>
```

Identical to:

```html
<div hyperlight="cfcd208495d565ef66e7dff9f98764da"></div>
<script>
    const evaluator = (function(){
    console.log('This is a div', this)
    });
    const elem = document.querySelector('[hyperlight="cfcd208495d565ef66e7dff9f98764da"]');
    evaluator.call(elem);
    elem.removeAttribute("hyperlight");
</script>
```

#### `s.<style>`

Sets the style of the element.
This is a shorthand for `style="<style>: <value>"`.
Note, you can use `${}` to evaluate JS code.

Example:

```html
<span
    s.color = "#${Math.floor(Math.random() * 0xFFFFFF).toString(16)}"
    s.fontSize = "16px"
>Example</span>
```

Identical to:

```html
<span hyperlight="c4ca4238a0b923820dcc509a6f75849b">Example</span>
<script>
    const evaluator_color = (function(){return
    `#${Math.floor(Math.random() * 0xFFFFFF).toString(16)}`
    });
    const evaluator_fontSize = (function(){return
    `16px`
    });
    const elem = document.querySelector('[hyperlight="c4ca4238a0b923820dcc509a6f75849b"]');
    const value_color = evaluator_color.call(elem);
    const value_fontSize = evaluator_fontSize.call(elem);
    elem.removeAttribute("hyperlight");
    elem.style.color = value_color;
    elem.style.fontSize = value_fontSize;
</script>
```

#### `$<attribute>`

Sets the attribute of the element.
This is intended to allow the use of `${}` to evaluate JS code.
Especially when the attribute is not a style.

Example:

```html
<img
    $src = "image${ HyperLight.get('dark') ? '-dark' : '' }.png"
>
```

Identical to:

```html
<img hyperlight="c81e728d9d4c2f636f067f89cc14862c">
<script>
    const evaluator = (function(){return
    `image${ HyperLight.get('dark') ? '-dark' : '' }.png`
    });
    const elem = document.querySelector('[hyperlight="c81e728d9d4c2f636f067f89cc14862c"]');
    const value = evaluator.call(elem);
    elem.removeAttribute("hyperlight");
    elem.setAttribute("src", value);
</script>
```

## Global JS API

### `HyperLight.autoCloseObserver`

Whether the observer will automatically close after the DOM is loaded.

This is recommended for performance reasons.
Especially when you know that more elements will NOT be added to the DOM.

- Since: `3.0.0`
- Default: `true`
- Type: `boolean`
- Readable: Yes
- Writable: Yes

### `HyperLight.openObserver()`

Allows for manual starting of the observer.

You may use this, but don't forget to [close](#hyperlightcloseobserver) when you're done.

- Since: `3.0.0`
- Returns: `void`

### `HyperLight.closeObserver()`

Allows for manual closing of the observer.

This method is by default called when the DOM is loaded.
You may disable this by setting [autoCloseObserver](#hyperlightautocloseobserver) to `false`.
Or you may re-open the observer by calling [openObserver](#hyperlightopenobserver).

### `HyperLight.save(key, value)`

Saves a value to temporary session storage.

- Since: `3.0.1`
- Parameters:
  - `key` (string): The key to save the value under.
  - `value` (string): The value to save.
- Returns: `void`

### `HyperLight.get(key)`

Attempts to get a value from the session storage.

This method may return `undefined` if the key does not exist.

- Since: `3.0.1`
- Parameters:
  - `key` (string): The key to get the value from.
- Returns: `string | undefined`
  - The value if it exists. Otherwise, `undefined`.

### `HyperLight.rm(key)`

Removes a value from the session storage.

- Since: `3.0.1`
- Parameters:
  - `key` (string): The key to remove the value from.
- Returns: `boolean`
  - `true` if the key existed and was removed. Otherwise, `false`.
