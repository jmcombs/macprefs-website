**Badge** — a compact pill for status, labels, counts, and tags. Defaults to a soft tinted fill; use `dot` for live-status chips and `variant="solid"` when it sits on a busy surface.

```jsx
<Badge tone="success" dot>Ready</Badge>
<Badge tone="accent" variant="solid">v1.0.0</Badge>
<Badge tone="warning" variant="outline">Dirty</Badge>
```

Tones: `neutral · accent · success · warning · error · info` plus palette names `mauve · peach · pink · lavender`. Variants: `soft` (default) · `solid` · `outline`. Sizes `sm · md`.
