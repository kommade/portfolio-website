# Website 2.0

Design source: [Final Screens (Desktop)](https://www.figma.com/design/d6Ro7VkCQBdZ8h6D8KRHzA/New-Website?node-id=1130-590).

The homepage keeps the textile hero from commit `95e2ff2`, with its styles and animation keyframes moved into `app/globals.css`. The public pages share the final navigation, footer, colors, and responsive layout. Tailwind component styles live in the same stylesheet. Existing administrator editing views remain available through `?edit=true`.

## Magic keys

No database migration or password reset is required. The existing password of any account in the Redis `users` list with `role: member` and a bcrypt `hash` now works as a magic key. The connected database was checked and has one usable member account.

- Private case stories show the key form and withhold their content on the server.
- Member sessions last one hour in an HTTP-only cookie.
- Ten attempts per IP are allowed in a 15-minute window. Temporary `magic-key-attempts:<hashed-IP>` counters expire automatically.
- Administrators continue to use `/login?mode=admin` with their username and password. Administrator passwords do not work as member keys.

## Content

The portfolio continues to display existing Redis/S3 content. Figma sample project titles, project copy, and gallery photographs are not substituted for live content or written to the database.

- Optional `sector` and `domain` strings on each `project:<key>` Redis hash populate the preview chips. Missing values are omitted; existing projects remain compatible.
- Existing project body sections generate the case-story contents links and image viewer. Existing team, skillset, and approach fields populate the three overview blocks.
- The new Interaction category uses `interaction:<id>` records with the same `name` and `url` fields as other explorations. It can be populated through the existing upload form. The existing `craft` records display as “Finished Objects.”
- The homepage's two gray image areas are placeholders in the final Figma screens; they remain placeholders pending final imagery.
- The healthcare example and its prototype-animation placeholder in Figma are not database projects. The implemented detail template uses existing project content.

## Checks

Run `bun run build` and `bun test tests/magic-key.test.mjs`. Authentication tests mock the database and do not change real accounts or cookies.

The production build and all six authentication tests pass. Browser checks covered desktop and phone layouts, project selection, locked stories, contents navigation, gallery categories, and photo-viewer keyboard navigation and focus restoration.

Contact submission calls the existing email action. Do not use live contact submissions as smoke tests unless sending email is intended.
