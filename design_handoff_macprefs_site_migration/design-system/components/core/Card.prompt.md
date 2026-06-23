**Card** — a surface container with border-led elevation (the Latte light theme favors soft shadows + borders over heavy lift). Optional crust header bar, accent top-rail, and hover elevation for clickable cards.

```jsx
<Card title="Ghostty" subtitle="Terminal" headerRight={<Badge tone="success" dot>Ready</Badge>}>
  Copy the theme into ~/.config/ghostty/themes
</Card>

<Card accentRail interactive>Quiet card with a Path Blue rail</Card>
```

Props: `title` / `subtitle` / `headerRight` (header bar), `accentRail` + `accent`, `interactive` (hover shadow), `padding`.
