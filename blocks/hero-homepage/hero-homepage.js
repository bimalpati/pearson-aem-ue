import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length >= 2) {
    const imageRow = rows[0];
    const textRow = rows[1];

    const imageDiv = imageRow.querySelector('picture')?.closest('div');
    if (imageDiv) {
      imageDiv.classList.add('hero-homepage-image');
      moveInstrumentation(imageRow, imageDiv);
    }

    const textDiv = textRow.querySelector('div') || textRow;
    textDiv.classList.add('hero-homepage-content');
    moveInstrumentation(textRow, textDiv);
  }
}
