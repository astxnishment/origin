# Custom PC service image

Created 25 September 2026 with the built-in image-generation tool. This is a representative AI-generated custom PC illustration, not a photograph of a customer device or a fixed build specification.

Production asset: `custom-pc-modern.webp`, 1200 × 1200, transparent WebP, 186,496 bytes. The generated PNG was resized and encoded with alpha preserved. Original generated files remain outside the repository. The previous `custom-pc-build.webp` is retained for rollback.

Used through `serviceImages.customPc` on the homepage, repairs directory and custom PC service page.

Verification: the replacement loads on all three pages at 1440px and 390px in light and dark themes, with no horizontal overflow or page errors. Desktop hero, mobile hero, homepage cards and directory thumbnails were visually reviewed. The homepage image uses the full width of its existing image area for clearer detail.

## Generation prompt

Use case: product-mockup.
Asset type: a transparent product illustration for the Custom PCs category of the Origin Repairs website, matching its polished, realistic device photography.
Primary request: redesign the custom PC tower image as a refined modern custom-built gaming/workstation PC, attractive and instantly readable both in a small homepage card and a large service-page hero.
Subject: ONE premium pearl-white and satin-aluminium mid-tower PC with a clean rectangular silhouette and panoramic clear tempered-glass side and front. Show the full tower in a natural three-quarter front view, only slightly above eye level. The broad glass side reveals a physically coherent, tidy custom build: a dark motherboard, two seated RAM sticks, one substantial horizontally mounted graphics card, neatly routed sleeved cables, and an AIO CPU cooler with two tubes leading to a top radiator. Three top fans and two side fans use restrained soft ice-blue light with a faint lilac accent, bright enough to distinguish details at thumbnail size. Fine ventilation, realistic case feet, premium clean metal edges. Clearly separate the pale exterior from dark internal hardware. No invented brand markings.
Lighting: crisp photorealistic studio product lighting, balanced exposure, soft reflections on the glass, clearly readable components and elegant white highlights. Suitable on both a near-black page and an off-white page. Contemporary and understated, not aggressive neon rainbow gaming imagery.
Composition: whole case visible, centered, with tight even breathing room and no cropped corners. Slightly taller than wide composition, about 4:5 subject silhouette in a square canvas. No perspective exaggeration.
Background: genuinely transparent alpha outside the device, not a white background and not a painted checkerboard. Keep the device glass and internals rendered realistically. No room, desk, pedestal, floor, big drop shadow, monitor, peripherals, spare components, text, logos, badges or watermark.

## Edge-refinement prompt

Use case: background-extraction. Edit target: the supplied pearl-white custom PC tower product cutout. Keep the PC design, framing, perspective, size, entire hardware, glass, lighting, colours and composition exactly unchanged. Change ONLY the alpha cutout edge: remove the stray opaque white specks, jagged white matte remnants and white blobs OUTSIDE the true physical silhouette, especially above the top edge, along the right edge, and beneath the base and feet. Produce a precise professional smooth anti-aliased cutout of the actual tower. Every exterior pixel beyond the clean silhouette must be fully transparent alpha. Do not erase or thin the white physical case panels or feet. Do not add anything. Do not add a white background, painted black background, checkerboard, glow or shadow. Genuine transparent background suitable for compositing on a near-black website.
