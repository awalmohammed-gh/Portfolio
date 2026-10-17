# Admin workspace navigation

Updated 17 October 2026. Existing colors, API endpoints, content fields, database schemas, publishing operations, media integration, and authentication methods are retained.

## Workspace shell

- Desktop sidebar switches between a 248px expanded layout and an 80px icon rail. The header and outlet use the same width variable and transition together.
- Sidebar preference persists in the `admin_sidebar` cookie, scoped to `/admin`. The server reads it before rendering the authenticated workspace. No local storage is used.
- Navigation scrolls within the viewport-height sidebar. Profile and sign-out controls remain outside the scrolling region.
- Collapsed links keep accessible names and show tooltips on hover or keyboard focus. Tooltips render outside the scroll container, dismiss with Escape, and reposition to avoid the screen edge.
- Skills contains nested Categories navigation. The most specific route receives the current-page marker, including create/edit pages.
- The header includes readable breadcrumbs, page context, View Portfolio, the existing theme switch, and a real administrator profile menu. Raw database IDs are not used as breadcrumb labels.
- The profile menu uses the browser's popover behavior for outside-click/Escape dismissal, with arrow/Home/End navigation and Tab departure.

## Mobile

- A native modal dialog becomes the slide-in drawer, with a backdrop, scroll lock, native focus containment, and focus restoration.
- Links, the close control, Escape, and backdrop taps close the drawer. Existing unsaved-edit protection can cancel link navigation before it closes.
- The drawer remains expanded regardless of the saved desktop sidebar state. It has an independently scrolling menu and pinned account controls with safe-area padding.
- Opening/closing transitions and desktop resizing respect reduced-motion preferences. Moving to the desktop breakpoint closes an open drawer.

## Page compositions

- Overview metrics use more compact spacing while retaining real figures and recent activity.
- Projects support list/grid views through a URL parameter, with thumbnails, summary text, status, and the existing editing/publishing/deletion actions.
- Skills are grouped by category. Selecting a category enables reordering within it.
- Services use cards with descriptions and included deliverables.
- Education and experience use timelines with actual stored dates and details.
- Existing grouped content editors, settings, account forms, and media gallery continue to use the shared responsive outlet.

## Main files

- `src/components/admin/AdminWorkspace.tsx`: collapse state, persistence, and the content outlet.
- `src/components/admin/AdminNav.tsx`: sidebar, nested navigation, breadcrumbs, and mobile drawer.
- `src/components/admin/navigation.ts`: route metadata and readable page context.
- `src/components/admin/AdminProfileMenu.tsx`: signed-in profile menu and keyboard controls.
- `src/components/admin/AdminTooltip.tsx`: focus/hover tooltips outside the scrolling sidebar.
- `src/components/admin/ResourceCollection.tsx`: page-specific collection compositions.
- `src/app/admin/(dashboard)/layout.tsx`: server-verified identity and saved sidebar preference.
- `src/app/admin/admin.css`: navigation, drawer, and responsive content layouts.

## Verification

Run against a running app with the existing administrator credentials in the environment files:

```powershell
$env:BASE_URL = 'http://localhost:3100'
node scripts/verify-admin-design.mjs
node scripts/verify-admin-navigation.mjs
```

The checks exercise authenticated rendering, API reads, profile identity, persisted sidebar modes, route context, active links, collection layouts, and existing editor routes. They create and revoke ordinary test sessions without editing portfolio content. Standalone TypeScript, admin ESLint, and production build checks are also required.

Browser automation was unavailable during implementation. Live viewport overflow, pointer interactions, keyboard focus behavior, drawer animation, and interactive save/publish/upload flows still need a browser walkthrough. HTTP and rendering checks do not establish those visual or interaction results.
