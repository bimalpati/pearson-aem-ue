/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://www.pearson.com/en-us.html
 * Selector: main section.bgcolor--background-dark.cc-gradient
 * Generated: 2026-05-14
 *
 * UE Model fields:
 *   - image (reference): Background image
 *   - imageAlt (text): Alt text for the image
 *   - text (richtext): Heading + subtitle + paragraph + CTA
 *
 * Source DOM structure:
 *   section.column-control.bgcolor--background-dark.cc-gradient
 *     .column-control--bg img                    -> background image
 *     .content-tile__title (h2)                  -> heading
 *     .content-tile-text h5                      -> subtitle
 *     .content-tile-text p (text)                -> body paragraph
 *     .content-tile-text p > a                   -> CTA link
 */
export default function parse(element, { document }) {
  // Extract background image from .column-control--bg
  const bgImage = element.querySelector('.column-control--bg img, [class*="column-control--bg"] img');
  const imageAlt = bgImage ? (bgImage.getAttribute('alt') || '') : '';

  // Extract heading (h2.content-tile__title)
  const heading = element.querySelector('h2.content-tile__title, h2[class*="title"], .content-tile__title');

  // Extract subtitle (h5 inside .content-tile-text)
  const subtitle = element.querySelector('.content-tile-text h5, .content-tile-text h4, .content-tile-text h6');

  // Extract body paragraph(s) - paragraphs that don't contain only links
  const allParagraphs = Array.from(element.querySelectorAll('.content-tile-text p'));
  const bodyParagraphs = allParagraphs.filter((p) => {
    const links = p.querySelectorAll('a');
    const textContent = p.textContent.trim();
    // Keep paragraphs that have text content beyond just links
    if (links.length === 0) return textContent.length > 0;
    // If paragraph only contains links, treat as CTA row
    const linkText = Array.from(links).map((a) => a.textContent.trim()).join('');
    return textContent !== linkText;
  });

  // Extract CTA links - paragraphs that contain only links
  const ctaLinks = [];
  allParagraphs.forEach((p) => {
    const links = p.querySelectorAll('a');
    if (links.length > 0) {
      const textContent = p.textContent.trim();
      const linkText = Array.from(links).map((a) => a.textContent.trim()).join('');
      if (textContent === linkText) {
        links.forEach((link) => ctaLinks.push(link));
      }
    }
  });

  // Build image cell (Row 1): field hints for image and imageAlt
  const imageCell = [];
  if (bgImage) {
    const imageHint = document.createComment(' field:image ');
    imageCell.push(imageHint);
    imageCell.push(bgImage);
    if (imageAlt) {
      const altHint = document.createComment(' field:imageAlt ');
      const altText = document.createElement('p');
      altText.textContent = imageAlt;
      imageCell.push(altHint);
      imageCell.push(altText);
    }
  }

  // Build text cell (Row 2): field hint for text (richtext)
  const textCell = [];
  const textHint = document.createComment(' field:text ');
  textCell.push(textHint);
  if (heading) textCell.push(heading);
  if (subtitle) textCell.push(subtitle);
  bodyParagraphs.forEach((p) => textCell.push(p));
  if (ctaLinks.length > 0) {
    const ctaParagraph = document.createElement('p');
    ctaLinks.forEach((link, idx) => {
      if (idx > 0) ctaParagraph.append(document.createTextNode(' '));
      ctaParagraph.append(link);
    });
    textCell.push(ctaParagraph);
  }

  // Build cells array matching block table structure
  const cells = [];

  // Row 1: Image
  if (imageCell.length > 0) {
    cells.push(imageCell);
  }

  // Row 2: Text content (heading + subtitle + body + CTA)
  if (textCell.length > 1) {
    cells.push(textCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
