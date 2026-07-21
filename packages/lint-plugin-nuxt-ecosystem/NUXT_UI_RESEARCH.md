# Nuxt UI lint research

Research date: 2026-07-21. The implementation was checked against the live Nuxt UI v4.6.1
documentation at `ui.nuxt.com`, including the complete component index, component API
tables, composable entry points, theming guidance, accessibility guidance, and the v3-to-v4
migration guide.

## Sources and enforceable conventions

| Area | Documented convention | Lint implementation |
|---|---|---|
| Design system | Prefer semantic colors (`text-muted`, `bg-elevated`, `border-default`, semantic status aliases) so themes and dark mode remain portable. | `prefer-semantic-colors` |
| Application provider | `UApp` wraps the application and provides config, direction, toast, tooltip, and overlay providers. | `require-u-app` |
| Component props | `color`, `variant`, and `size` are documented finite unions. | `no-invalid-prop-values` (static values only, extensible for custom variants) |
| Form control labels | Inputs and choice controls expose labels/legends or are intended to be associated through `UFormField`. | `require-form-control-label` |
| Icons | Iconify names are passed through `UIcon` or component icon props. | `prefer-u-icon`; existing component-preference rules |
| Icon names | Docs use the `i-<collection>-<icon>` naming convention, while Vue component bindings remain supported. | `no-invalid-icon-name` |
| Buttons | Icon-only buttons are supported, but still need an accessible name. | `require-icon-button-label` |
| Links | `ULink` wraps `NuxtLink`; link-capable components document `to`. | `prefer-link-to` |
| Avatars | `alt` is forwarded to the image and also supplies fallback initials. | `require-avatar-alt` |
| Forms | A root `UForm` receives reactive `state`; nested forms explicitly inherit parent state. | `require-form-state` with a `nested` exception |
| Form errors | `UForm` routes errors to `UFormField` through `name` or `error-pattern`. | `require-form-field-name`, scoped to fields inside `UForm` |
| Overlay state | Modal, drawer, slideover, popover, and tooltip expose the named `open` model. | `prefer-open-model` |
| Controlled state | `default-open`/`default-value` are initializers for uncontrolled components and should not be mixed with controlled state. | `no-conflicting-state-props` |
| Dialog accessibility | Modal-like overlays expose title props/slots backed by Reka UI dialog semantics. | `require-overlay-title` with prop, slot, and ARIA alternatives |
| Tooltip content | `UTooltip` documents `text` and `#content` as its content sources. | `require-tooltip-content` |
| Popover content | `UPopover`'s `content` prop configures positioning; visible content belongs in `#content`. | `require-popover-content` |
| Cross-prop constraints | `UFileUpload` restricts button/area, layout and position combinations; `UAccordion collapsible` applies to single mode. | `no-invalid-prop-combinations` |
| v4 migration | Three component changes and the `nullify` to `nullable` model-modifier rename. | Existing deprecation rules; object-form `model-modifiers` coverage added |

## False-positive policy

- Dynamic bindings are accepted where static correctness cannot be proven.
- `data-raw` remains the local escape hatch for deliberately native/component-level
  markup and hard-coded brand styling.
- Rules that need application-wide knowledge (for example, verifying the single root
  `UApp` provider) are not implemented as per-file template rules.
- `loading-auto`, `UForm` submit handlers, and structural replacements such as arbitrary
  `div` to `UCard` are not required: the documentation supports valid cases without them,
  so enforcing them would be guesswork.
- `require-u-app` intentionally scopes itself to the Nuxt `app.vue` root and ignores
  component/page/layout files named `App.vue`.
- Nested `UForm` and standalone `UFormField` patterns are explicitly preserved because
  both are documented use cases.
- Form controls with dynamic labels are accepted; the label rule only reports when no
  direct ARIA/label API or `UFormField` association is visible in the template.

## Third-stage coverage audit

The complete component index was audited by category. The table records both what is
enforced and why additional rules were not invented for the remaining documentation.

