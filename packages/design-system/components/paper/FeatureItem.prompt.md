**FeatureItem** — a Paper Kit feature block: a pastel codicon medallion, title, body, and an optional "see more" link. Lay out 3–4 in a row; vary the `accent` per item to show off the Latte pastels.

```jsx
<FeatureItem icon="device-camera" accent="teal" title="Beautiful gallery" linkText="See more">
  Spend your time generating new ideas.
</FeatureItem>
<FeatureItem icon="lightbulb" accent="peach" title="New ideas" linkText="See more">
  Larger, yet dramatically thinner.
</FeatureItem>
```

Props: `icon` (codicon), `accent` (Latte name), `title`, `children` (body), `linkText`/`linkHref`, `align`.
