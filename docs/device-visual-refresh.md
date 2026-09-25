# Device visual refresh — 22 September 2026

These are representative, AI-edited device illustrations based on current manufacturer product references, not unaltered manufacturer photographs. Generated with the built-in image generation tool in edit mode. Originals remain in the generated-images directory; production copies have transparent margins trimmed and are encoded as WebP with alpha transparency.

## Samsung Galaxy S26 Ultra

- Website asset: [`samsung-galaxy-s26-ultra.webp`](../public/images/services/samsung-galaxy-s26-ultra.webp), 1093 × 1093, 99,168 bytes.
- Reference: [Samsung UK Cobalt Violet product gallery](https://images.samsung.com/uk/smartphones/galaxy-s26-ultra/buy/05_Color-Selection/Color-Selection_Cobalt-Violet_PC.jpg).
- Generated original retained outside the repository; the linked WebP is the production asset.
- Used on the Samsung service page and the repair directory.

Prompt:

> Use case: background-extraction. Edit the supplied official Samsung Galaxy S26 Ultra Cobalt Violet product gallery into a polished transparent product cutout for a website hero. Keep ONLY the front-and-back overlapping phone pair plus the S Pen on the LEFT of the reference. Remove the separate third angled phone on the right. Remove the white background completely; output genuine alpha transparency, no checkerboard painted into the image. Preserve the precise phone proportions, cobalt-violet colour, camera arrangement, rounded screen corners, Samsung logo, and lavender display artwork from the left pair unchanged. Do not redesign the devices or add any text. Center the complete pair and pen, with narrow even breathing room and no clipped edges, large and sharp in a roughly square canvas. Keep original realistic studio lighting and polished edges. No floor or background shadow slab.

## iPad Pro

- Website asset: [`ipad-pro-current.webp`](../public/images/services/ipad-pro-current.webp), 1116 × 910, 105,768 bytes.
- Reference: [Apple iPad Pro product image](https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-11-select-wifi-spaceblack-202405?wid=1200&hei=1200&fmt=png-alpha), linked from the current [Apple UK iPad Pro page](https://www.apple.com/uk/ipad-pro/).
- Generated original retained outside the repository; the linked WebP is the production asset.
- A representative modern iPad illustration shared by service images and Apple tablet selectors; it does not imply every selected older model has identical hardware.

Prompt:

> Use case: product-mockup. Create a refined, photo-realistic website product cutout using the supplied current Apple iPad Pro product photo as the hardware reference. A SINGLE modern Space Black iPad Pro, in landscape orientation, floating at a very slight three-quarter angle so the thin aluminium edge is visible. Show the entire device with uniform slim black bezels and clean rounded corners. The display should use a simple luminous blue-to-lilac abstract flowing wallpaper, with NO text, no app icons, no glyphs or distorted letter shapes. Remove the duplicated rear device completely; this is one elegant tablet with a clear silhouette, readable even at 80px wide. Maintain the current iPad Pro's physically realistic proportions and unobtrusive front camera. Premium studio photography, subtle edge highlights so the black tablet works on a dark website, crisp glass and metal. Genuine transparent background with alpha, no backdrop, no checkerboard, no stand, no hand, no accessories, no badges or typography. Center the tablet to occupy most of the canvas, with a little breathing room. Output landscape composition.

## MacBook Pro

- Website asset: [`macbook-pro-open.webp`](../public/images/services/macbook-pro-open.webp), 1200 × 775, 75,554 bytes.
- Reference: [Apple current MacBook Pro product viewer](https://www.apple.com/v/macbook-pro/ax/images/overview/product-viewer/pv_hero_endframe__gc89p7dw1syi_large.jpg), from [Apple UK MacBook Pro](https://www.apple.com/uk/macbook-pro/).
- Generated original retained outside the repository; the linked WebP is the production asset.
- Replaces the older category illustration, including the stale MacBook reference in the device image resolver. Shared by MacBook/laptop service images and Apple laptop selectors. This is a representative category image.

Prompt:

> Use case: product-mockup. Create a clean premium transparent product cutout of a SINGLE current Space Black MacBook Pro using the supplied current Apple product photo as the hardware reference. Preserve the accurate current design: rounded aluminium unibody, slim uniform display bezels with the central camera notch, black keyboard with large trackpad, no Touch Bar, and current thin base. Show it fully open with the keyboard visible in a gentle three-quarter view, not a steep overhead view. Make the display a luminous simple blue-to-indigo flowing abstract wallpaper with no text, symbols, letterforms, icons or badges. Increase the soft studio light enough to clearly show the graphite-grey aluminium base, keyboard edges and silhouette on a dark website without washing out the Space Black colour. It must read as a premium modern laptop even as a 96px-wide thumbnail. Keep physically realistic Apple hardware proportions and geometry. Entire laptop visible, centered, with narrow even breathing room and no clipped edges. Output genuine alpha transparency, no background, no floor, no painted checkerboard or white matte, no shadow slab, no accessories, no hands. Landscape composition.

## Integration

`lib/deviceImages/appleDeviceImages.ts` owns the shared iPad and MacBook paths, so the repair directory, service pages and device selectors use the same images. `lib/serviceImages.ts` owns the Samsung image. Existing approved mixed iPhone/Samsung phone-category imagery is retained.

The Samsung page now includes a larger product hero, direct family navigation, model links with repair-request prefill, and pricing rows that fill the available width. Tablet navigation in the repair directory includes all tablet brands.

## Verification

- Production build, TypeScript and lint passed.
- 32 page/viewport/theme combinations checked at 320, 390, 768, 1023 and 1440 pixels, with no horizontal overflow or broken images.
- Automated accessibility checks passed on refreshed pages at mobile and desktop widths in both themes.
- Samsung model links correctly prefill the repair request; the tablet directory link opens all tablet brands.
- Production desktop/dark and mobile/light checks passed with no browser console errors. Screenshots reviewed for the Samsung hero and the iPad/MacBook directory rows.
