# Chat Main Surface Redesign

## Goal

Redesign the main chat screen so it feels like a modern SaaS product surface rather than a generic AI demo. The screen should remain immersive and full-width, but the UI language should become sharper, cleaner, and more product-like.

## Product Intent

- The chat screen should feel like a focused learning workspace.
- It should not visually read as a generic "AI assistant" template.
- The interface should feel more contemporary, intentional, and technical.
- Full-screen immersion should be preserved.

## In Scope

- Update the main chat surface in the current chat experience.
- Redesign the session header, empty state, prompt suggestions, composer, and message presentation.
- Replace icons and surface treatments that feel generic or overly soft.
- Keep the existing sidebar behavior and full-screen layout.

## Out of Scope

- Changing chat API behavior or streaming logic.
- Redesigning the left knowledge rail structure.
- Changing evaluation, classroom, or portal behavior.
- Narrowing the chat page width.

## Chosen Direction

Use a `SaaS command center` approach.

Why:

- It gives the strongest improvement toward a modern product feel.
- It removes the "AI demo" impression without losing clarity.
- It preserves the immersive layout while making the center surface more intentional.

## UI Direction

### Header

- Reduce the current soft-card feeling.
- Present session context in a tighter, more product-like bar.
- Keep course and learner identity visible, but with less ornamental padding.
- Replace generic-feeling icon emphasis with a more technical session marker.

### Empty State

- Remove the large soft welcome card centered in the canvas.
- Replace it with a cleaner command-style launch surface.
- Headline should be shorter and more operational.
- Prompt suggestions should read like quick actions, not rounded consumer pills.

### Composer

- Composer becomes the main command surface at the bottom.
- Input and send action should look more like a workspace control bar.
- Suggestion chips should feel tighter and sharper.
- Keep the interaction model intact: enter to send, shift-enter for newline.

### Message Bubbles

- Reduce the generic rounded-chat aesthetic.
- Replace "SV" / "AI" style presentation with cleaner participant markers.
- Assistant and learner messages should feel like product panels, not messaging app balloons.
- Preserve citations and markdown readability.

### Icons

- Replace overly familiar education/AI icons where they make the UI feel templated.
- Prefer icons that suggest session, context, command, response, and workflow.
- Icons should feel consistent across header, empty state, composer, and message markers.

## Visual Rules

- Keep the current palette family, but push the visual language toward sharper SaaS surfaces.
- Prefer more disciplined edges, flatter layers, stronger borders, and more selective shadows.
- Reduce oversized rounded corners where they soften the interface too much.
- Keep enough warmth for the learning product context, but bias toward precision over softness.

## Interaction Rules

- Chat remains full-screen and immersive.
- Sidebar interactions remain unchanged.
- Empty-state quick prompts still populate the input.
- Sending, loading, streaming, and read-only states keep current behavior.

## Accessibility and UX Constraints

- Maintain visible focus states on composer, quick prompts, and controls.
- Preserve readable contrast in both themes.
- Keep the composer easy to scan and operate on desktop and mobile.
- Do not make interaction states dependent on color alone.

## Implementation Notes

- Main work will likely center on `components/chat/ChatInterface.tsx`.
- Message visual treatment will likely require `components/chat/MessageBubble.tsx`.
- Existing streaming and data behavior should remain unchanged.

## Testing Expectations

- Empty state still appears correctly when there are no messages.
- Quick prompts still populate the composer.
- Messages still render markdown and citations correctly.
- Composer send behavior remains unchanged.
- Full-screen chat layout remains intact.

## Open Decisions Resolved

- The redesign should be more like a modern SaaS control surface.
- The chat page should remain full-width and immersive.
- The redesign should remove the strongest "generic AI" cues without changing chat behavior.
