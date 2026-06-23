**TeamCard** — a Paper Kit person card: round avatar, name, pastel role label, quote, and a social row. Pass any node as `avatar` (image, or the kit's pastel `Avatar` placeholder).

```jsx
<TeamCard avatar={<Avatar seed="henry" />} name="Henry Ford" role="Product Manager"
  accent="mauve" socials={[{icon:'github'},{icon:'twitter'},{icon:'link'}]}>
  Teamwork is so important that it is virtually impossible to reach the heights of your capabilities without it.
</TeamCard>
```

Props: `avatar`, `name`, `role`, `accent` (Latte name), `socials` (codicon names), `children` (quote).
