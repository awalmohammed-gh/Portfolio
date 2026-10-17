# Admin design review

Reviewed 16 October 2026. Review only; application files were not changed.

## Recommendation

Make a focused redesign of the admin workspace, especially editing and publishing. Keep the existing visual identity and shared light/dark color tokens. The foundations are consistent enough to improve incrementally: a replacement theme or backend rebuild is unnecessary.

This is a source-based assessment of the admin routes, shared components, field definitions, and supporting data queries. No authenticated browser walkthrough was performed. Layout concerns below are inferred from the layout rules; actual wrapping, contrast in rendered states, and keyboard behavior still need browser verification.

## Keep

- Shared system colors, Geist typography, restrained borders, and surface hierarchy.
- Grouped sidebar navigation, active states, breadcrumbs, and the public-site link.
- Reusable resource lists and schema-driven forms across collections.
- Search, filters, visibility badges, loading skeletons, empty states, inline validation, upload progress, and delete confirmations.
- Project draft previews and the profile/session management structure.

## Findings to address first

### 1. Make saved, draft, and published states accurate — high priority

`src/components/admin/form/SchemaForm.tsx:394` shows “All changes saved” whenever values match their initial baseline, including a new untouched record. Its next line says the public site shows this version, even for a saved project draft. `ResourceForm.tsx:63` and `ResourcePages.tsx:165` also describe edits as live without considering publication state.

Use distinct states: New record, Unsaved changes, Saved draft, and Published. Make project actions depend on current publication status: Save draft/Publish for a draft, Save changes/Unpublish for a published project. Currently the same Save draft and Save & publish actions are used for every project; Save draft can move a published record back to draft. Explain that transition clearly.

### 2. Keep save controls accessible throughout long forms — high priority

`SchemaForm.tsx:380` places fields before the action sidebar. Below the desktop breakpoint, actions follow the entire form. Projects and settings have enough fields that this requires substantial scrolling. At the desktop breakpoint, the fixed sidebar, fixed action column, page padding, and two-column field grid also compete for horizontal space.

Use a persistent action bar on phones, with space reserved below the form. Keep desktop actions sticky. Switch to two-column editor layouts only when the available content width supports them. Divide long editors into named sections with jump links; retain one obvious primary save action. Short editors such as skills should remain simple.

### 3. Protect edits when moving within the admin — high priority

`SchemaForm.tsx:324` registers a `beforeunload` warning. That covers document exits; the form does not provide equivalent protection for client-side navigation through the sidebar or breadcrumbs.

Add an unsaved-changes guard for internal navigation, with Stay/Discard choices. Preserve entered data after a failed save. Avoid suggesting autosave unless it is actually implemented.

### 4. Make all media reachable — high priority

`src/lib/data/admin.ts:128` loads at most 200 media assets into the library. `MediaPicker.tsx:38` requests only 100. Both interfaces search the loaded subset and provide no way to fetch later pages. Older images can therefore disappear from discovery as the collection grows, even though the API already supports pagination and search.

Connect both interfaces to server search and pagination or Load more. Show the real total. Explain where an image is used before deletion. Label alt-text editing visibly and show its save state; currently library alt text saves on blur. A failed save leaves the typed input visible without a persistent indication that it was not stored.

### 5. Complete mobile menu keyboard behavior — high priority

`AdminNav.tsx:179` uses a custom element with dialog semantics. Escape handling and scroll locking exist, but there is no explicit focus trap, background inertness, or focus restoration to the menu trigger.

Use the same native modal-dialog approach already present in the media and confirmation dialogs, or implement those focus behaviors explicitly. Increase the small reorder targets in resource lists for easier touch use while preserving keyboard alternatives.

## Review by area

