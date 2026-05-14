/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-feature
 * Base block: columns
 * Source: https://www.pearson.com/en-us.html
 * Generated: 2026-05-14
 *
 * Handles multiple DOM patterns for two-column layouts:
 * - Pattern A: section with .row > .col-md-* columns (video/image + text)
 * - Pattern B: .content-tile-color-block--half-img (image + figcaption in one tile)
 * - Pattern C: .content-tile-landscape--60-40 / --17-83 (image + figcaption)
 * - Pattern D: section.flex-layout--pin-cta (two text columns side by side)
 *
 * Columns blocks do NOT require field hint comments (xwalk exception).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Determine which pattern we are dealing with
  const isLandscapeTile = element.classList.contains('content-tile-landscape--60-40')
    || element.classList.contains('content-tile-landscape--17-83');
  const isHalfImgTile = element.classList.contains('content-tile-color-block--half-img');
  const isSectionWithRow = element.querySelector(':scope > .container > .row')
    || element.querySelector(':scope > .row');

  if (isLandscapeTile || isHalfImgTile) {
    // Pattern B/C: Single content-tile with picture + figcaption
    const picture = element.querySelector('picture') || element.querySelector('img');
    const figcaption = element.querySelector('.content-tile__figcaption');

    // Column 1: image
    const col1 = [];
    if (picture) {
      const img = picture.tagName === 'IMG' ? picture : picture.querySelector('img');
      if (img) {
        const picEl = img.closest('picture') || img;
        col1.push(picEl);
      }
    }

    // Column 2: text content from figcaption
    const col2 = [];
    if (figcaption) {
      const title = figcaption.querySelector('.content-tile__title, h2, h3');
      if (title) col2.push(title);

      const subtitle = figcaption.querySelector('.content-tile-subtitle');
      if (subtitle) col2.push(subtitle);

      const textContainer = figcaption.querySelector('.content-tile-text');
      if (textContainer) {
        const paragraphs = textContainer.querySelectorAll(':scope > p:not(:has(a)), :scope > h6');
        paragraphs.forEach((p) => col2.push(p));

        const links = textContainer.querySelectorAll('a');
        links.forEach((a) => col2.push(a));
      }
    }

    cells.push([col1.length ? col1 : '', col2.length ? col2 : '']);
  } else if (isSectionWithRow) {
    // Pattern A/D: Section with .row containing column divs
    const row = element.querySelector(':scope > .container > .row')
      || element.querySelector(':scope > .row');

    if (row) {
      // Find actual content columns (skip empty spacer columns like .col-10pct)
      const columns = Array.from(row.children).filter((col) => {
        // Skip empty spacer divs
        if (col.children.length === 0 && col.textContent.trim() === '') return false;
        // Skip cols that are purely spacers (col-10pct with no content)
        if (col.classList.contains('col-10pct') && col.textContent.trim() === '') return false;
        return true;
      });

      const rowCells = [];

      columns.forEach((col) => {
        const cellContent = [];

        // Check for YouTube video
        const youtubeVideo = col.querySelector('.youtube-video');
        if (youtubeVideo) {
          const videoImg = youtubeVideo.querySelector('.youtube-video-inline-img, img');
          const iframe = youtubeVideo.querySelector('iframe');
          if (videoImg) {
            cellContent.push(videoImg);
          }
          if (iframe && iframe.getAttribute('title')) {
            const caption = document.createElement('p');
            caption.textContent = iframe.getAttribute('title');
            cellContent.push(caption);
          }
        }

        // Check for picture/image
        const picture = col.querySelector('picture');
        if (picture && !youtubeVideo) {
          const img = picture.querySelector('img');
          const picEl = img ? img.closest('picture') || img : picture;
          cellContent.push(picEl);
        } else if (!youtubeVideo) {
          const standaloneImg = col.querySelector(':scope > div img, .content-tile__figure > picture img');
          if (standaloneImg && !standaloneImg.closest('.youtube-video')) {
            const pic = standaloneImg.closest('picture') || standaloneImg;
            cellContent.push(pic);
          }
        }

        // Check for text content (content-tile with figcaption)
        const figcaption = col.querySelector('.content-tile__figcaption');
        if (figcaption) {
          const title = figcaption.querySelector('.content-tile__title, h2, h3');
          if (title) cellContent.push(title);

          const subtitle = figcaption.querySelector('.content-tile-subtitle');
          if (subtitle) cellContent.push(subtitle);

          const textContainer = figcaption.querySelector('.content-tile-text');
          if (textContainer) {
            // Get description paragraphs (not link-only paragraphs)
            const elements = textContainer.querySelectorAll(':scope > p, :scope > h6, :scope > b');
            elements.forEach((el) => {
              // If paragraph contains only a link, add just the link
              const links = el.querySelectorAll('a');
              if (links.length > 0 && el.textContent.trim() === Array.from(links).map((a) => a.textContent.trim()).join(' ')) {
                links.forEach((a) => cellContent.push(a));
              } else {
                cellContent.push(el);
              }
            });
          }
        }

        // Check for standalone text (e.g., transcript links below video)
        const textSection = col.querySelector(':scope > .text');
        if (textSection && !figcaption) {
          const links = textSection.querySelectorAll('a');
          links.forEach((a) => cellContent.push(a));
        }

        rowCells.push(cellContent.length ? cellContent : '');
      });

      if (rowCells.length > 0) {
        cells.push(rowCells);
      }
    }
  }

  // Fallback: if no cells were created, try generic two-column extraction
  if (cells.length === 0) {
    const allImages = element.querySelectorAll('picture, img');
    const allText = element.querySelector('.content-tile__figcaption, .content-tile-text');

    const col1 = [];
    const col2 = [];

    if (allImages.length > 0) {
      const firstImg = allImages[0];
      const pic = firstImg.closest('picture') || firstImg;
      col1.push(pic);
    }

    if (allText) {
      const heading = allText.querySelector('h2, h3, .content-tile__title');
      if (heading) col2.push(heading);
      const paras = allText.querySelectorAll('p');
      paras.forEach((p) => col2.push(p));
    }

    if (col1.length || col2.length) {
      cells.push([col1.length ? col1 : '', col2.length ? col2 : '']);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
