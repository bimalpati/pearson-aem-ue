/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    const bgImage = element.querySelector('.background-video__fallback-image, img[class*="fallback"], .background-video__container img');
    const heading = element.querySelector('.content-tile__title, h1[class*="title"], .content-tile__figcaption h1');
    const subtitle = element.querySelector(".content-tile-text h4, .content-tile-text h3, .content-tile-text p");
    const imageCell = [];
    if (bgImage) {
      const imageHint = document.createComment(" field:image ");
      const frag = document.createDocumentFragment();
      frag.appendChild(imageHint);
      const picture = document.createElement("picture");
      const img = document.createElement("img");
      img.src = bgImage.src || bgImage.getAttribute("src") || "";
      img.alt = bgImage.alt || bgImage.getAttribute("alt") || "";
      picture.appendChild(img);
      frag.appendChild(picture);
      imageCell.push(frag);
    }
    const textCell = [];
    const textFrag = document.createDocumentFragment();
    const textHint = document.createComment(" field:text ");
    textFrag.appendChild(textHint);
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      textFrag.appendChild(h1);
    }
    if (subtitle) {
      const p = document.createElement("p");
      p.textContent = subtitle.textContent.trim();
      textFrag.appendChild(p);
    }
    textCell.push(textFrag);
    const cells = [
      imageCell,
      textCell
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse2(element, { document }) {
    const cardItems = element.querySelectorAll(".carousel__item");
    const cells = [];
    cardItems.forEach((card) => {
      const eyebrow = card.querySelector(".content-tile__eyebrow");
      const heading = card.querySelector(".content-tile__title, h2, h3");
      const textContainer = card.querySelector(".content-tile-text, .rte-container");
      const textCell = document.createDocumentFragment();
      const textHint = document.createComment(" field:text ");
      textCell.appendChild(textHint);
      if (eyebrow) {
        const eyebrowEl = document.createElement("p");
        eyebrowEl.textContent = eyebrow.textContent.trim();
        textCell.appendChild(eyebrowEl);
      }
      if (heading) {
        const headingEl = document.createElement("h3");
        headingEl.textContent = heading.textContent.trim();
        textCell.appendChild(headingEl);
      }
      if (textContainer) {
        const paragraphs = textContainer.querySelectorAll("p");
        paragraphs.forEach((p) => {
          const link = p.querySelector("a");
          if (link) {
            const ctaP = document.createElement("p");
            const ctaLink = document.createElement("a");
            ctaLink.href = link.href;
            ctaLink.textContent = link.textContent.trim();
            if (link.classList.contains("new-window")) {
              ctaLink.target = "_blank";
            }
            ctaP.appendChild(ctaLink);
            textCell.appendChild(ctaP);
          } else {
            const descP = document.createElement("p");
            descP.textContent = p.textContent.trim();
            textCell.appendChild(descP);
          }
        });
      }
      cells.push(["", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse3(element, { document }) {
    const bgImage = element.querySelector('.column-control--bg img, [class*="column-control--bg"] img');
    const imageAlt = bgImage ? bgImage.getAttribute("alt") || "" : "";
    const heading = element.querySelector('h2.content-tile__title, h2[class*="title"], .content-tile__title');
    const subtitle = element.querySelector(".content-tile-text h5, .content-tile-text h4, .content-tile-text h6");
    const allParagraphs = Array.from(element.querySelectorAll(".content-tile-text p"));
    const bodyParagraphs = allParagraphs.filter((p) => {
      const links = p.querySelectorAll("a");
      const textContent = p.textContent.trim();
      if (links.length === 0) return textContent.length > 0;
      const linkText = Array.from(links).map((a) => a.textContent.trim()).join("");
      return textContent !== linkText;
    });
    const ctaLinks = [];
    allParagraphs.forEach((p) => {
      const links = p.querySelectorAll("a");
      if (links.length > 0) {
        const textContent = p.textContent.trim();
        const linkText = Array.from(links).map((a) => a.textContent.trim()).join("");
        if (textContent === linkText) {
          links.forEach((link) => ctaLinks.push(link));
        }
      }
    });
    const imageCell = [];
    if (bgImage) {
      const imageHint = document.createComment(" field:image ");
      imageCell.push(imageHint);
      imageCell.push(bgImage);
      if (imageAlt) {
        const altHint = document.createComment(" field:imageAlt ");
        const altText = document.createElement("p");
        altText.textContent = imageAlt;
        imageCell.push(altHint);
        imageCell.push(altText);
      }
    }
    const textCell = [];
    const textHint = document.createComment(" field:text ");
    textCell.push(textHint);
    if (heading) textCell.push(heading);
    if (subtitle) textCell.push(subtitle);
    bodyParagraphs.forEach((p) => textCell.push(p));
    if (ctaLinks.length > 0) {
      const ctaParagraph = document.createElement("p");
      ctaLinks.forEach((link, idx) => {
        if (idx > 0) ctaParagraph.append(document.createTextNode(" "));
        ctaParagraph.append(link);
      });
      textCell.push(ctaParagraph);
    }
    const cells = [];
    if (imageCell.length > 0) {
      cells.push(imageCell);
    }
    if (textCell.length > 1) {
      cells.push(textCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse4(element, { document }) {
    const cells = [];
    const isLandscapeTile = element.classList.contains("content-tile-landscape--60-40") || element.classList.contains("content-tile-landscape--17-83");
    const isHalfImgTile = element.classList.contains("content-tile-color-block--half-img");
    const isSectionWithRow = element.querySelector(":scope > .container > .row") || element.querySelector(":scope > .row");
    if (isLandscapeTile || isHalfImgTile) {
      const picture = element.querySelector("picture") || element.querySelector("img");
      const figcaption = element.querySelector(".content-tile__figcaption");
      const col1 = [];
      if (picture) {
        const img = picture.tagName === "IMG" ? picture : picture.querySelector("img");
        if (img) {
          const picEl = img.closest("picture") || img;
          col1.push(picEl);
        }
      }
      const col2 = [];
      if (figcaption) {
        const title = figcaption.querySelector(".content-tile__title, h2, h3");
        if (title) col2.push(title);
        const subtitle = figcaption.querySelector(".content-tile-subtitle");
        if (subtitle) col2.push(subtitle);
        const textContainer = figcaption.querySelector(".content-tile-text");
        if (textContainer) {
          const paragraphs = textContainer.querySelectorAll(":scope > p:not(:has(a)), :scope > h6");
          paragraphs.forEach((p) => col2.push(p));
          const links = textContainer.querySelectorAll("a");
          links.forEach((a) => col2.push(a));
        }
      }
      cells.push([col1.length ? col1 : "", col2.length ? col2 : ""]);
    } else if (isSectionWithRow) {
      const row = element.querySelector(":scope > .container > .row") || element.querySelector(":scope > .row");
      if (row) {
        const columns = Array.from(row.children).filter((col) => {
          if (col.children.length === 0 && col.textContent.trim() === "") return false;
          if (col.classList.contains("col-10pct") && col.textContent.trim() === "") return false;
          return true;
        });
        const rowCells = [];
        columns.forEach((col) => {
          const cellContent = [];
          const youtubeVideo = col.querySelector(".youtube-video");
          if (youtubeVideo) {
            const videoImg = youtubeVideo.querySelector(".youtube-video-inline-img, img");
            const iframe = youtubeVideo.querySelector("iframe");
            if (videoImg) {
              cellContent.push(videoImg);
            }
            if (iframe && iframe.getAttribute("title")) {
              const caption = document.createElement("p");
              caption.textContent = iframe.getAttribute("title");
              cellContent.push(caption);
            }
          }
          const picture = col.querySelector("picture");
          if (picture && !youtubeVideo) {
            const img = picture.querySelector("img");
            const picEl = img ? img.closest("picture") || img : picture;
            cellContent.push(picEl);
          } else if (!youtubeVideo) {
            const standaloneImg = col.querySelector(":scope > div img, .content-tile__figure > picture img");
            if (standaloneImg && !standaloneImg.closest(".youtube-video")) {
              const pic = standaloneImg.closest("picture") || standaloneImg;
              cellContent.push(pic);
            }
          }
          const figcaption = col.querySelector(".content-tile__figcaption");
          if (figcaption) {
            const title = figcaption.querySelector(".content-tile__title, h2, h3");
            if (title) cellContent.push(title);
            const subtitle = figcaption.querySelector(".content-tile-subtitle");
            if (subtitle) cellContent.push(subtitle);
            const textContainer = figcaption.querySelector(".content-tile-text");
            if (textContainer) {
              const elements = textContainer.querySelectorAll(":scope > p, :scope > h6, :scope > b");
              elements.forEach((el) => {
                const links = el.querySelectorAll("a");
                if (links.length > 0 && el.textContent.trim() === Array.from(links).map((a) => a.textContent.trim()).join(" ")) {
                  links.forEach((a) => cellContent.push(a));
                } else {
                  cellContent.push(el);
                }
              });
            }
          }
          const textSection = col.querySelector(":scope > .text");
          if (textSection && !figcaption) {
            const links = textSection.querySelectorAll("a");
            links.forEach((a) => cellContent.push(a));
          }
          rowCells.push(cellContent.length ? cellContent : "");
        });
        if (rowCells.length > 0) {
          cells.push(rowCells);
        }
      }
    }
    if (cells.length === 0) {
      const allImages = element.querySelectorAll("picture, img");
      const allText = element.querySelector(".content-tile__figcaption, .content-tile-text");
      const col1 = [];
      const col2 = [];
      if (allImages.length > 0) {
        const firstImg = allImages[0];
        const pic = firstImg.closest("picture") || firstImg;
        col1.push(pic);
      }
      if (allText) {
        const heading = allText.querySelector("h2, h3, .content-tile__title");
        if (heading) col2.push(heading);
        const paras = allText.querySelectorAll("p");
        paras.forEach((p) => col2.push(p));
      }
      if (col1.length || col2.length) {
        cells.push([col1.length ? col1 : "", col2.length ? col2 : ""]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/pearson-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#pi_op_frame_pearson",
        "#pi_rp_frame"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, ["header"]);
      WebImporter.DOMUtils.remove(element, ["footer"]);
      WebImporter.DOMUtils.remove(element, [".skip-nav"]);
      WebImporter.DOMUtils.remove(element, ["#accessibility__announcement"]);
      WebImporter.DOMUtils.remove(element, [".to-top-button"]);
      WebImporter.DOMUtils.remove(element, ["link"]);
      WebImporter.DOMUtils.remove(element, ["noscript"]);
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        "#ot-sdk-btn-floating",
        ".ot-sdk-container",
        '[class*="onetrust"]',
        '[id*="onetrust"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        'img[src*="liadm.com"]',
        'img[src*="ads.linkedin.com"]',
        'img[src*="bat.bing.com"]',
        'img[src*="cookielaw.org"]'
      ]);
    }
  }

  // tools/importer/transformers/homepage-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      let findSectionElement = function(selector) {
        let found = null;
        if (Array.isArray(selector)) {
          for (let s = 0; s < selector.length && !found; s++) {
            found = element.querySelector(selector[s]);
          }
        } else {
          found = element.querySelector(selector);
        }
        return found;
      };
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) {
        return;
      }
      const document = element.ownerDocument;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = findSectionElement(section.selector);
        if (!sectionEl) {
          continue;
        }
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-homepage": parse,
    "cards-promo": parse2,
    "hero-banner": parse3,
    "columns-feature": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Pearson US homepage with hero, featured content, and promotional sections",
    urls: [
      "https://www.pearson.com/en-us.html"
    ],
    blocks: [
      {
        name: "hero-homepage",
        instances: ["main section.background-video--waves"]
      },
      {
        name: "cards-promo",
        instances: ["main section.background-video--waves .carousel-v2"]
      },
      {
        name: "columns-feature",
        instances: [
          "main section.flex-layout--vertically-centered:not(.bgcolor--background-dark)",
          "main section.column-control:not(.bgcolor--background-medium-gray):not(.bgcolor--background-medium):not(.background-video--waves):not(.flex-layout--vertically-centered):not(.bgcolor--background-dark):not(.he-footer-global) > .container > .row > .col-12 > .content-tile.content-tile-color-block--half-img",
          "main section.bgcolor--background-medium-gray .content-tile.content-tile-landscape--60-40",
          "main section.bgcolor--background-medium.has-padding-bottom--15 .content-tile.content-tile-landscape--17-83",
          "main section.flex-layout--pin-cta"
        ]
      },
      {
        name: "hero-banner",
        instances: ["main section.bgcolor--background-dark.cc-gradient"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero with Video Background",
        selector: "main section.background-video--waves",
        style: null,
        blocks: ["hero-homepage", "cards-promo"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Video Feature",
        selector: "main > div > div > .embed > div > section.flex-layout--vertically-centered",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Study Prep Feature",
        selector: "main > div > div > .embed > div > section.column-control:nth-of-type(2)",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "College & Career Readiness",
        selector: "main section.bgcolor--background-dark.cc-gradient",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Flexible Mobile Learning",
        selector: "main section.flex-layout--vertically-centered:nth-of-type(2)",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Transform Careers",
        selector: "main section.column-control > .container > .row > .col-12 > .content-tile.content-tile-color-block--half-img",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Learning Never Stops",
        selector: "main section.bgcolor--background-medium-gray",
        style: "dark",
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "About Pearson",
        selector: [
          "main section.bgcolor--background-medium.has-padding-bottom--15",
          "main section.flex-layout--pin-cta"
        ],
        style: "grey",
        blocks: ["columns-feature"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
