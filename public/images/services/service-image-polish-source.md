# Liquid damage and data recovery artwork

Created 29 September 2026 with the built-in image-generation tool. Representative AI-generated service illustrations, not photographs of customer devices or actual repairs.

## Production assets

- `liquid-damage-v5.webp`: 1320 × 1192, 206,072 bytes, transparent WebP. Refines `liquid-damage-v4.webp` with a smaller neutral spill and no cup. Used on the homepage, repairs directory and liquid-damage service page. The previous image is retained for rollback.
- `data-recovery-thumbnail.webp`: 256 × 256, 16,272 bytes, transparent WebP. A simplified two-drive companion used only in the repairs directory. The existing `data-recovery-v2.webp` remains the homepage and data-recovery hero image.

Generated PNG files were encoded as WebP at quality 88 with alpha preserved; the directory thumbnail was also resized to 256 pixels. Original generated PNGs remain in the local generated-images library.

## Liquid damage prompt

Use case: precise-object-edit.
Asset type: transparent website service illustration for Origin Repairs, shown both as a homepage card and a repair-page hero.
Input image 1 is the edit target: the existing laptop, phone and spilled-water illustration.
Primary request: refine this image into convincing premium product photography. Keep the laptop and phone as the main subjects, keep their broad arrangement and neutral graphite/silver palette, and preserve the complete devices inside the frame.
Change the thick bright-blue puddle to a small, thin, natural clear-water spill with subtle neutral reflections and scattered realistic droplets. Reduce the puddle's footprint substantially. Remove the oversized metal cup entirely so the devices remain the focus. Improve material realism with brushed aluminium, glass and natural soft studio illumination; screens are off, no glow. Keep the phone lying in front of the open laptop. Water must look like clear water, not blue gel, melted plastic or a solid pedestal.
Composition: compact balanced cutout, three-quarter perspective, entire laptop and phone visible with a modest transparent margin; a coherent silhouette readable at card sizes. Clean polished edges that work against both charcoal and off-white webpages.
Constraints: genuinely transparent background with alpha, no backdrop, no desk or scene, no baked checkerboard, no text or logos or watermark, no cables, no dramatic splashes or sparks, no new objects. This is an illustrative service asset, not a before-and-after repair photograph.

## Data recovery thumbnail prompt

Use case: product-mockup.
Asset type: compact transparent data-recovery category thumbnail for a repair website; must remain recognisable when displayed at only 40–48 pixels.
Input image 1 is a design/material reference, not the main image to replace. Create a simplified companion to its silver hard drive and graphite storage devices.
Primary request: one open silver hard drive with a clearly recognisable circular platter and simple read arm, plus one compact graphite external solid-state drive tucked partly behind it. Only these two devices. Omit the long detailed exposed NVMe circuit board and tiny intricate components which disappear at thumbnail sizes.
Style: photorealistic premium studio product cutout; brushed silver and matte graphite, physically plausible device shapes, clean soft illumination and restrained highlights.
Composition: close, compact almost-square arrangement, hard drive dominant, three-quarter view with platter facing viewer, complete objects visible, clear separation between silhouettes. Fill most of the canvas with modest transparent breathing room. Strong readability against both charcoal and off-white website backgrounds.
Constraints: genuinely transparent background with alpha; no flat backdrop, no baked checkerboard, no typography, no labels, no logos, no watermark, no glow, no data arrows or decorative icons, no extra props.
