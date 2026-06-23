**Button** — the primary action control; Path Blue by default, with secondary/ghost/soft/outline treatments and an optional palette accent override. Use for any click action; reach for `variant="primary"` for the main action on a surface and `secondary`/`ghost` for supporting actions.

```jsx
<Button onClick={save}>Install theme</Button>
<Button variant="secondary">View on Marketplace</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button variant="soft" accent="peach">Bring the spice</Button>
```

Variants: `primary` (path-blue fill), `secondary` (surface + border), `ghost` (text only), `soft` (tinted fill), `outline`. Sizes: `sm` · `md` · `lg`. Pass `accent` (any Catppuccin Latte name) to recolor non-secondary variants; `iconLeft` / `iconRight` accept any node. Focus shows the Path Blue ring.
