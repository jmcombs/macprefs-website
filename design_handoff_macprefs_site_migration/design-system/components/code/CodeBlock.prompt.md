**CodeBlock / Tok** — a syntax-highlighted code surface using the real Netservant token colors, with optional filename chrome, window dots, and line numbers. Build rows from `Tok` spans (color by `kind`).

```jsx
<CodeBlock filename="brew.ts" language="ts" windowDots lines={[
  <><Tok kind="keyword">const</Tok> shots <Tok kind="operator">=</Tok> <Tok kind="number">4</Tok>;</>,
  <><Tok kind="comment">// bring the spice</Tok></>,
]} />
```

`Tok` kinds: `comment · keyword · string · number · constant · function · type · variable · parameter · operator · tag · attribute · property · punctuation · escape · regexp · macro`. Functions render in Path Blue, matching the shipped editor theme.
