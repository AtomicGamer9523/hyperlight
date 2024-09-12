# HyperLight

## An extremely light JS framework ;)

As simple as:

```html
<script
    src = "https://cdn.jsdelivr.net/gh/AtomicGamer9523/HyperLight@3.0.1/hyperlight.min.js"
    integrity = "sha384-/DjHjZ/nq2BjCSELZ05S/AkPMx0e2THruAHBtbEmK0eZdQ8bUWkEr69FyKcZu5VT"
></script>
```

### [Example](./example.html)

```html
<script>
// User updates their language preference to Spanish.
HyperLight.save("lang", "es");

function randHex(length) {
    const gen = () => Math.floor(Math.random() * 0xF).toString(0xF);
    return Array.from({ length }, gen).join('');
}
</script>

<img
    $src = "https://dummyimage.com/100x50/${randHex(6)}/${randHex(6)}.png&text=Example"
    $alt = "${HyperLight.get('lang') === 'es' ? 'Ejemplo' : 'Example'}"
    s.width = "100px"
    s.height = "50px"
    lazyload
></img>

<div eval = "console.log('This is a div', this)">
    <span s.color = "#${randHex(6)}">Example</span>
</div>
```

### [API](./API.md)
