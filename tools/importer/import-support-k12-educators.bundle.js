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

  // tools/importer/import-support-k12-educators.js
  var import_support_k12_educators_exports = {};
  __export(import_support_k12_educators_exports, {
    default: () => import_support_k12_educators_default
  });

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

  // tools/importer/transformers/pearson-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) {
        return;
      }
      const document = element.ownerDocument;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
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

  // tools/importer/import-support-k12-educators.js
  var PAGE_TEMPLATE = {
    name: "support-k12-educators",
    description: "Revel support page for K-12 educators with product information and resources",
    urls: [
      "https://www.pearson.com/en-us/higher-education/products-services/revel/support-k-12-educators.html"
    ],
    blocks: [],
    sections: [
      {
        id: "section-1",
        name: "Page Title Hero",
        selector: "main section.bgcolor--background-dark.has-padding-top--90",
        style: "dark",
        blocks: [],
        defaultContent: [
          "main section.bgcolor--background-dark .content-tile-text h1"
        ]
      },
      {
        id: "section-2",
        name: "Introduction",
        selector: "main > div > div > section.bgcolor--ui-01:not(.has-padding-top--none)",
        style: null,
        blocks: [],
        defaultContent: [
          "main section.bgcolor--ui-01:not(.has-padding-top--none) .content-tile.use-button-tertiary .content-tile-text",
          "main section.bgcolor--ui-01:not(.has-padding-top--none) > .container > .row > div:nth-child(2) > .content-tile:not(.use-button-tertiary) .content-tile-text"
        ]
      },
      {
        id: "section-3",
        name: "Educator Preview and Adoption Registration",
        selector: "main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(3)",
        style: null,
        blocks: [],
        defaultContent: [
          "main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(3) .content-tile-text"
        ]
      },
      {
        id: "section-4",
        name: "How to Purchase",
        selector: "main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(4)",
        style: null,
        blocks: [],
        defaultContent: [
          "main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(4) .content-tile.title-typesize--h1 .content-tile-text",
          "main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(4) .content-tile.pad--0__figure img",
          "main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(4) .content-tile:last-child .content-tile-text"
        ]
      },
      {
        id: "section-5",
        name: "Important Purchasing Details",
        selector: "main section.bgcolor--ui-01.has-padding-top--none.has-padding-bottom--45",
        style: null,
        blocks: [],
        defaultContent: [
          "main section.bgcolor--ui-01.has-padding-top--none.has-padding-bottom--45 .content-tile-text"
        ]
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
  var import_support_k12_educators_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
          blocks: []
        }
      }];
    }
  };
  return __toCommonJS(import_support_k12_educators_exports);
})();