| Documentation category | Audited surface | Decision |
|---|---|---|
| Layout | `App`, `Container`, `Error`, `Footer`, `Header`, `Main`, `Sidebar`, `Theme` | `require-u-app` covers the provider boundary; the remaining components are structural wrappers whose correct nesting depends on the application layout. |
| Element | `Alert`, `Avatar`, `AvatarGroup`, `Badge`, `Banner`, `Button`, `Calendar`, `Card`, `Chip`, `Collapsible`, `FieldGroup`, `Icon`, `Kbd`, `Progress`, `Separator`, `Skeleton` | Covered by semantic colors, icon-name validation, accessible labels, avatar alt text, finite prop validation, and native-component preferences where the API is unambiguous. |
| Form | `Checkbox`, `CheckboxGroup`, `ColorPicker`, `FileUpload`, `Form`, `FormField`, `Input`, `InputDate`, `InputMenu`, `InputNumber`, `InputRating`, `InputTags`, `InputTime`, `Listbox`, `PinInput`, `RadioGroup`, `Select`, `SelectMenu`, `Slider`, `Switch`, `Textarea` | Covered by form state/name/label rules, controlled-state conflicts, static API unions, and file-upload relationship checks. Item schemas and runtime validation remain dynamic. |
| Data | `Accordion`, `Carousel`, `Empty`, `Marquee`, `ScrollArea`, `Table`, `Timeline`, `Tree`, `User` | Accordion's documented `type`/`collapsible` relationship is enforced. The rest are driven by runtime data, slots, or render functions; a per-file rule would guess at valid use cases. |
| Navigation | `Breadcrumb`, `CommandPalette`, `FooterColumns`, `Link`, `NavigationMenu`, `Pagination`, `Stepper`, `Tabs` | Link and button navigation semantics are covered. Menu, tab, step, and command item labels usually come from typed arrays or slots and cannot be validated from the template safely. |
| Overlay | `ContextMenu`, `Drawer`, `DropdownMenu`, `Modal`, `Popover`, `Slideover`, `Toast`, `Tooltip` | Open-state naming, overlay titles, tooltip/popover content, and provider setup are covered. Menu item contents and programmatic toast payloads require script/runtime analysis. |
| Page | `AuthForm`, `BlogPost`, `BlogPosts`, `ChangelogVersion`, `ChangelogVersions`, `Page`, `PageAnchors`, `PageAside`, `PageBody`, `PageCard`, `PageColumns`, `PageCTA`, `PageFeature`, `PageGrid`, `PageHeader`, `PageHero`, `PageLinks`, `PageList`, `PageLogos`, `PageSection`, `PricingPlan`, `PricingPlans`, `PricingTable` | These are composition primitives; enforcing a particular page hierarchy or content shape would be opinionated rather than a documented invariant. |
| Dashboard | `DashboardGroup`, `DashboardNavbar`, `DashboardPanel`, `DashboardResizeHandle`, `DashboardSearch`, `DashboardSearchButton`, `DashboardSidebar`, `DashboardSidebarCollapse`, `DashboardSidebarToggle`, `DashboardToolbar` | State persistence, panel sizing, and responsive composition are runtime concerns. No additional template-only rule met the false-positive bar. |
| AI Chat | `ChatMessage`, `ChatMessages`, `ChatPalette`, `ChatPrompt`, `ChatPromptSubmit`, `ChatReasoning`, `ChatShimmer`, `ChatTool` | APIs depend on Vercel AI SDK message/tool state and asynchronous status; static templates cannot establish correctness. |
| Editor | `Editor`, `EditorDragHandle`, `EditorEmojiMenu`, `EditorMentionMenu`, `EditorSuggestionMenu`, `EditorToolbar` | TipTap extensions, editor content, and menu lifecycle are configured in script; no safe template-only invariant remains. |
| Content | `ContentNavigation`, `ContentSearch`, `ContentSearchButton`, `ContentSurround`, `ContentToc` | Content routes and generated navigation are resolved by Nuxt Content at runtime/build time. |
| Color mode / i18n | `ColorModeAvatar`, `ColorModeButton`, `ColorModeImage`, `ColorModeSelect`, `ColorModeSwitch`, `LocaleSelect` | Integration correctness depends on installed modules and runtime locale/color-mode configuration; component APIs themselves expose no deterministic missing prop. |

This audit deliberately favors a smaller set of high-signal rules over rules that merely
encode a preferred page architecture or require static knowledge of user-defined item
arrays.
