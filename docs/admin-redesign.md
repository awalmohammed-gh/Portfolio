# Admin redesign

Implemented locally on 16 October 2026. The public portfolio and the shared color-token definitions were not changed by this redesign.

## Delivered

- A fixed desktop sidebar, persistent workspace header, keyboard-accessible mobile navigation dialog, skip link, and a flexible main outlet.
- Layouts that respond to the outlet's available width: summary cards, content cards, list rows, editor columns, and form fields. Editors keep a single main column until there is room beside the sidebar for a separate action column.
- A dashboard with prioritized project counts, filtered draft/published shortcuts, recent activity, quick actions, and a compact content inventory.
- Shared list toolbars with visible labels, aligned desktop rows, stacked mobile rows, prominent editing, and URL-based search, filters, and sorting.
- Sectioned editors with jump navigation and sticky save actions. Project, education, experience, settings, and page-content editors use the shared structure.
- Accurate new-record, dirty, saved, draft, published, and hidden messages. Drafts use Save draft/Publish project; published projects use Save changes/Move to drafts, with confirmation before unpublishing through the editor.
- Protection when following links or signing out with unsaved form edits, plus the browser's normal document-exit warning. Browser Back/Forward interception is not implemented.
- Page-content navigation organized by public page, including links to related record collections.
- Consistent media cards, full-collection server search, pagination, usage filters, visible alt-text labels, persistent save feedback, and a picker that retains selected assets across pages.
- A refreshed sign-in page and account forms with password visibility controls and unsaved-edit tracking.
- Theme-aware destructive confirmation styling using the existing danger colors.

## Colors

The existing light/dark background, surface, indigo, cyan, border, text, and status tokens remain the source of truth in `src/app/globals.css`. Admin-specific styles live in `src/app/admin/admin.css` and use these tokens. No UI framework or dependency was added.

## Verification

- Production build completed successfully, including TypeScript and generation of all routes.
- Standalone TypeScript checking and ESLint checking of admin routes/components passed.
- 41 HTTP/rendering checks passed against the production server: sign-in, authorization, admin indexes, create forms, existing record editors, project preview, all page-content editors, generated CSS, media search/pagination/usage filters, and preservation of the established palette values.
- Verification did not edit portfolio content. It created a normal sign-in session and signed that session out afterward.
- Existing work experience was empty, so its new editor was checked; an existing experience editor could not be exercised.

Browser automation was unavailable in the session. Rendered screenshots, real viewport overflow, focus behavior, client navigation, and interactive create/save/publish flows therefore still require a browser walkthrough. The build emitted an existing warning about the site's missing `metadataBase`/canonical URL configuration; that setting is outside this visual redesign.

The HTTP checks can be repeated with `node scripts/verify-admin-design.mjs` against a running production server. The script reads the existing administrator credentials from environment files without printing them. Set `BASE_URL` to use a server other than `http://localhost:3100`.
