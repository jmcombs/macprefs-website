**Swatch** — a palette color chip with name + hex. The brand's signature atom for palette docs, color pickers, and marketing. Set `copyable` to copy the hex on click.

```jsx
<Swatch color="var(--psl-path-blue)" name="Path Blue" hex="#3465a4" copyable />
<Swatch color="var(--latte-peach)" name="Peach" hex="#fe640b" shape="circle" />
```

Props: `color` (or `hex`), `name`, `hex`, `size` (`sm·md·lg`), `shape` (`rounded·square·circle`), `copyable`.
