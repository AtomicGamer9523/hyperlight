# HyperLight

## An extremely light JS framework ;)

As simple as:

```html
<script
    src = "https://raw.githubusercontent.com/AtomicGamer9523/hyperlight/refs/tags/3.0.2/hyperlight.min.js"
    integrity = "sha384-snHoqY8ui+LKDw8TE81whtm5izNxzTsppNNJbSqZPVW35WTQrAxCpJb45+CBBfcL"
    crossorigin = "anonymous"
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
