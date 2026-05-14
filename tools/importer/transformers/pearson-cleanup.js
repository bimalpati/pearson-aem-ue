/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Pearson site-wide cleanup.
 * Removes non-authorable elements (header, footer, navigation, login iframes,
 * breadcrumbs, accessibility announcements, back-to-top button, skip-nav link).
 * All selectors verified from captured DOM in migration-work/cleaned.html.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove login session iframes that may interfere with parsing
    // Found: <iframe id="pi_op_frame_pearson" ...> and <iframe id="pi_rp_frame" ...>
    WebImporter.DOMUtils.remove(element, [
      '#pi_op_frame_pearson',
      '#pi_rp_frame',
    ]);
  }

  if (hookName === H.after) {
    // Remove header (contains top nav .he-navigation-topnav, product nav .he-pr-nav__wrapper, breadcrumbs)
    // Found: <header class="isSticky isVisible">
    WebImporter.DOMUtils.remove(element, ['header']);

    // Remove footer (contains global footer, social links, legal)
    // Found: <footer> at end of page
    WebImporter.DOMUtils.remove(element, ['footer']);

    // Remove skip-nav link
    // Found: <a href="#main-content-starts" class="skip-nav">
    WebImporter.DOMUtils.remove(element, ['.skip-nav']);

    // Remove accessibility announcement div (inside main, non-authorable)
    // Found: <div id="accessibility__announcement">
    WebImporter.DOMUtils.remove(element, ['#accessibility__announcement']);

    // Remove back-to-top button (inside main, non-authorable)
    // Found: <a class="to-top-button is-show" href="#main-content-starts">
    WebImporter.DOMUtils.remove(element, ['.to-top-button']);

    // Remove any remaining link elements (CSS refs in footer)
    // Found: <link href="/etc/clientlibs/...">
    WebImporter.DOMUtils.remove(element, ['link']);

    // Remove any noscript elements (Google Tag Manager)
    WebImporter.DOMUtils.remove(element, ['noscript']);

    // Remove OneTrust cookie consent banner and privacy dialog
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
      '#ot-sdk-btn-floating',
      '.ot-sdk-container',
      '[class*="onetrust"]',
      '[id*="onetrust"]',
    ]);

    // Remove tracking pixels and invisible images
    WebImporter.DOMUtils.remove(element, [
      'img[src*="liadm.com"]',
      'img[src*="ads.linkedin.com"]',
      'img[src*="bat.bing.com"]',
      'img[src*="cookielaw.org"]',
    ]);
  }
}
