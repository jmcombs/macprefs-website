**ContactForm** — Paper Kit's "Keep in touch?" form: rounded pill inputs + a paper textarea + a pill submit. Self-contained and controlled; `onSubmit` receives `{ name, email, message }` and the button flips to "Sent ✓".

```jsx
<ContactForm blurb="We'd love to hear from you." accent="path"
  onSubmit={(data) => console.log(data)} />
```

Props: `title`, `blurb`, `submitLabel`, `accent` (`path` or Latte name), `align`, `onSubmit`. Composes `PaperButton` internally.
