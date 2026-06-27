**CommandBox** — a "Terminal window" CLI box for docs and marketing pages (install steps, quick-start commands). Authentic dark terminal look on any page; copy button built in.

```jsx
<CommandBox commands={[
  '# Add the tap and install',
  'brew tap jmcombs/macprefs',
  'brew install macprefs',
  'macprefs --version',
  '  macprefs 1.2.0',
]} />
```

Lines: normal → command with a Path-Blue `$` prompt; `#…` → dimmed comment; indented → dimmed output. Props: `title` (default "Terminal window"), `commands`, `copyable`, `prompt`. Pass `children` for full control. (Loads `codicons` for the copy icon in the host.)
