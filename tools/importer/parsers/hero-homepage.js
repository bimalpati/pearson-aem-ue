/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-homepage
 * Base block: hero-homepage
 * Source: https://www.pearson.com/en-us.html
 * Selector: main section.background-video--waves
 * Generated: 2026-05-14
 *
 * UE Model fields:
 *   - image (reference): Background image
 *   - imageAlt (collapsed): Alt text for image
 *   - text (richtext): Heading and subtitle content
 *
 * Block table structure (2 rows):
 *   Row 1: Background image with field hint
 *   Row 2: Rich text content (heading + subtitle) with field hint
 */
export default function parse(element, { document }) {
  // Extract background image from the video fallback image
  const bgImage = element.querySelector('.background-video__fallback-image, img[class*="fallback"], .background-video__container img');

  // Extract heading (H1) from the content tile
  const heading = element.querySelector('.content-tile__title, h1[class*="title"], .content-tile__figcaption h1');

  // Extract subtitle from content-tile-text
  const subtitle = element.querySelector('.content-tile-text h4, .content-tile-text h3, .content-tile-text p');

  // Build Row 1: Image with field hint
  const imageCell = [];
  if (bgImage) {
    const imageHint = document.createComment(' field:image ');
    const frag = document.createDocumentFragment();
    frag.appendChild(imageHint);

    // Create a picture element wrapping the image for proper import handling
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = bgImage.src || bgImage.getAttribute('src') || '';
    img.alt = bgImage.alt || bgImage.getAttribute('alt') || '';
    picture.appendChild(img);
    frag.appendChild(picture);

    imageCell.push(frag);
  }

  // Build Row 2: Text content (heading + subtitle) with field hint
  const textCell = [];
  const textFrag = document.createDocumentFragment();
  const textHint = document.createComment(' field:text ');
  textFrag.appendChild(textHint);

  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    textFrag.appendChild(h1);
  }

  if (subtitle) {
    const p = document.createElement('p');
    p.textContent = subtitle.textContent.trim();
    textFrag.appendChild(p);
  }

  textCell.push(textFrag);

  // Build cells array matching block library structure
  const cells = [
    imageCell,
    textCell,
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
