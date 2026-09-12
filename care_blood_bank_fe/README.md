# Care Blood Bank (frontend)

Blood-bank workflows for CARE

A [care_fe](https://github.com/ohcnetwork/care_fe) plugin, loaded at runtime through Vite
Module Federation. It is a separate build; it never imports from `care_fe`.

## Develop

```bash
npm install
npm run dev:api    # mock CARE API on http://localhost:9000
npm run dev        # vite preview :4174  +  vite build --watch
```

The mock API is a local, seeded development backend for previewing the interface without a
running CARE checkout. It exposes the same read endpoints used by the dashboard and includes
donors, inventory units, and blood requests. Replace it with the real Django plugin API when
running the full CARE stack.

Enable it in `care_fe/.env.local`:

```
REACT_ENABLED_APPS=ohcnetwork/care_blood_bank_fe@localhost:4174/assets/remoteEntry.js
```

Then restart the `care_fe` dev server — `.env.local` is not hot-reloaded.

> There is no HMR across the federation boundary. After the plugin rebuilds, **hard-reload**
> `care_fe`.

## Structure

| Path | Purpose |
| --- | --- |
| `src/manifest.tsx` | The only module federation exposes. Routes, components, nav items, side-effect registrations. |
| `src/utils/api.ts` | Fetch client. Uses `window.CARE_API_URL` and the staff/OTP token, with the `/otp` prefix applied automatically. |
| `src/components/Page.tsx` | Tailwind scoping wrapper. Wrap every rendered root. |
| `public/locale/en.json` | i18n keys, all prefixed `blood_bank__`. |

## Conventions

- Every entry in `components` and `routes` must be `lazy()` — the manifest chunk loads on
  every page of `care_fe`.
- Every user-facing string is `t("blood_bank__key")`, defined in this repo's `en.json`.
  Never add keys to `care_fe`'s locale files.
- `cssCodeSplit: false` and remote CSS is not auto-injected: do not depend on packages that
  ship their own stylesheets.
- Prop types are structural mirrors of `care_fe/src/pluginTypes.ts`, never imports.