| Area | Assessment | Recommended change |
| --- | --- | --- |
| Login | Small polish | Keep the compact form and password reveal. Add a public-site return link and access to the existing theme switch. |
| Sidebar and shell | Moderate refinement | Preserve groups and active states. Make categories easier to find within Skills and improve mobile focus behavior. Recheck available editor width around the desktop breakpoint. |
| Overview | Moderate redesign | Eight cards have similar visual weight. Prioritize published projects, drafts, and recent work; consolidate secondary inventory counts. Make the Drafts card open a filtered project list. Currently it opens the unfiltered list. Give education and experience separate destinations rather than routing their combined count only to Education. |
| Projects | Largest redesign | Introduce sections for details, technology, images, and links; make publication state and actions explicit; retain preview and distinguish saved preview from unsaved edits. |
| Skills and categories | Small refinement | Use a clear Skills/Categories subnavigation. Provide a direct create-category path when the required category selector has no choices. |
| Services | Small refinement | Reuse improved list controls and save feedback. Keep the short editor straightforward. |
| Education | Moderate refinement | Separate institution, qualification, dates, and certificate into readable sections. Preserve the explicit qualification status. |
| Experience | Moderate refinement | Group employment details and dates. Make the relationship between Current role and End date clearer. Keep highlights and technologies together. |
| Page Content | Moderate redesign | Group sections by the public page they affect, with a separate group for shared sections. Add links between section copy and its related collection, such as Skills heading versus skill records. |
| Media Library and picker | Functional and visual refinement | Add complete search/pagination, clearer usage information, and explicit alt-text save feedback. Preserve previews and upload progress. |
| Site Settings | Moderate redesign | Organize Identity, Contact & social, and SEO & sharing into sections with jump navigation. Keep save controls reachable. |
| Profile and sessions | Small polish | Retain the existing separation. Add password visibility controls and verify session rows wrap on small screens. |
| Loading, error, empty, confirmation states | Retain and standardize | Match loading shapes to final layouts. Keep actionable recovery and readable confirmation copy. Use theme-aware semantic colors consistently. |

## Shared list direction

Keep search, filters, sort, and result count together in one toolbar. Desktop project rows should have predictable alignment for title, publication status, update date, and actions. On mobile, use a deliberate stacked layout with the title and state above actions. Keep Edit prominent and group secondary actions in an accessible menu; retain deletion confirmation.

Store search/filter/sort state in URL parameters so Back navigation restores the working view and overview shortcuts can link to filtered results. Keep simple lists lightweight; bulk actions are optional, not a prerequisite for this redesign.

## Preserve system colors

Use the existing variables in `src/app/globals.css`; do not introduce a new admin palette.

| Role | Light | Dark |
| --- | --- | --- |
| Primary accent | `#4f46e5` | `#8b93ff` |
| Secondary accent | `#0891b2` | `#22d3ee` |
| Background | `#f7f7f9` | `#08080c` |
| Surface | `#ffffff` | `#111117` |

Continue using the existing foreground, muted, border, success, warning, danger, and soft-surface tokens. Reserve accent emphasis for primary actions, active navigation, and selected controls. Improve hierarchy through spacing, typography, alignment, and grouping.

One concrete exception needs cleanup: `Feedback.tsx:130` hardcodes `bg-red-600`, `text-white`, and `hover:bg-red-700` for destructive confirmations. Replace that treatment with an accessible combination derived from the system danger tokens, checking contrast in both themes.

## Suggested delivery order

1. Fix state messaging, publication actions, internal navigation protection, media discovery, and mobile dialog behavior.
2. Refine shared shell, headers, list toolbars, rows, and responsive form actions.
3. Apply the project editor structure to longer content and settings editors; simplify the dashboard hierarchy.
4. Polish login, profile, and supporting states.

Before accepting implementation, walk through desktop and phone layouts in both themes: create a draft, save it, preview it, publish it, edit it, navigate away with unsaved changes, recover from a failed save, find older media, and use each modal with only the keyboard. Verify that the redesign preserves the existing color values and public-site styling.
