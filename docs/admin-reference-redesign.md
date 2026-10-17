# Admin workspace redesign

Implemented 17 October 2026 from the supplied dashboard image.

## Design direction

The reference guides the compact grouped sidebar, purple active navigation, inset workspace header, pale canvas, white panels, restrained borders and shadows, and the varied dashboard grid. All colors derive from the existing light and dark system tokens. Public styles and color values were not changed for this redesign.

## Workspace and pages

- Desktop sidebar: narrower navigation, persistent expanded/collapsed preference, named icon links and tooltips, nested Skills navigation, independently scrolling menu, and pinned create-project/account controls.
- Mobile: existing native modal drawer retains backdrop dismissal, Escape, close-on-navigation, focus handling and background scroll lock. Touch controls have larger targets, and reduced motion is supported.
- Header: compact breadcrumbs and context, portfolio action, theme switch, and the real administrator profile menu. The outlet width follows sidebar expansion and collapse, with container queries adapting page layouts.
- Overview: purple project collection summary, a ring derived from saved published/draft project counts, real recent updates, useful editor shortcuts, and a linked content inventory. No traffic, revenue, trend, or growth analytics were invented.
- Projects: publishing filter tabs with real counts, search/filter/sort, and existing list/grid views and record actions.
- Skills: category-grouped lists. Categories remain manageable through their existing routes.
- Services: offering cards. Education and experience: timeline layouts. All retain reorder, visibility, edit and delete actions.
- Page content: a page/section navigation map and grouped editor links.
- Media: library summary, gallery cards, server search and usage filters, pagination, upload, alt-text editing, copy and deletion.
- Editors and settings: numbered content panels, section navigation, themed fields, sticky save/publishing controls, validation and unsaved-change handling.
- Profile: real account identity, personal details, password and session controls.

## Shared implementation

`src/app/admin/admin.css` defines the workspace and component styling. `src/components/admin/ui.tsx` supplies page headers, panels, panel links, collection summaries, status badges and empty states. `form/styles.ts` supplies shared fields, buttons and cards. `ResourceSummary.tsx` adapts genuine collection data to each management page. Dialogs, errors and loading surfaces use the same styling.

Existing routes, schemas, CRUD handlers, authentication, Cloudinary upload/deletion calls, and database data were preserved. This work did not change backend code or write portfolio records.

## Verification

- Production build and TypeScript passed.
- Admin/component and verification-script ESLint passed.
- 41 authenticated design/route/data checks passed.
- 13 navigation checks passed, including Overview totals reconciled against the project API, expanded/collapsed rendering, route context, drawer markup and collection-specific layouts.
- Verification sessions were signed out after the checks; portfolio content was not modified.

Browser tooling exposed no browser surface in this session. Screenshots, responsive visual review, pointer interactions, keyboard focus and animations could not be tested in a live browser. The automated checks cover server-rendered structure and API/data behavior, not complete interactive CRUD or Cloudinary upload flows.

Local production preview: http://localhost:3100/admin

## Scroll boundary correction

The workspace now fills one dynamic viewport, with the header outside the main scroll region. The main pane uses `min-height: 0`, native overflow scrolling and disabled overscroll chaining; the outer document does not scroll while the workspace is mounted. This prevents blank space from being exposed above or below the workspace. End padding is reduced, the footer fits within the pane, and sticky controls use offsets relative to the pane. Dialogs and the mobile drawer also lock the main pane. Page navigation resets the pane to its top without resetting same-page filters or interfering with native anchor links. Login and public page scrolling are unaffected.
