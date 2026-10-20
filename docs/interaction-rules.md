# NeoPoly interaction rules

- Typography and brand tokens remain theme-specific; interaction semantics do not.
- Ordinary controls: 160ms color/background/border feedback. No hover enlargement or pressed shrink.
- Pressed: short brightness reduction (0.94). Do not treat pressed as persistent selection.
- Keyboard focus: 2px outline, 3px offset; gold in dark mode and deep gold in light mode. Clipped card overlays use an inset outline.
- Disabled: 45% opacity, no pointer activation, no shadow. Busy controls may use 70% opacity with aria-busy and a loading indicator.
- Content images: 240ms, 1.01x hover zoom on fine pointing devices only. Do not move the card layout.
- Media actions: black background at 50% opacity, 66% on hover; same in both themes. Delete stays red, favorite uses brand color and filled state, edit uses brand color.
- Selected sidebar items: 10% brand surface, 30% brand border, semibold readable label. Category and content tabs may retain their underline pattern.
- Hover-revealed actions must also appear on keyboard focus and touch devices. Touch targets should be at least 44px.
- Reduced-motion preferences disable CSS transitions and image zoom; dedicated theme-transition handling remains in place.
- Card navigation and secondary actions must be sibling buttons, not nested buttons or clickable spans. Give stateful actions accessible names and aria-pressed.
- Noninteractive previews must not imply navigation using pointer cursors or action hover effects.

The shared CSS contract is at the end of src/index.css. Existing page-specific semantic states (destructive, selected, loading) remain intentional exceptions. New controls should use semantic classes rather than additional theme-specific overrides.
