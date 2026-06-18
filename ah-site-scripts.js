// === NOINDEX THIN TAG LISTING PAGES (added 2026-06-16) ===
// Tag pages (/learn/tag/...) are thin, duplicative aggregations and are being
// deprecated (tag links stripped in the session-41 link audit; BlogToPin tag
// pages off). Keep them out of the search index. Runs immediately (this file is
// header-injected) so the robots meta is in the DOM as early as possible for
// crawlers, which render JS and honor a JS-set robots meta. Categories are left
// indexed as browse hubs per the 2026-06-16 decision.
(function () {
  try {
    if (location.pathname.indexOf("/learn/tag/") === 0) {
      var m = document.querySelector('meta[name="robots"]');
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("name", "robots");
        (document.head || document.documentElement).appendChild(m);
      }
      m.setAttribute("content", "noindex, follow");
    }
  } catch (e) {}
})();

// === FOOTER LINKS, CROSS-LINKS, HEADING UPGRADES ===
/*
 * Ambitious Harvest - Footer Code Injection Updates
 * March 2026 - Tasks: Footer links, Cross-links, H2/H3 headings
 *
 * This is the UPDATED footer code injection content.
 * Deploy via POST /api/config/SaveInjectionSettings
 * IMPORTANT: Must send both `postItem` and `footer` fields together.
 */

// ============================================================
// EXISTING: Hero CTA + Footer Links (UPDATED with new links)
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
  // Hero "Start Here" CTA button
  var heroSection = document.querySelector('section[data-section-id="6402865e8544e5fc30e1d9b6"]');
  if (heroSection) {
    var blocks = heroSection.querySelectorAll(".sqs-block");
    var lastBlock = blocks[blocks.length - 1];
    if (lastBlock) {
      var ctaDiv = document.createElement("div");
      ctaDiv.className = "ah-hero-cta";
      ctaDiv.style.cssText = "text-align:center;margin-top:28px;padding:0 20px;";
      var btn = document.createElement("a");
      btn.href = "/start-here";
      btn.className = "sqs-block-button-element";
      btn.textContent = "Start Here";
      btn.style.cssText = "display:inline-block;background-color:#5B7F5E;color:#f8f9f0;border:none;border-radius:6px;font-family:Montserrat,sans-serif;font-weight:600;font-size:0.95rem;letter-spacing:0.04em;text-transform:uppercase;padding:16px 40px;text-decoration:none;transition:background-color 0.3s ease,transform 0.2s ease;box-shadow:0 2px 8px rgba(0,0,0,0.15);";
      btn.onmouseover = function() { this.style.backgroundColor = "#4A6B4D"; };
      btn.onmouseout = function() { this.style.backgroundColor = "#5B7F5E"; };
      ctaDiv.appendChild(btn);
      lastBlock.parentNode.insertBefore(ctaDiv, lastBlock.nextSibling);
    }
  }

  // UPDATED Footer links - now includes all 5 key pages
  var footer = document.querySelector("footer");
  if (footer) {
    var linkRow = document.createElement("div");
    linkRow.className = "ah-footer-links";
    linkRow.style.cssText = "text-align:center;padding:16px 20px 8px;font-family:Montserrat,sans-serif;font-size:0.85rem;border-top:1px solid rgba(0,0,0,0.08);margin-bottom:8px;";
    var sep = '<span style="color:#8c9c8c;margin:0 6px;">&#124;</span>';
    var linkStyle = 'color:#5B7F5E;text-decoration:none;margin:0 8px;font-weight:600;letter-spacing:0.02em;';
    linkRow.innerHTML =
      '<a href="/start-here" style="' + linkStyle + '">Start Here</a>' + sep +
      '<a href="/garden-conditions" style="' + linkStyle + '">Garden Conditions</a>' + sep +
      '<a href="/your-garden-toolkit" style="' + linkStyle + '">Garden Toolkit</a>' + sep +
      '<a href="/garden-events" style="' + linkStyle + '">Garden Events</a>' + sep +
      '<a href="/your-garden-toolkit" style="' + linkStyle + '">Free Planting Calendar</a>';
    var firstChild = footer.querySelector("[class*='footer-'] > div, footer > section, footer > div");
    if (firstChild) {
      firstChild.parentNode.insertBefore(linkRow, firstChild);
    } else {
      footer.insertBefore(linkRow, footer.firstChild);
    }
  }

  // ============================================================
  // NEW: Cross-link "More Free Resources" on resource pages
  // ============================================================
  var path = window.location.pathname;
  var resourcePages = {
    "/garden-events": {
      title: "Garden Events",
      others: [
        { href: "/garden-conditions", name: "Garden Conditions Dashboard", desc: "Live weather, rainfall, and garden tips for Santa Cruz, San Lorenzo Valley, and Watsonville." },
        { href: "/your-garden-toolkit", name: "Your Garden Toolkit", desc: "12 free printable guides, checklists, and planting calendars for Santa Cruz County." }
      ]
    },
    "/your-garden-toolkit": {
      title: "Garden Toolkit",
      others: [
        { href: "/garden-conditions", name: "Garden Conditions Dashboard", desc: "Live weather, rainfall, and garden tips for Santa Cruz, San Lorenzo Valley, and Watsonville." },
        { href: "/garden-events", name: "Garden Events Calendar", desc: "Plant sales, workshops, volunteer days, and garden tours happening in Santa Cruz County." }
      ]
    },
    "/garden-conditions": {
      title: "Garden Conditions",
      others: [
        { href: "/your-garden-toolkit", name: "Your Garden Toolkit", desc: "12 free printable guides, checklists, and planting calendars for Santa Cruz County." },
        { href: "/garden-events", name: "Garden Events Calendar", desc: "Plant sales, workshops, volunteer days, and garden tours happening in Santa Cruz County." }
      ]
    }
  };

  var pageConfig = resourcePages[path];
  if (pageConfig) {
    var crossDiv = document.createElement("div");
    crossDiv.className = "ah-cross-links";
    crossDiv.style.cssText = "max-width:800px;margin:40px auto 20px;padding:30px 28px;background:#f8f9f0;border:1px solid #dde2d8;border-radius:8px;font-family:Montserrat,sans-serif;";
    var html = '<h3 style="color:#1a3b2a;font-size:1.1rem;font-weight:600;margin:0 0 16px;text-align:center;">More Free Resources</h3>';
    pageConfig.others.forEach(function(r) {
      html += '<div style="margin-bottom:14px;text-align:center;">' +
        '<a href="' + r.href + '" style="color:#1c3c2c;font-weight:600;text-decoration:none;font-size:0.95rem;">' + r.name + '</a>' +
        '<p style="color:#8c9c8c;font-size:0.85rem;margin:4px 0 0;line-height:1.4;">' + r.desc + '</p></div>';
    });
    crossDiv.innerHTML = html;

    // Insert before the footer
    var mainContent = document.querySelector("article.sections, main, #sections");
    if (mainContent) {
      mainContent.appendChild(crossDiv);
    }
  }

  // ============================================================
  // NEW: H2/H3 heading upgrades for resource pages
  // ============================================================

  // Events page: Upgrade key text to H2s
  if (path === "/garden-events") {
    // Find and wrap key content in H2s
    var eventsH2s = [
      { find: "Looking for a specific kind of event?", tag: "h2", text: "Find Events by Type" },
      { find: "Never miss an event", tag: "h2", text: "Never Miss an Event" },
      { find: "Know of an event we should add?", tag: "h2", text: "Submit an Event" }
    ];
    eventsH2s.forEach(function(item) {
      var strongs = document.querySelectorAll("strong");
      strongs.forEach(function(el) {
        if (el.textContent.trim() === item.find) {
          var h2 = document.createElement(item.tag);
          h2.textContent = item.text;
          h2.style.cssText = "color:#1a3b2a;font-family:Montserrat,sans-serif;font-weight:600;font-size:1.3rem;margin:0 0 8px;";
          var parentP = el.closest("p");
          if (parentP) {
            parentP.parentNode.insertBefore(h2, parentP);
            // Remove the bold text from the paragraph since it's now a heading
            el.parentNode.removeChild(el);
            // Clean up any leading <br> in the remaining paragraph
            if (parentP.innerHTML.trim().startsWith("<br>")) {
              parentP.innerHTML = parentP.innerHTML.replace(/^\s*<br\s*\/?>\s*/, "");
            }
          }
        }
      });
    });
  }

  // Toolkit page: Upgrade resource names from <strong> to H2s
  if (path === "/your-garden-toolkit") {
    var toolkitNames = [
      "Know Your Microclimate Worksheet",
      "Fire-Wise Gardening Guide",
      "Companion Planting Guide",
      "Seasonal Planting Calendar",
      "Seed Starting Guide",
      "Gopher Control Guide",
      "Tomato Variety Selector",
      "Water-Wise Gardening Guide",
      "Garden Troubleshooting Guide",
      "Raised Bed Planning Guide",
      "Seasonal Tasks Checklist"
    ];
    var allStrongs = document.querySelectorAll("p strong");
    allStrongs.forEach(function(el) {
      var text = el.textContent.trim();
      if (toolkitNames.indexOf(text) !== -1) {
        var h2 = document.createElement("h2");
        h2.textContent = text;
        h2.style.cssText = "color:#1a3b2a;font-family:Montserrat,sans-serif;font-weight:600;font-size:1.2rem;margin:0 0 6px;text-align:center;";
        var parentP = el.closest("p");
        if (parentP) {
          parentP.parentNode.insertBefore(h2, parentP);
          parentP.parentNode.removeChild(parentP);
        }
      }
    });
  }

  // Conditions page: Add H2 for garden tip section (others already have H2s)
  if (path === "/garden-conditions") {
    var tipEl = document.querySelector(".garden-tip, .tip-title, [class*='tip']");
    if (!tipEl) {
      // Look for the garden tip by content
      var allH3s = document.querySelectorAll("h3");
      // The conditions page already has H2s for Rainfall and 7-Day Forecast
      // Just ensure the dashboard title and tip are properly structured
    }
  }
});


// === GEO SCHEMA: FAQ + ARTICLE ===
// ============================================================
// GEO Schema Injection Code for Ambitious Harvest Co
// Append this to the existing postItem code injection field
// in Squarespace (Settings > Advanced > Code Injection > Post Item)
//
// Contains:
//   1. FAQPage schema auto-generation
//   2. Enhanced Article schema (dateModified, author, spatialCoverage)
//
// Size: ~2.5KB (well within limits when added to existing 63.5KB)
// Date: March 2026
// ============================================================

// --- 1. FAQPage Schema ---
// Detects FAQ sections by heading text, extracts Q&A pairs (H3=question, next <p>=answer)
(function(){
  try {
    var entry = document.querySelector('.blog-item-content-wrapper') || document.querySelector('[data-content-field="main-content"]');
    if (!entry) return;
    var headings = entry.querySelectorAll('h1, h2, h3, h4');
    var faqStart = null;
    for (var i = 0; i < headings.length; i++) {
      var txt = headings[i].textContent.toLowerCase();
      if (txt.indexOf('faq') > -1 || txt.indexOf('frequently asked') > -1 || txt.indexOf('common questions') > -1) {
        faqStart = headings[i];
        break;
      }
    }
    if (!faqStart) return;
    var qas = [];
    var node = faqStart.nextElementSibling;
    var currentQ = null;
    while (node) {
      var tag = node.tagName;
      // Stop if we hit another H1 or H2 that is NOT an FAQ question (new major section)
      if ((tag === 'H1' || tag === 'H2') && node !== faqStart) break;
      if (tag === 'H3') {
        if (currentQ && currentQ.a) qas.push(currentQ);
        currentQ = { q: node.textContent.trim(), a: '' };
      } else if (tag === 'P' && currentQ && !currentQ.a) {
        currentQ.a = node.textContent.trim();
      }
      node = node.nextElementSibling;
    }
    if (currentQ && currentQ.a) qas.push(currentQ);
    if (qas.length === 0) return;
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': qas.map(function(qa) {
        return {
          '@type': 'Question',
          'name': qa.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': qa.a
          }
        };
      })
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(schema);
    document.head.appendChild(s);
  } catch(e) {}
})();

// --- 2. Enhanced Article Schema ---
// Finds existing Squarespace Article JSON-LD and enriches it with
// dateModified, author details, and spatialCoverage
(function(){
  try {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      var data;
      try { data = JSON.parse(scripts[i].textContent); } catch(e) { continue; }
      // Handle both single object and @graph array
      var articles = [];
      if (data['@type'] === 'Article' || data['@type'] === 'BlogPosting' || data['@type'] === 'NewsArticle') {
        articles.push(data);
      } else if (data['@graph']) {
        for (var g = 0; g < data['@graph'].length; g++) {
          var item = data['@graph'][g];
          if (item['@type'] === 'Article' || item['@type'] === 'BlogPosting' || item['@type'] === 'NewsArticle') {
            articles.push(item);
          }
        }
      }
      if (articles.length === 0) continue;

      for (var a = 0; a < articles.length; a++) {
        var art = articles[a];

        // dateModified: try meta tag, then visible "Updated" text, then fall back to datePublished
        var modDate = null;
        var metaMod = document.querySelector('meta[property="article:modified_time"]') || document.querySelector('meta[name="last-modified"]');
        if (metaMod && metaMod.content) {
          modDate = metaMod.content;
        }
        if (!modDate) {
          // Look for visible "Updated" or "Last updated" text in the article
          var entry = document.querySelector('.blog-item-content-wrapper') || document.querySelector('[data-content-field="main-content"]');
          if (entry) {
            var allText = entry.textContent;
            var updMatch = allText.match(/(?:updated|last updated|revised)[:\s]*(\w+ \d{1,2},?\s*\d{4}|\d{4}-\d{2}-\d{2})/i);
            if (updMatch) {
              var parsed = new Date(updMatch[1]);
              if (!isNaN(parsed.getTime())) modDate = parsed.toISOString().split('T')[0];
            }
          }
        }
        if (!modDate && art.datePublished) modDate = art.datePublished;
        if (modDate) art.dateModified = modDate;

        // Author enrichment
        if (!art.author || typeof art.author === 'string') {
          art.author = { '@type': 'Person', 'name': 'Adrienne Gaughan' };
        }
        if (typeof art.author === 'object' && !Array.isArray(art.author)) {
          art.author.name = art.author.name || 'Adrienne Gaughan';
          art.author.description = 'Gardenary-certified garden coach with 20+ years of experience gardening in Santa Cruz County';
          art.author.url = 'https://www.ambitiousharvest.com/about';
        }

        // spatialCoverage
        art.spatialCoverage = {
          '@type': 'Place',
          'name': 'Santa Cruz County, California',
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 36.9741,
            'longitude': -122.0308
          },
          'containedInPlace': {
            '@type': 'AdministrativeArea',
            'name': 'California, United States'
          }
        };
      }

      // Write back the enhanced schema
      scripts[i].textContent = JSON.stringify(data);
    }
  } catch(e) {}
})();


// === TOMATO QUIZ CALLOUT ===
// Automatically inserts a quiz callout at the end of all tomato articles.
// Detects articles by URL slug. New tomato articles get the callout automatically.


(function() {
  // Wait for DOM to be ready
  setTimeout(function() {
    var path = window.location.pathname;

    // Only run on /learn/ article pages
    if (path.indexOf('/learn/') === -1) return;

    // Tomato article slugs (exact matches + keyword match)
    var tomatoSlugs = [
      'best-tomatoes-by-microclimate-what-to-grow-where-in-santa-cruz-county',
      'growing-tomatoes-santa-cruz',
      'growing-tomatoes-containers-santa-cruz',
      'heirloom-tomatoes-santa-cruz',
      'harvest-tomatoes-peak-flavor',
      'determinate-vs-indeterminate-tomatoes',
      'starting-tomatoes-from-seed-santa-cruz',
      'saving-tomato-seeds',
      'extending-tomato-season-santa-cruz',
      'watering-tomatoes-in-santa-cruz',
      'california-tomato-gardening-guide',
      'grow-pineapple-tomatoes-santa-cruz',
      'tomato-problems-troubleshooting-santa-cruz',
      'tomato-trellising-techniques-in-your-california-garden',
      'tomato-fertilizing-soil-preparation-santa-cruz',
      'dry-farmed-tomatoes-in-santa-cruz-growing-intense-flavor-with-less-water'
    ];

    var slug = path.replace('/learn/', '').replace(/\/$/, '');

    // Check exact match OR slug contains "tomato" (catches future articles)
    var isTomato = tomatoSlugs.indexOf(slug) !== -1 || slug.indexOf('tomato') !== -1;

    if (!isTomato) return;

    // Don't insert if callout already exists
    if (document.querySelector('.ah-tomato-quiz-callout')) return;

    // Find the article body
    var articleBody = document.querySelector('.blog-item-content-wrapper') ||
                      document.querySelector('[data-content-field="body"]') ||
                      document.querySelector('.entry-content');

    if (!articleBody) return;

    // Create callout
    var callout = document.createElement('div');
    callout.className = 'ah-tomato-quiz-callout';
    callout.innerHTML = '' +
      '<div style="font-family:Montserrat,Arial,sans-serif;background-color:#1a3b2a;border-radius:10px;padding:2rem;margin:2.5rem 0;text-align:center;">' +
        '<p style="font-size:0.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#8c9c8c !important;margin:0 0 0.5rem 0;">Free Quiz</p>' +
        '<p style="font-family:Georgia,serif;font-size:1.4rem;font-weight:normal;color:#f8f9f0 !important;margin:0 0 0.75rem 0;line-height:1.3;">Not sure which tomato varieties grow best in your zone?</p>' +
        '<p style="font-size:0.9rem;color:#dde2d8 !important;margin:0 0 1.25rem 0;line-height:1.6;">Answer 4 quick questions and get zone-matched variety recommendations, plus a free Tomato Variety Selector PDF.</p>' +
        '<a href="/tomato-quiz" style="display:inline-block;background-color:#f8f9f0;color:#1a3b2a !important;text-decoration:none;padding:0.75rem 2rem;border-radius:6px;font-family:Montserrat,Arial,sans-serif;font-size:0.9rem;font-weight:700;">Take the Quiz</a>' +
        '<p style="font-size:0.85rem;color:#dde2d8 !important;margin:1.25rem 0 0 0;">Ready to grow more tomatoes this season? ' +
          '<a href="/tomato-masterkit" style="color:#c9a84c !important;font-weight:700;text-decoration:underline;">Get the Tomato Growing MasterKit</a>' +
        '</p>' +
      '</div>';

    // Insert before the FAQ section if it exists, otherwise at the end
    var faqHeading = null;
    var headings = articleBody.querySelectorAll('h2, h3');
    for (var i = 0; i < headings.length; i++) {
      var text = headings[i].textContent.toLowerCase();
      if (text.indexOf('frequently asked') !== -1 || text.indexOf('faq') !== -1) {
        faqHeading = headings[i];
        break;
      }
    }

    if (faqHeading) {
      faqHeading.parentNode.insertBefore(callout, faqHeading);
    } else {
      articleBody.appendChild(callout);
    }

  }, 1500);
})();

// === GRAPHICS LOADER v2 ===
/**
 * Ambitious Harvest - Graphics Loader v2 (postItem injection)
 *
 * PURPOSE:
 * Protects branded HTML graphics from the Squarespace visual editor.
 * Articles store lightweight placeholder divs instead of full graphic HTML.
 * This loader fetches the graphic HTML from cluster pages at runtime.
 *
 * ARCHITECTURE:
 * - Each article cluster has its own HTML file hosted on GitHub Pages
 * - Each file contains a  that assigns graphics to window.AH_GRAPHICS
 * - This loader determines which cluster an article needs, fetches the file,
 *   extracts the script content, executes it, and renders all placeholder divs
 * - GitHub Pages URL: https://gaughanadrienne-gif.github.io/ah-graphics/
 *
 * PLACEHOLDER FORMAT:
 * <div class="ah-graphic" data-graphic="graphic-id"></div>
 *
 * DEPLOYMENT:
 * Wrap this entire file in ... tags and add to:
 * Settings > Advanced > Code Injection > Blog Post Item (postItem)
 *
 * This replaces the pilot loader (ah-graphics-loader.js) and pilot registry.
 */

// Wait for DOM ready, then run loader
(function() {
  function runLoader() {
    // Only run on article pages under /learn/
    var path = window.location.pathname;
    if (path.indexOf('/learn/') !== 0) return;

  // Extract the article slug from the URL
  var slug = path.replace('/learn/', '').replace(/\/$/, '');
  if (!slug) return;

  // =========================================================================
  // SLUG-TO-CLUSTER LOOKUP TABLE
  // Maps article slugs to their cluster page paths.
  // Generated from graphics_mapping.json by generate-cluster-pages.js
  // =========================================================================
  var SLUG_TO_CLUSTER = {
    "garden-myth-adding-lime-to-california-soil": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-adding-sand-to-clay-soil": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-all-bees-sting-keep-away": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-banana-peels-great-fertilizer": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-beer-traps-best-slug-control": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-bought-ladybugs-stay-in-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-butterflies-moths-all-beneficial": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-cant-compost-citrus-peels": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-cant-grow-blueberries-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-cant-grow-productive-garden-in-shade": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-coffee-grounds-make-soil-acidic": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-companion-planting-always-works": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-compost-bins-attract-rats": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-compost-tea-better-than-compost": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-crushed-eggshells-deter-slugs": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-deep-watering-means-soaking-for-hours": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-dish-soap-safe-garden-spray": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-drip-irrigation-wastes-water": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-drought-tolerant-plants-zero-water": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-eggshells-add-calcium-quickly": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-epsom-salt-helps-all-plants": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-fall-too-late-to-plant-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-garlic-around-roses-deters-aphids": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-hardpan-soil-cant-be-fixed": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-heirloom-varieties-always-taste-better": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-marigolds-repel-all-pests": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-midday-watering-burns-leaves": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-more-fertilizer-means-more-fruit": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-mulch-attracts-termites": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-must-rotate-crops-home-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-must-start-seeds-indoors": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-native-gardens-look-messy-brown": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-need-big-yard-to-grow-food": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-need-compost-tumbler": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-need-expensive-soil-to-start": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-neem-oil-safe-for-everything": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-pine-needles-too-acidic": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-planting-by-moon-phases": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-potting-soil-lasts-forever": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-prune-fruit-trees-perfect-vase": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-pulling-weeds-makes-more-grow": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-remove-all-fallen-leaves": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-rocks-in-bottom-of-pots": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-rusty-nails-help-plants": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-seal-pruning-cuts-wound-paste": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-succulents-zero-maintenance": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-sugar-water-helps-transplant-shock": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-till-soil-every-spring": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-vinegar-safe-effective-herbicide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-water-every-day-california-summers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "garden-myth-water-lawn-every-day-summer": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-mythbusters.html",
    "artichoke-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "artichoke-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "artichoke-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "avocado-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "avocado-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "avocado-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "beefsteak-tomato-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "beefsteak-tomato-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "beefsteak-tomato-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "bell-pepper-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "bell-pepper-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "bell-pepper-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "broccoli-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "broccoli-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "broccoli-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "brussels-sprouts-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "brussels-sprouts-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "brussels-sprouts-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "eureka-lemon-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "eureka-lemon-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "eureka-lemon-san-lorenzo-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "feijoa-pineapple-guava-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "feijoa-pineapple-guava-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "feijoa-pineapple-guava-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "grapes-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "grapes-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "grapes-san-lorenzo-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "heritage-apple-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "heritage-apple-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "heritage-apple-san-lorenzo-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "low-chill-peach-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "low-chill-peach-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "low-chill-peach-san-lorenzo-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "persimmon-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "persimmon-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "persimmon-san-lorenzo-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "potato-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "potato-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "potato-san-lorenzo-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "ranunculus-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "ranunculus-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "ranunculus-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "satsuma-mandarin-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "satsuma-mandarin-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "satsuma-mandarin-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "bush-bean-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "bush-bean-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "bush-bean-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "everbearing-strawberry-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "everbearing-strawberry-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "everbearing-strawberry-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "romaine-lettuce-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "romaine-lettuce-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "romaine-lettuce-san-lorenzo-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "sungold-cherry-tomato-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "sungold-cherry-tomato-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "sungold-cherry-tomato-san-lorenzo-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "zucchini-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "zucchini-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "zucchini-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "blueberry-southern-highbush-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "blueberry-southern-highbush-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "blueberry-southern-highbush-san-lorenzo-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "jalapeno-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "jalapeno-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "jalapeno-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "meyer-lemon-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "meyer-lemon-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "meyer-lemon-san-lorenzo-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "roma-tomato-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "roma-tomato-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "roma-tomato-san-lorenzo-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "santa-cruz-community-gardens-how-to-find-and-join-one": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "composting-rules-santa-cruz-sb-1383-green-waste": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "do-i-need-a-permit-for-a-garden-shed-in-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "sugar-snap-pea-banana-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "sugar-snap-pea-coastal-fog-belt-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "sugar-snap-pea-pajaro-valley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-plantguides.html",
    "acidifying-soil-for-blueberries-in-california-a-step-by-step-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "bats-as-garden-allies-installing-bat-houses-for-natural-mosquito-control": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "best-berries-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "best-carrot-varieties-for-santa-cruz-county-gardens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "best-garlic-varieties-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "best-mulberry-varieties-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "blueberry-problems-in-california-yellow-leaves-no-fruit-and-other-issues": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "california-herb-garden-cocktails": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "carrot-troubleshooting-guide-pests-diseases-and-growing-problems-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "cool-season-vs-warm-season-grasses-3B8GL": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "fire-wise-raised-bed-materials-and-placement": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "garden-highlight-herb-sage": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "garlic-onion-troubleshooting": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "grow-blackberries-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "grow-matilija-poppy-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-nativeplants.html",
    "grow-mulberries-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "grow-parsley-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-blueberries-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-carrots-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-chives-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-garlic-onions-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-manzanita-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-nativeplants.html",
    "growing-olallieberries-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-onions-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-raspberries-in-containers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-shallots-leeks-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "harvesting-and-using-olallieberries-from-garden-to-pie": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "harvesting-curing-garlic-onions": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "harvesting-using-mulberries-recipes-preservation": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "how-to-prune-raspberries-a-step-by-step-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "mulberries-in-permaculture-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "mulberry-propagation-cuttings-grafting-layering": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "olallieberry-troubleshooting-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "olallieberry-vs-blackberry": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "organic-pest-control-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "overwinter-carrots-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "planting-garlic-fall-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "preserving-fresh-herbs": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "preventing-basil-from-bolting": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "propagate-blackberries-olallieberries": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "prune-trellis-blackberries": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "quick-harvest-vegetables-for-impatient-santa-cruz-gardeners": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "raised-beds-vs-in-ground-gardening-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "raspberry-problems-pests-diseases-and-common-issues": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "squash-vine-borer-prevention-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "succession-planting-carrots-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "toxic-plants-kids-pets-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "troubleshooting-mulberry-problems": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "pole-beans-vs-bush-beans-which-to-grow": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
    "9-vegetables-that-thrive-in-redwood-shade-for-san-lorenzo-valley-gardeners": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "attracting-beneficial-insects-to-your-santa-cruz-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "beneficial-insects-california-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "common-garden-pests-in-santa-cruz-county-and-how-to-beat-them": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "deer-resistant-vegetable-gardening-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "fire-wise-gardening-101-protecting-your-home-and-garden-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "garden-highlight-eggplant": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "garden-highlight-herb-basil": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "garden-highlight-kohlrabi": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "garden-highlight-malabar-spinach": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "garden-planning-101-mapping-your-space": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "garden-prep-from-lawn-to-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "garden-science-experiments-kids-summer": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "gardening-with-kids-101-growing-the-next-generation-of-gardeners": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "gopher-control-what-actually-works-in-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "greywater-basics-california-gardeners": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "grow-cilantro-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "grow-dill-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "grow-mint-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "growin-thyme-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "growing-calendula-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "growing-oregano-in-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "how-to-find-the-sunniest-spot-in-your-yard": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "how-to-read-a-soil-test": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "how-to-start-a-vegetable-garden-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "in-bed-vermicomposting-composting-with-worms-directly-in-your-garden-beds": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "microclimate-gardening-warm-cool-spots": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "ollas-irrigation-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "organic-pest-identification-guide-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "owls-as-garden-allies-installing-owl-boxes-for-natural-rodent-control": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "preserving-summer-harvest-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "reading-seed-packets-what-all-those-numbers-mean": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "slug-and-snail-control-in-foggy-santa-cruz-gardens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "square-foot-gardening-maximizing-space-for-higher-yields": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "succession-planting-for-beginners": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "summer-garden-survival-guide-coastal-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "the-3-best-bulk-soils-for-santa-cruz-county-vegetable-gardens-and-where-to-get-them": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "the-first-5-vegetables-to-grow-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "the-hidden-danger-of-rodent-poison-protecting-santa-cruz-wildlife": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "transplants-vs-seeds-when-and-where-to-buy-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "understanding-frost-dates-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "understanding-your-soil-a-guide-for-santa-cruz-gardeners": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "watering-basics-how-much-how-often-and-when": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "what-to-plant-in-santa-cruz-amp-the-bay-area-in-august": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "what-to-plant-in-santa-cruz-amp-the-bay-area-in-december": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "what-to-plant-in-santa-cruz-amp-the-bay-area-in-november": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "what-to-plant-in-santa-cruz-amp-the-bay-area-in-october": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "what-to-plant-in-santa-cruz-amp-the-bay-area-in-september": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "what-to-plant-together-raised-beds": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-3.html",
    "when-to-plant-what-understanding-our-year-round-season": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-2.html",
    "your-first-season-timeline-what-to-expect-month-by-month": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-2026-june-1.html",
    "growing-microgreens-at-home": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-microgreens.html",
    "best-microgreen-varieties": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-microgreens.html",
    "growing-sprouts-safely": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-microgreens.html",
    "windowsill-herb-garden-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-microgreens.html",
    "year-round-indoor-growing-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-microgreens.html",
    "microgreens-nutrition-benefits": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-greens.html",
    "growing-beans-and-peas-in-santa-cruz-county-easy-protein-from-your-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
    "growing-sugar-snap-and-snow-peas-in-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
    "growing-fava-beans-winter-cover-crop-and-food": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
    "succession-planting-beans-for-continuous-harvest": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
    "bean-and-pea-troubleshooting-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
    "saving-bean-and-pea-seeds": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
    "growing-citrus-in-santa-cruz-county-what-actually-works-and-what-doesnt": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-citrus.html",
    "growing-meyer-lemons-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-citrus.html",
    "growing-citrus-in-containers-the-mobility-advantage": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-citrus.html",
    "growing-cut-flower-garden-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "growing-dahlias-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "growing-sunflowers-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "growing-snapdragons-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "growing-celosia-in-santa-cruz-county-bold-texture-for-warm-season-bouquets": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "growing-strawflowers-in-santa-cruz-county-the-everlasting-cut-flower": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "preparing-your-vegetable-garden-for-fire-season": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "groundcovers-that-replace-lawn-and-reduce-fire-risk": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "fire-wise-fencing-and-structures-preventing-fire-pathways-to-your-home": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "after-the-fire-restoring-your-garden-post-wildfire": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "summer-garden-irrigation-for-fire-safety": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "growing-figs-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-fruittrees.html",
    "fruit-tree-troubleshooting": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-fruittrees.html",
    "container-gardening-growing-vegetables-herbs-and-flowers-in-pots": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "vertical-gardening-growing-upwards-to-save-space": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "keyhole-gardening-combining-composting-and-gardening-in-one-bed": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "lasagna-gardening-layering-your-way-to-a-fertile-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "back-to-eden-gardening-a-no-till-wood-chip-mulch-method": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "how-to-keep-a-garden-journal-and-why-you-should": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "kids-rainbow-garden-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "dr-seuss-garden-activities-kids": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "building-a-pizza-garden-with-kids": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "kids-fairy-garden-real-plants-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "kids-butterfly-garden-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "kids-moonlight-garden-white-flowers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "kids-peter-rabbit-storybook-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "kids-dinosaur-garden-prehistoric-plants": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "kids-sunflower-fort-living-playhouse": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "best-lettuce-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-greens.html",
    "growing-spinach-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-greens.html",
    "cut-and-come-again-greens-maximizing-your-harvest": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-greens.html",
    "greens-troubleshooting-bolting-bitterness-and-pests": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-greens.html",
    "beginner-vegetables-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "common-beginner-mistakes-and-how-to-avoid-them": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "edible-flowers-growing-and-using-flowers-in-your-kitchen": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "garden-tools-you-actually-need-and-what-you-dont": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "grow-herbs-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "plants-repel-mosquitoes-california-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "composting-101-from-kitchen-scraps-to-garden-gold": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "diy-ollas-sustainable-watering-made-simple": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "5-gopher-control-methods-that-actually-work-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "the-9-best-plant-nurseries-in-santa-cruz-county-and-what-each-does-best": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "eco-friendly-gardening-garden-consultant": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "native-plants-for-pollinators": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-nativeplants.html",
    "best-pepper-varieties-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-peppers.html",
    "growing-sweet-peppers-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-peppers.html",
    "grow-hot-peppers-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-peppers.html",
    "growing-shishito-padron-peppers-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-peppers.html",
    "grow-manzano-peppers-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-peppers.html",
    "grow-chiltepin-peppers-in-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-peppers.html",
    "growing-peppers-in-containers-in-santa-cruz-county-the-mobility-advantage": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-peppers.html",
    "starting-peppers-from-seed": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-peppers.html",
    "when-to-plant-peppers-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-peppers.html",
    "why-your-peppers-wont-turn-red": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-peppers.html",
    "pepper-problems-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-peppers.html",
    "grow-squash-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "best-zucchini-varieties-for-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "growing-winter-squash-in-santa-cruz-county-from-planting-to-storage": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "growing-cucumbers-in-santa-cruz-county-crisp-harvests-despite-cool-summers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "growing-melons-in-santa-cruz-county-which-microclimates-work-and-which-do-not": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "powdery-mildew-on-squash-prevention-and-treatment-for-santa-cruz-gardens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "hand-pollinating-squash-for-better-yields-in-santa-cruz-gardens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "growing-strawberries-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-strawberries.html",
    "best-strawberry-varieties-for-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-strawberries.html",
    "strawberries-ground-vs-raised-beds-vs-containers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-strawberries.html",
    "planting-bare-root-strawberries-a-santa-cruz-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-strawberries.html",
    "strawberry-growth-stages-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-strawberries.html",
    "top-strawberry-mistakes-new-gardeners": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-strawberries.html",
    "strawberry-troubleshooting-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-strawberries.html",
    "multiply-strawberries-runners-free-plants": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-strawberries.html",
    "reviving-strawberries-after-harsh-weather": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-strawberries.html",
    "growing-succulents-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-succulents.html",
    "succulent-container-gardens-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-succulents.html",
    "succulents-fire-wise-landscaping": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-succulents.html",
    "propagating-succulents": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-succulents.html",
    "succulent-problems-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-succulents.html",
    "dudleya-california-native-succulents": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-succulents.html",
    "growing-tomatoes-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "heirloom-tomatoes-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "best-tomatoes-by-microclimate-what-to-grow-where-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "determinate-vs-indeterminate-tomatoes": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "growing-tomatoes-containers-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "starting-tomatoes-from-seed-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "tomato-fertilizing-soil-preparation-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "tomato-trellising-techniques-in-your-california-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "watering-tomatoes-in-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "tomato-problems-troubleshooting-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "extending-tomato-season-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "harvest-tomatoes-peak-flavor": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "saving-tomato-seeds": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "dry-farmed-tomatoes-in-santa-cruz-growing-intense-flavor-with-less-water": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "grow-pineapple-tomatoes-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "starting-a-backyard-flock-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "choosing-the-right-breeds-for-coastal-california-gardens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "designing-a-predator-proof-run-for-your-garden-flock": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "raising-chicks-and-ducklings-in-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "what-to-feed-your-backyard-flock-year-round-in-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "common-health-issues-backyard-chickens-ducks-geese": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "adopting-rescue-birds-quarantine-deworming-flock-introduction": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "keeping-a-mixed-flock-chickens-ducks-geese-together": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "how-your-flock-can-work-your-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "composting-with-chicken-and-duck-waste": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "managing-free-range-time-protecting-plants": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "best-and-worst-garden-plants-for-free-range-flock": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "keeping-ducks-in-your-california-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "keeping-a-goose-single-goose-flocks": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "heritage-and-rescue-chicken-breeds-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "predator-proofing-your-flock-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "hardware-cloth-coop-locks-night-safety": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "what-to-do-when-a-predator-gets-in": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "seasonal-flock-care-spring-summer-coastal-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "seasonal-flock-care-fall-winter-coastal-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "santa-cruz-county-backyard-flock-predator-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "santa-cruz-county-flock-care-calendar-month-by-month": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "best-chicken-breeds-for-the-santa-cruz-fog-belt": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "keeping-your-flock-cool-in-santa-cruz-summer-heat": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "growing-flock-treats-best-garden-crops-for-chickens-ducks-geese": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "backyard-flock-first-aid-kit-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "chickens-or-ducks-for-a-santa-cruz-backyard": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "hatchery-chicks-or-rescue-hens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "deep-litter-or-sand-coop-bedding-coastal-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "standard-or-bantam-chicken-breeds-small-backyard": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "flock-natural-pest-control-coastal-santa-cruz-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "chicken-tractors-mobile-coops-santa-cruz-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "keeping-a-flock-in-the-san-lorenzo-valley": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "where-to-buy-chicks-feed-coop-supplies-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "finding-a-poultry-avian-vet-santa-cruz-monterey-bay": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "avian-flu-santa-cruz-county-backyard-flock": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "adding-new-hens-flock-integration-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "keeping-the-coop-dry-mud-mold-santa-cruz-winters": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "diy-predator-proof-coop-run-plans-small-santa-cruz-lot": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "best-ducks-for-the-santa-cruz-fog-belt": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "avocado-cold-protection-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-avocados.html",
    "avocado-problems-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-avocados.html",
    "avocado-tree-care-calendar-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-avocados.html",
    "best-avocado-varieties-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-avocados.html",
    "from-pit-to-tree-growing-avocado-from-seed": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-avocados.html",
    "growing-avocados-containers-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-avocados.html",
    "growing-avocados-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-avocados.html",
    "brassica-pests-diseases-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-brassicas.html",
    "brassica-planting-calendar-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-brassicas.html",
    "growing-broccoli-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-brassicas.html",
    "growing-brussels-sprouts-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-brassicas.html",
    "growing-cabbage-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-brassicas.html",
    "growing-cauliflower-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-brassicas.html",
    "growing-kale-broccoli-rabe-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-brassicas.html",
    "growing-limes-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-citrus.html",
    "best-cover-crops-home-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-covercrops.html",
    "cover-crop-mixes-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-covercrops.html",
    "cover-crops-santa-cruz-complete-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-covercrops.html",
    "how-to-terminate-cover-crops": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-covercrops.html",
    "summer-cover-crops-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-covercrops.html",
    "winter-cover-crops-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-covercrops.html",
    "cool-season-cut-flowers-for-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "cut-flower-garden-layout-and-spacing": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "cut-flowers-for-pollinators-beauty-that-gives-back": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "growing-cut-flowers-from-seed-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "growing-cut-flowers-in-partial-shade": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "growing-ranunculus-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "growing-sweet-peas-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "how-to-harvest-cut-flowers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "succession-planting-cut-flowers-for-continuous-blooms": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "warm-season-cut-flowers-for-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "best-apple-varieties-for-santa-cruz-microclimates": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-fruittrees.html",
    "growing-stone-fruit-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-fruittrees.html",
    "sensory-garden-for-babies-and-toddlers-engaging-little-ones-in-the-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "beautiful-vegetables-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "beginner-gardening-mistakes": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "best-fruit-trees-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "best-herbs-containers-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "best-vegetables-containers-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "best-vegetables-raised-beds-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "companion-plants-cucumbers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "companion-plants-peppers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "companion-plants-strawberries": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "easy-vegetables-from-seed-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "are-microgreens-more-nutritious": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-microgreens.html",
    "growing-herbs-on-windowsill-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-microgreens.html",
    "5-gopher-control-methods-that-actually-work-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "eco-friendly-gardening-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "benefits-native-garden-design-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-nativeplants.html",
    "best-succulents-coastal-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-succulents.html",
    "dry-farmed-tomatoes-in-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "best-blackberry-varieties-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "best-blueberry-varieties-for-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "best-citrus-varieties-for-santa-cruz-microclimates": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-citrus.html",
    "blackberry-growth-stages": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "blackberry-problems-pests-diseases": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "fire-wise-gardening-with-california-natives": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "garden-highlight-lupine": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "grow-blackberries-containers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "grow-california-lilac-ceanothus-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-nativeplants.html",
    "grow-rosemary-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-blueberries-in-containers-a-california-gardeners-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-pumpkins-in-santa-cruz-county-from-seed-to-jack-o-lantern": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "growing-raspberries-in-santa-cruz-county-a-complete-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "raised-bed-basics-for-bay-area-gardeners": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "santa-cruz-garden-checklist-february": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "raspberry-growth-stages-what-to-expect-year-by-year": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-garden-checklist-april": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-garden-checklist-march": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-microclimates": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "toyon-california-holly-native-shrub": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-nativeplants.html",
    "what-not-to-plant-near-your-home-fire-hazard-plants-to-avoid": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "10-fire-resistant-plants-for-santa-cruz-gardens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "5-easy-crops-kids-can-grow-in-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "artichokes-vs-cardoon": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "bagged-soil-vs-bulk-soil": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "bare-root-fruit-tree-guide-bay-area": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-fruittrees.html",
    "bare-root-vs-container-fruit-trees": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-fruittrees.html",
    "beneficial-insects-vs-pesticides": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "best-raspberry-varieties-for-santa-cruz-county-gardens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "blossom-end-rot-vs-sunscald": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "bt-vs-hand-picking": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "bush-beans-vs-pole-beans": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
    "california-fruit-trees": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-fruittrees.html",
    "california-garden-soil-amendments-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "california-gardening-unique-melons-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "california-natives-vs-mediterranean-plants": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-nativeplants.html",
    "california-poppy-meaning-benefits-and-uses-beyond-the-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "can-i-grow-avocados-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-avocados.html",
    "cedar-vs-redwood-raised-beds": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "chicken-wire-vs-hardware-cloth": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "companion-planting-vs-row-covers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "container-garden-vs-raised-bed-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "copper-tape-vs-iron-phosphate": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "cover-crops-vs-mulch-winter-beds": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-covercrops.html",
    "crop-rotation-vs-companion-planting": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "deep-watering-vs-frequent-light-watering": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "dormant-spray-vs-growing-season-spray": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "drip-irrigation-setup-101-a-beginners-guide-to-efficient-watering": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "drip-irrigation-vs-ollas": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "drip-irrigation-vs-soaker-hoses": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "drip-tape-vs-drip-line": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "edible-landscape-design-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "fabric-grow-bags-vs-plastic-pots": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "fall-garden-cleanup-for-fire-safety": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "fall-planting-vs-spring-planting": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "fire-resistant-fruit-trees-for-santa-cruz-gardens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "fire-wise-design-for-slopes-and-hillsides": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "fire-wise-herb-gardens-low-growing-high-moisture-plants": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "fire-wise-landscaping-on-a-budget": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "fire-wise-maintenance-a-seasonal-checklist-for-santa-cruz-gardeners": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "fire-wise-pollinator-gardens-for-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "floating-row-cover-vs-shade-cloth": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "from-soil-health-to-water-conservation-sustainable-land-management-tips-for-every-gardener": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "full-sun-garden-vs-partial-shade-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "garden-fork-vs-broadfork": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "garden-highlight-california-poppy": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "garden-myth-organic-pesticides-always-safe": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "gardening-coastal-aptos-capitola-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "gardening-in-the-san-lorenzo-valley-sunny-ridges-vs-shaded-canyons": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "gardening-in-watsonville-amp-the-pajaro-valley-making-the-most-of-our-warmest-microclimate": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "gopher-baskets-vs-raised-beds": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "grafted-vs-own-root-fruit-trees": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-fruittrees.html",
    "grafting-fruit-trees-in-santa-cruz-county-add-varieties-save-trees-and-grow-your-own": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-fruittrees.html",
    "grow-radishes-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-cosmos-flowers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "growing-stone-fruit-in-santa-cruz-county-peaches-plums-apricots-and-nectarines": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
    "growing-sweet-peas-in-santa-cruz-county-fragrant-favorites-for-cool-season-bouquets": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
    "growing-under-the-redwoods-gardening-in-shade-and-acidic-soil": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "growing-zinnias-summer-garden-guide": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "heirloom-vs-hybrid-tomatoes": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "hot-composting-vs-cold-composting": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "how-gardening-shapes-kids-eating-habits-what-the-research-shows-and-how-to-make-it-work": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "how-gardening-supports-kids-mental-health-building-emotional-resilience-in-the-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "how-much-do-i-really-need-to-water-my-garden-in-fall-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "how-much-do-i-really-need-to-water-my-garden-in-spring-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "how-much-do-i-really-need-to-water-my-garden-in-summer-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "how-much-do-i-really-need-to-water-my-garden-in-winter-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "how-to-eliminate-mosquitoes-in-your-santa-cruz-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "innovative-composting-techniques-for-urban-gardeners": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "living-with-wildlife-raccoons-squirrels-amp-other-garden-raiders": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "metal-raised-beds-vs-wood-raised-beds": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "meyer-lemon-vs-eureka-lemon": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-citrus.html",
    "mulch-and-soil-health-the-hidden-irrigation-system-in-your-santa-cruz-county-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "mulch-vs-ground-cover-plants": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "neem-oil-vs-insecticidal-soap": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "no-till-vs-traditional-tilling": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "organic-fertilizer-vs-synthetic-fertilizer": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "perlite-vs-vermiculite": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "physical-and-developmental-benefits-of-gardening-with-kids-building-bodies-and-brains-in-the-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardeningwithkids.html",
    "powdery-mildew-vs-downy-mildew": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "primocane-vs-floricane-raspberries-which-should-you-grow-in-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "pruning-and-training-fruit-trees-in-santa-cruz-county-shape-your-trees-for-better-harvests": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-fruittrees.html",
    "pruning-in-winter-vs-summer": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "rainwater-harvesting-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "raised-beds-vs-in-ground-santa-cruz-clay": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "red-worms-vs-nightcrawlers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "root-vegetables-direct-seed-fall-winter-harvest": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-garden-checklist-august": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-garden-checklist-december": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-garden-checklist-january": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-garden-checklist-july": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-garden-checklist-june": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-garden-checklist-may": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-garden-checklist-november": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-garden-checklist-october": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "santa-cruz-garden-checklist-september": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "soaker-hoses-vs-sprinklers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "square-foot-gardening-vs-row-gardening": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "start-broccoli-cauliflower-seeds-fall-harvest": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-brassicas.html",
    "starting-seeds-indoors-vs-direct-sowing": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-microgreens.html",
    "straw-mulch-vs-wood-chip-mulch": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "succession-planting-vs-all-at-once-planting": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "sugar-snap-vs-snow-peas": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
    "sungold-vs-sweet-100-cherry-tomatoes": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-tomatoes.html",
    "the-complete-guide-to-watering-your-garden-in-santa-cruz-county-a-year-round-data-driven-approach": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "the-santa-cruz-banana-belt-gardening-in-the-countys-goldilocks-microclimate": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "timer-based-vs-moisture-sensor-irrigation": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "vegetable-gardens-in-fire-zones-growing-food-safely-in-fire-country": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-firewise.html",
    "water-wise-wonders-10-drought-resistant-plants-for-a-thriving-california-garden": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "why-native-garden-design-is-essential-for-eco-friendly-landscaping": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-nativeplants.html",
    "worm-castings-vs-finished-compost": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenplanning.html",
    "zone-0-ember-resistant-landscaping-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-miscellaneous.html",
    "zucchini-vs-yellow-summer-squash": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "7-fruit-trees-that-actually-produce-well-in-foggy-coastal-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-fruittrees.html",
    "citrus-problems-yellow-leaves-leaf-drop-and-no-fruit": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-citrus.html",
    "citrus-cold-protection-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-citrus.html",
    "fertilizing-citrus-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-citrus.html",
    "growing-limes-in-santa-cruz-county-and-why-its-tricky": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-citrus.html",
    "growing-mandarins-and-satsumas-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-citrus.html",
    "best-bean-varieties-for-santa-cruz-gardens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
    "the-complete-guide-to-growing-squash-and-cucumbers-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-squash.html",
    "companion-plants-zucchini": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "crops-clay-soil-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "crops-foggy-coastal-summers": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "crops-grow-winter-coastal-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "crops-handle-heat-waves-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "crops-produce-all-season": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "crops-regrow-after-cutting": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "crops-small-gardens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "crops-store-well-after-harvest": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "plants-repel-garden-pests-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
    "native-groundcovers-for-santa-cruz-gardens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-nativeplants.html",
    "native-plants-by-microclimate-what-to-grow-where-in-santa-cruz-county": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-nativeplants.html",
    "growing-ranunculus-in-santa-cruz-county-springs-most-elegant-cut-flower": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-cutflowers.html",
  };

  // =========================================================================
  // CLUSTER CACHE
  // Prevents re-fetching cluster data on SPA-style navigation
  // =========================================================================
  window._ahClusterCache = window._ahClusterCache || {};

  // =========================================================================
  // CORE LOGIC
  // =========================================================================

  // Initialize the graphics namespace
  window.AH_GRAPHICS = window.AH_GRAPHICS || {};

  // Determine which cluster this article needs
  var clusterPage = SLUG_TO_CLUSTER[slug];

  // Self-healing manifest: per-slug list of {gid, after} (the heading each graphic sits under).
  // Lets the loader RE-INJECT any placeholder the Squarespace editor strips on save, so graphics
  // never silently vanish again. Hosted alongside the clusters.
  var MANIFEST_URL = 'https://gaughanadrienne-gif.github.io/ah-graphics/ah-graphics-manifest.json';

  var placeholders = document.querySelectorAll('.ah-graphic[data-graphic]');
  var hasPlaceholders = placeholders.length > 0;

  // Nothing to do if this slug has no placeholders AND no cluster mapping.
  if (!hasPlaceholders && !clusterPage) return;

  // Load the manifest, then the cluster, then render existing placeholders + self-heal missing ones.
  ensureManifest(function () {
    if (!clusterPage) { renderAndHeal(); return; }
    if (window._ahClusterCache[clusterPage] === 'loaded') { renderAndHeal(); return; }
    loadCluster(clusterPage, renderAndHeal);
  });

  function renderAndHeal() {
    renderPlaceholders();           // fill placeholders that survived
    selfHeal();                     // re-inject any the editor stripped
    renderPlaceholders();           // fill the freshly re-injected ones
  }

  // Fetch the manifest once, cache on window, and always call cb (even on failure -> {}).
  function ensureManifest(cb) {
    if (window._ahManifest) { cb(); return; }
    if (window._ahManifestLoading) { window._ahManifestLoading.push(cb); return; }
    window._ahManifestLoading = [cb];
    fetch(MANIFEST_URL).then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (j) {
        window._ahManifest = j || {};
        var q = window._ahManifestLoading || []; window._ahManifestLoading = null;
        for (var i = 0; i < q.length; i++) { try { q[i](); } catch (e) {} }
      });
  }

  // Re-inject any expected graphic whose placeholder is gone, after its section heading.
  // Robust against bad manifests: never stacks multiple graphics on one heading -- if the
  // anchor is the article title, a non-content heading, or already taken, it falls through
  // to the next available content heading so graphics stay distributed through the article.
  function selfHeal() {
    var spec = window._ahManifest && window._ahManifest[slug];
    if (!spec || !spec.length) return;
    var root = document.querySelector('.blog-item-content, [data-content-field="main-content"], article, main') || document;
    var h2s = root.querySelectorAll('h2');
    if (!h2s.length) return;
    var SKIP = /frequently asked|related articles|downloadable guides|local resources/i;
    var texts = [], contentIdx = [];
    for (var j = 0; j < h2s.length; j++) {
      texts[j] = (h2s[j].getAttribute('data-orig-heading') || h2s[j].textContent || '').replace(/\s+/g, ' ').trim();
      // content headings = everything except the first (article title) and trailing boilerplate
      if (j > 0 && texts[j] && !SKIP.test(texts[j])) contentIdx.push(j);
    }
    var used = {};
    function nextUnusedFrom(start) {
      for (var c = 0; c < contentIdx.length; c++) { if (contentIdx[c] >= start && !used[contentIdx[c]]) return contentIdx[c]; }
      for (var c2 = 0; c2 < contentIdx.length; c2++) { if (!used[contentIdx[c2]]) return contentIdx[c2]; }
      return null;
    }
    for (var k = 0; k < spec.length; k++) {
      var gid = spec[k].gid;
      var after = (spec[k].after || '').replace(/\s+/g, ' ').trim();
      if (!gid) continue;
      if (document.querySelector('[data-graphic="' + gid + '"]')) continue; // still present, leave it
      var ti = null;
      // Pass 1: exact heading match (avoids grabbing the longer article title via substring).
      for (var j1 = 0; j1 < h2s.length; j1++) { if (texts[j1] && texts[j1] === after) { ti = j1; break; } }
      // Pass 2: substring match, tolerant of display-time normalization.
      if (ti === null) {
        for (var j2 = 0; j2 < h2s.length; j2++) {
          if (!texts[j2]) continue;
          if (texts[j2].indexOf(after) > -1 || (after.length > 12 && after.indexOf(texts[j2]) > -1)) { ti = j2; break; }
        }
      }
      // If unmatched, the title (index 0), or already used by an earlier graphic this run,
      // fall through to the next available content heading so nothing stacks.
      if (ti === null || ti === 0 || used[ti]) ti = nextUnusedFrom(ti === null ? 0 : ti);
      if (ti === null) continue;
      used[ti] = true;
      var div = document.createElement('div');
      div.className = 'ah-graphic';
      div.setAttribute('data-graphic', gid);
      var target = h2s[ti];
      if (target.nextSibling) target.parentNode.insertBefore(div, target.nextSibling);
      else target.parentNode.appendChild(div);
    }
  }

  /**
   * Fetch a cluster HTML file from GitHub Pages, extract the script content,
   * and execute it to populate window.AH_GRAPHICS.
   */
  function loadCluster(clusterUrl, callback) {
    // Mark as loading to prevent duplicate fetches
    window._ahClusterCache[clusterUrl] = 'loading';

    fetch(clusterUrl)
    .then(function(response) {
      if (!response.ok) throw new Error('Cluster fetch failed: ' + response.status);
      return response.text();
    })
    .then(function(html) {
      // Extract script content from the HTML file
      var scriptContent = extractScriptContent(html);

      if (scriptContent) {
        // Execute the script to populate window.AH_GRAPHICS
        try {
          var fn = new Function(scriptContent);
          fn();
        } catch (e) {
          // Script execution failed; log but do not break the page
        }
      }

      // Mark as loaded
      window._ahClusterCache[clusterUrl] = 'loaded';

      if (callback) callback();
    })
    .catch(function(err) {
      // Fetch failed. Graphics will not appear, but the article is still readable.
      window._ahClusterCache[clusterUrl] = 'error';
      if (callback) callback();
    });
  }

  /**
   * Extract JavaScript content from script tags within the HTML body.
   * Handles the case where Squarespace wraps Code Block content in divs.
   * Concatenates all script blocks found (cluster pages have one).
   */
  function extractScriptContent(html) {
    if (!html) return '';
    var startTag = '<' + 'script>';
    var endTag = '</' + 'script>';
    var start = html.indexOf(startTag);
    var end = html.indexOf(endTag);
    if (start > -1 && end > -1) {
      return html.substring(start + startTag.length, end).trim();
    }
    return '';
  }

  /**
   * Find all unrendered placeholder divs and inject their graphic HTML.
   */
  function renderPlaceholders() {
    var els = document.querySelectorAll('.ah-graphic[data-graphic]:not([data-rendered])');
    for (var i = 0; i < els.length; i++) {
      var id = els[i].getAttribute('data-graphic');
      if (id && window.AH_GRAPHICS[id]) {
        els[i].innerHTML = window.AH_GRAPHICS[id];
        els[i].setAttribute('data-rendered', 'true');
        // Remove any "loading" text that might be inside the placeholder
        els[i].style.minHeight = 'auto';
      }
    }
  }

  }
  // Run when DOM is ready, or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runLoader);
  } else {
    runLoader();
  }
})();
// === MASTERKIT BUY BUTTON FIX (2026-06-11) ===
// The landing page buy buttons were authored against a guessed product slug
// before the product existed. Rewrite them to the real product URL.
(function() {
  var DEAD = '/store/the-tomato-growing-masterkit-california-edition';
  var REAL = '/store/p/04risdgzwd80jwjjzj7oxza4xw6ft6';
  function fixButtons() {
    var links = document.querySelectorAll('a[href="' + DEAD + '"], a[href^="' + DEAD + '?"]');
    for (var i = 0; i < links.length; i++) links[i].setAttribute('href', REAL);
    if (links.length) console.log('[AH] fixed ' + links.length + ' MasterKit buy link(s)');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(fixButtons, 300); });
  } else {
    setTimeout(fixButtons, 300);
  }
})();

// === GARDEN COOP -> BUILD YOUR FLOCK CROSS-LINK (2026-06-16) ===
// Flock/coop articles get a callout to the Build Your Flock local availability tool.
// Shared so the product callout below can step aside on these articles.
function ahIsFlockArticle(slug) {
  var FLOCK = {
    'adding-new-hens-flock-integration-santa-cruz': 1,
    'adopting-rescue-birds-quarantine-deworming-flock-introduction': 1,
    'avian-flu-santa-cruz-county-backyard-flock': 1,
    'backyard-chicken-rules-santa-cruz-county-city-by-city': 1,
    'backyard-flock-first-aid-kit-california': 1,
    'best-and-worst-garden-plants-for-free-range-flock': 1,
    'best-chicken-breeds-for-the-santa-cruz-fog-belt': 1,
    'best-ducks-for-the-santa-cruz-fog-belt': 1,
    'can-one-goose-protect-a-backyard-flock': 1,
    'chicken-tractors-mobile-coops-santa-cruz-garden': 1,
    'chicken-wire-vs-hardware-cloth': 1,
    'chickens-or-ducks-for-a-santa-cruz-backyard': 1,
    'choosing-the-right-breeds-for-coastal-california-gardens': 1,
    'common-health-issues-backyard-chickens-ducks-geese': 1,
    'composting-with-chicken-and-duck-waste': 1,
    'deep-litter-or-sand-coop-bedding-coastal-california': 1,
    'designing-a-predator-proof-run-for-your-garden-flock': 1,
    'diy-predator-proof-coop-run-plans-small-santa-cruz-lot': 1,
    'do-motion-sensor-lights-actually-deter-predators': 1,
    'finding-a-poultry-avian-vet-santa-cruz-monterey-bay': 1,
    'flock-natural-pest-control-coastal-santa-cruz-garden': 1,
    'growing-flock-treats-best-garden-crops-for-chickens-ducks-geese': 1,
    'hardware-cloth-coop-locks-night-safety': 1,
    'hatchery-chicks-or-rescue-hens': 1,
    'heritage-and-rescue-chicken-breeds-santa-cruz': 1,
    'how-do-i-keep-my-flock-cool-during-inland-california-heat': 1,
    'how-do-i-protect-free-range-birds-from-hawks': 1,
    'how-often-should-i-clean-my-chicken-run': 1,
    'how-your-flock-can-work-your-garden': 1,
    'keeping-a-flock-in-the-san-lorenzo-valley': 1,
    'keeping-a-goose-single-goose-flocks': 1,
    'keeping-a-mixed-flock-chickens-ducks-geese-together': 1,
    'keeping-ducks-in-your-california-garden': 1,
    'keeping-the-coop-dry-mud-mold-santa-cruz-winters': 1,
    'keeping-your-flock-cool-in-santa-cruz-summer-heat': 1,
    'managing-free-range-time-protecting-plants': 1,
    'predator-proofing-your-flock-santa-cruz-county': 1,
    'raising-chicks-and-ducklings-in-santa-cruz': 1,
    'santa-cruz-county-backyard-flock-predator-guide': 1,
    'santa-cruz-county-flock-care-calendar-month-by-month': 1,
    'seasonal-flock-care-fall-winter-coastal-california': 1,
    'seasonal-flock-care-spring-summer-coastal-california': 1,
    'selling-and-storing-backyard-eggs-in-california': 1,
    'should-i-worry-about-bird-flu-in-my-backyard-flock': 1,
    'standard-or-bantam-chicken-breeds-small-backyard': 1,
    'starting-a-backyard-flock-in-santa-cruz-county': 1,
    'what-predator-is-getting-into-my-coop-at-night': 1,
    'what-to-do-when-a-predator-gets-in': 1,
    'what-to-feed-your-backyard-flock-year-round-in-california': 1,
    'where-to-buy-chicks-feed-coop-supplies-santa-cruz-county': 1,
    'why-is-my-hen-sitting-on-the-nest-all-day': 1
  };
  if (FLOCK[slug]) return true;
  return /flock|coop|chicken|duckling|ducks|goose|geese|poultry|pullet|rooster|hatchery|hatchling|free-range|brooder|broody|avian|chicks|bird-flu/.test(slug);
}
(function() {
  if (location.pathname.indexOf('/learn/') !== 0) return;
  setTimeout(function() {
    var slug = location.pathname.replace('/learn/', '').replace(/\/$/, '');
    if (!ahIsFlockArticle(slug)) return;
    if (document.querySelector('.ah-flock-callout')) return;

    var articleBody = document.querySelector('.blog-item-content-wrapper') ||
                      document.querySelector('[data-content-field="body"]') ||
                      document.querySelector('.entry-content');
    if (!articleBody) return;

    var box = document.createElement('div');
    box.className = 'ah-prod ah-flock-callout';
    box.innerHTML = '' +
      '<div class="cov"><img src="https://gaughanadrienne-gif.github.io/ah-graphics/flock-guide-cover.jpg" alt=""></div>' +
      '<div><div class="eb">Go deeper · The complete guide</div>' +
        '<h4>The California Backyard Flock Starter Guide</h4>' +
        '<p>Everything for chickens, ducks, and geese in one place: choosing your birds, a predator-proof coop, feeding, eggs, health, and a year-round calendar, plus printable resources.</p>' +
        '<span class="price">$12.99</span>' +
        '<a class="ah-cta" href="/store/p/the-california-backyard-flock-starter-guide">View the guide</a>' +
        '<p style="margin:0.85rem 0 0 0;font-size:0.8rem;color:#5a6c5a !important;line-height:1.5;">Looking for birds right now? <a href="/build-your-flock" style="color:#4A7A5B !important;font-weight:700;text-decoration:underline;">Browse local availability with Build Your Flock &rarr;</a></p>' +
      '</div>';

    var faqHeading = null;
    var headings = articleBody.querySelectorAll('h2, h3');
    for (var j = 0; j < headings.length; j++) {
      var t = headings[j].textContent.toLowerCase();
      if (t.indexOf('frequently asked') !== -1 || t.indexOf('faq') !== -1) { faqHeading = headings[j]; break; }
    }
    if (faqHeading) faqHeading.parentNode.insertBefore(box, faqHeading);
    else articleBody.appendChild(box);
  }, 1500);
})();

// === CONTEXTUAL PRODUCT CALLOUTS (2026-06-11) ===
// Routes each article to its most relevant Garden Shop product.
// Tomato articles are excluded (the quiz callout already carries the MasterKit CTA).
// Flock/coop articles are excluded (they carry the Build Your Flock callout instead).
(function() {
  if (location.pathname.indexOf('/learn/') !== 0) return;
  setTimeout(function() {
    var slug = location.pathname.replace('/learn/', '').replace(/\/$/, '');
    if (slug.indexOf('tomato') !== -1) return;
    if (ahIsFlockArticle(slug)) return;
    if (document.querySelector('.ah-flock-callout')) return;
    if (document.querySelector('.ah-product-callout')) return;

    var IMGBASE = 'https://images.squarespace-cdn.com/content/v1/6257536342b010638376c856/';
    var IMG = function (c, w) { return IMGBASE + c + '?format=' + w + 'w'; };
    var P = {
      kids:      { url: '/store/p/kids-garden-activity-pack-santa-cruz-county-edition', title: 'Kids Garden Activity Pack', line: 'Hands-on garden activities, trackers, and badges for curious kids.', price: '$7.99', cover: '023d295f-7a0e-4b51-9228-c1367bd499e2/kids-garden-activity-pack-1-cover.jpeg' },
      dahlia:    { url: '/store/p/california-dahlia-growing-guide', title: 'California Dahlia Growing Guide', line: 'Zone-by-zone tuber timing and an overwintering flowchart for California.', price: '$9.99', cover: 'a0525226-76c1-45ed-a278-08d34d0a8d31/dahlia-growing-guide-1-cover.jpeg' },
      herb:      { url: '/store/p/herb-growing-kitchen-garden-guide-california-edition', title: 'Herb Growing Kitchen Garden Guide', line: 'Every herb from seed to cutting board, tuned to our Mediterranean climate.', price: '$9.99', cover: '7732bc6b-b114-4f88-9a8a-42d50b803083/herb-growing-kitchen-garden-guide-1-cover.jpeg' },
      firewise:  { url: '/store/p/firewise-food-garden-kit-california-edition', title: 'Firewise Food Garden Kit', line: 'Make your food garden part of your defensible space plan.', price: '$14.99', cover: 'bc7fe7f5-933e-44b5-9a20-69a3d96aaef8/firewise-food-garden-kit-1-cover.jpeg' },
      water:     { url: '/store/p/water-wise-garden-workbook-california-edition', title: 'Water-Wise Garden Workbook', line: 'Audit your water use and redesign your garden with real numbers.', price: '$9.99', cover: '3929876c-ddbc-48a5-ae55-ec2794fb4bf6/water-wise-garden-workbook-1-cover.jpeg' },
      pest:      { url: '/store/p/gopher-pest-defense-kit-santa-cruz-county-edition', title: 'Gopher & Pest Defense Kit', line: 'The integrated five-step defense system for gophers and garden pests.', price: '$12.99', cover: '5cb21a0c-210c-411a-b76b-b3c3c4396dc4/gopher-pest-defense-kit-1-cover.jpeg' },
      compost:   { url: '/store/p/composting-soil-building-guide', title: 'Composting & Soil Building Guide', line: 'Composting methods built for real California clay and sand soils.', price: '$9.99', cover: '8306991f-4a67-4e17-bada-65addfbb1a9e/composting-soil-building-guide-1-cover.jpeg' },
      container: { url: '/store/p/container-small-space-garden-guide', title: 'Container & Small Space Garden Guide', line: 'Real harvests from balconies, patios, and doorsteps.', price: '$9.99', cover: 'a7e35ce3-9894-4fc8-85ec-42437b1f4cf0/container-garden-guide-1-cover.jpeg' },
      preserve:  { url: '/store/p/preserving-the-harvest-guide-california-edition', title: 'Preserving the Harvest Guide', line: 'Tested canning, freezing, drying, and fermenting methods. Safety first.', price: '$9.99', cover: '93eccbe4-594c-4fd5-b7b8-abddf6596906/preserving-the-harvest-guide-1-cover.jpeg' },
      seed:      { url: '/store/p/seed-starting-success-kit-santa-cruz-county-edition', title: 'Seed Starting Success Kit', line: 'Sowing dates and transplant timing built for our five microclimates.', price: '$9.99', cover: 'fbc91ab7-4aec-42af-8ef9-f77d7ae2d425/seed-starting-success-kit-1-cover.jpeg' },
      companion: { url: '/store/p/companion-planting-master-chart-guide', title: 'Companion Planting Master Chart & Guide', line: 'Pairings backed by mechanisms, not folklore, mapped to our seasons.', price: '$9.99', cover: '2b058961-8abc-41e0-81b4-1e9c8fb28faf/companion-planting-chart-guide-1-cover.jpeg' },
      micro:     { url: '/store/p/microclimate-mastery-guide-santa-cruz-county-edition', title: 'Microclimate Mastery Guide', line: 'The five real growing zones of Santa Cruz County, decoded.', price: '$12.99', cover: 'b3c3da63-ceef-4b34-910e-2943b9a4bbab/microclimate-mastery-guide-1-cover.jpeg' },
      seasonal:  { url: '/store/p/seasonal-planting-master-guide-santa-cruz-county-edition', title: 'Seasonal Planting Master Guide', line: 'Twelve months of planting mapped to your microclimate.', price: '$12.99', cover: 'fc77da29-add8-40e5-9fcb-49f23f9720e1/seasonal-planting-master-guide-1-cover.jpeg' },
      first:     { url: '/store/p/first-harvest-kit-california-edition', title: 'First Harvest Kit', line: 'From bare ground to your first harvest, every decision in order.', price: '$14.99', cover: 'dd2f6938-54ca-4c68-9aa8-240e26854d4c/first-harvest-kit-1-cover.jpeg' },
      planner:   { url: '/store/p/garden-planner-journal-santa-cruz-county-edition', title: 'Garden Planner & Journal', line: 'Twelve monthly spreads designed to print, with local planting windows.', price: '$7.99', cover: '0993fac6-834e-4747-b62d-8ba39939350c/garden-planner-journal-1-cover.jpeg' }
    };

    var RULES = [
      [/kids|sensory|dinosaur|fairy|pizza-garden|butterfly-way|moonlight|peter-rabbit|seuss|sunflower-fort/, 'kids'],
      [/dahlia/, 'dahlia'],
      [/herb|basil|mint-|-mint|dill|thyme|oregano|parsley|chives|cilantro|sage|rosemary/, 'herb'],
      [/firewise|fire-wise|fire-safe|defensible|ember|wildfire|after-the-fire/, 'firewise'],
      [/water-wise|drought|irrigation|greywater|ollas|rainwater|watering/, 'water'],
      [/gopher|pest|slug|snail|aphid|deer-|rodent|squirrel|vole|earwig|powdery-mildew|hornworm|owl-box|owls-as/, 'pest'],
      [/compost|vermicompost|soil|mulch|amendment|fertiliz/, 'compost'],
      [/container|grow-bag|windowsill|balcony|pots/, 'container'],
      [/preserv|canning|freez|drying|ferment|pickl/, 'preserve'],
      [/seed/, 'seed'],
      [/companion/, 'companion'],
      // Microclimate guide now also covers citrus, fruit trees, and cold/frost topics
      // (previously these matched no rule, so the article had no product CTA at all).
      [/microclimate|frost|fog-belt|june-gloom|cold-protect|cold-hardy|citrus|avocado|apple|lemon|orange|fruit-tree|stone-fruit|peach|plum|pear|fig/, 'micro'],
      [/what-to-plant|checklist|january|february|march|april|-may|june|july|august|september|october|november|december|seasonal|succession|planting-calendar/, 'seasonal'],
      [/beginner|first-|start-a-vegetable|new-gardener|mistakes/, 'first'],
      [/journal|planner|planning/, 'planner']
    ];

    var prod = null;
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(slug)) { prod = P[RULES[i][1]]; break; }
    }
    if (!prod) return;

    var articleBody = document.querySelector('.blog-item-content-wrapper') ||
                      document.querySelector('[data-content-field="body"]') ||
                      document.querySelector('.entry-content');
    if (!articleBody) return;

    // Card-with-cover design. Uses the .ah-prod styles injected by the article
    // enhancement block below (present on every article page).
    var box = document.createElement('div');
    box.className = 'ah-prod ah-product-callout';
    box.innerHTML = '' +
      '<div class="cov"><img src="' + IMG(prod.cover, 400) + '" alt=""></div>' +
      '<div><div class="eb">Go deeper · Recommended guide</div>' +
      '<h4>' + prod.title + '</h4>' +
      '<p>' + prod.line + '</p>' +
      '<span class="price">' + prod.price + '</span>' +
      '<a class="ah-cta" href="' + prod.url + '">View the guide</a></div>';

    var faqHeading = null;
    var headings = articleBody.querySelectorAll('h2, h3');
    for (var j = 0; j < headings.length; j++) {
      var t = headings[j].textContent.toLowerCase();
      if (t.indexOf('frequently asked') !== -1 || t.indexOf('faq') !== -1) { faqHeading = headings[j]; break; }
    }
    if (faqHeading) faqHeading.parentNode.insertBefore(box, faqHeading);
    else articleBody.appendChild(box);
  }, 1600);
})();

// === FAST GROWING TREES AFFILIATE CALLOUT (2026-06-18) ===
// Contextual affiliate card on fruit-tree / avocado / berry articles (citrus excluded).
// Adrienne is a genuine Fast Growing Trees customer (AH's own fruit trees and
// tropical pond plants). Code-based program: the link carries reader code
// FGTAMBITIOUS20 plus referral attribution (resolves to FGT's ambassador page).
// Fully reversible: remove this whole block.
(function () {
  if (location.pathname.indexOf('/learn/') !== 0) return;
  if (location.pathname.indexOf('/learn/category/') === 0) return;
  setTimeout(function () {
    var slug = location.pathname.replace('/learn/', '').replace(/\/$/, '');
    if (slug.indexOf('tomato') !== -1) return; // cherry-tomato etc. are not FGT
    // citrus terms (lemon/orange/mandarin/etc.) intentionally EXCLUDED: FGT cannot
    // ship citrus to California (state citrus quarantine), so a citrus FGT link is a
    // dead end for our CA audience. Avocado/deciduous/fig/berries ship to CA fine.
    var FRUIT = /bare-root|grafted|own-root|fruit-tree|stone-fruit|avocado|apple|peach|nectarine|plum|pear|fig|apricot|cherry|persimmon|pomegranate|mulberry|blueberr|raspberr|blackberr|strawberr|elderberr/;
    if (!FRUIT.test(slug)) return;
    if (document.querySelector('.ah-fgt-callout')) return;

    var articleBody = document.querySelector('.blog-item-content-wrapper') ||
                      document.querySelector('[data-content-field="body"]') ||
                      document.querySelector('.entry-content');
    if (!articleBody) return;

    var LINK = 'https://checkout.fast-growing-trees.com/FGTAMBITIOUS20';
    var box = document.createElement('aside');
    box.className = 'ah-fgt-callout';
    box.setAttribute('style', 'display:block;margin:30px 0;padding:22px 24px;background:#F8F9F0!important;border:1px solid #dde2d8;border-left:5px solid #1A3B2A;border-radius:10px;');
    box.innerHTML = '' +
      '<div style="font:700 11px/1 Montserrat,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#7a6a3a!important;margin-bottom:9px;">Where we buy our trees &middot; Affiliate partner</div>' +
      '<div style="font-family:Palatino Linotype,Georgia,serif;color:#1A3B2A!important;font-size:21px;margin:0 0 7px;">Fast Growing Trees</div>' +
      '<p style="font:15px/1.6 Montserrat,sans-serif;color:#2a2a28!important;margin:0 0 15px;">We have ordered from Fast Growing Trees many times and genuinely recommend them. All of our tropical pond plants come from them, and they ship established, ready-to-plant trees and shrubs straight to your door.</p>' +
      '<a href="' + LINK + '" target="_blank" rel="sponsored nofollow noopener" style="display:inline-block;background:#1A3B2A!important;color:#F8F9F0!important;font:700 13px/1 Montserrat,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:14px 26px;border-radius:4px;text-decoration:none!important;border-bottom:0!important;">Shop Fast Growing Trees</a>' +
      '<div style="font:12px/1.5 Montserrat,sans-serif;color:#6b6b66!important;margin-top:13px;">Reader code FGTAMBITIOUS20 is built into this link. As an affiliate, we may earn a commission at no extra cost to you.</div>';

    var h2s = articleBody.querySelectorAll('h2');
    var nonFaq = [], faqH = null;
    for (var i = 0; i < h2s.length; i++) {
      var t = h2s[i].textContent.toLowerCase();
      if (t.indexOf('frequently asked') !== -1 || t.indexOf('faq') !== -1) { if (!faqH) faqH = h2s[i]; }
      else nonFaq.push(h2s[i]);
    }
    if (nonFaq.length >= 2) nonFaq[1].parentNode.insertBefore(box, nonFaq[1]);
    else if (faqH) faqH.parentNode.insertBefore(box, faqH);
    else articleBody.appendChild(box);
  }, 1700);
})();

// === FAST GROWING TREES INLINE TEXT LINKS (2026-06-18) ===
// Adds one in-prose affiliate link (rel=sponsored nofollow) to a specific phrase
// on key fruit-tree articles, complementing the .ah-fgt-callout card. Client-side
// and fully reversible. Links the FIRST in-prose occurrence only; skips headings,
// existing links, and the callout card. Add slugs/phrases to MAP to extend.
(function () {
  if (location.pathname.indexOf('/learn/') !== 0) return;
  var LINK = 'https://checkout.fast-growing-trees.com/FGTAMBITIOUS20';
  // No citrus articles here: FGT can't ship citrus to California.
  var MAP = {
    'bare-root-vs-container-fruit-trees': 'missed the bare-root season',
    'grafted-vs-own-root-fruit-trees': 'grafted trees',
    'best-avocado-varieties-santa-cruz': 'avocado tree',
    'growing-avocados-santa-cruz': 'avocado tree',
    'growing-avocados-containers-california': 'avocado tree',
    'fire-resistant-fruit-trees-for-santa-cruz-gardens': 'fruit trees',
    'garden-myth-cant-grow-blueberries-california': 'blueberries'
  };
  setTimeout(function () {
    var slug = location.pathname.replace('/learn/', '').replace(/\/$/, '');
    var phrase = MAP[slug];
    if (!phrase) return;
    var body = document.querySelector('.blog-item-content-wrapper') ||
               document.querySelector('[data-content-field="body"]') ||
               document.querySelector('.entry-content');
    if (!body || body.querySelector('a.ah-fgt-inline')) return;

    var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null, false);
    var node;
    while ((node = walker.nextNode())) {
      var skip = false;
      for (var el = node.parentNode; el && el !== body; el = el.parentNode) {
        var tn = el.nodeName.toLowerCase();
        if (tn === 'a' || tn === 'h1' || tn === 'h2' || tn === 'h3' || tn === 'h4' || tn === 'h5' || tn === 'h6') { skip = true; break; }
        if (el.className && ('' + el.className).indexOf('ah-fgt') !== -1) { skip = true; break; }
      }
      if (skip) continue;
      var idx = node.nodeValue.indexOf(phrase);
      if (idx === -1) continue;
      var before = node.nodeValue.slice(0, idx);
      var after = node.nodeValue.slice(idx + phrase.length);
      var a = document.createElement('a');
      a.className = 'ah-fgt-inline';
      a.href = LINK; a.target = '_blank'; a.rel = 'sponsored nofollow noopener';
      a.textContent = phrase;
      a.setAttribute('style', 'color:#1A3B2A!important;text-decoration:underline;');
      var frag = document.createDocumentFragment();
      if (before) frag.appendChild(document.createTextNode(before));
      frag.appendChild(a);
      if (after) frag.appendChild(document.createTextNode(after));
      node.parentNode.replaceChild(frag, node);
      return;
    }
  }, 1800);
})();

// === ARTICLE TEMPLATE ENHANCEMENT (2026-06-16) — SITE-WIDE ===
// Redesign of the article reading experience on every /learn/ article. Adds an
// "In this guide" jump box, marigold H2 accents, normalized section headers, an
// author box, a green downloads box, and image-based related cards (broken links
// dropped). The product CTA is handled by the contextual-callout block above,
// which renders the card-with-cover ".ah-prod" markup these styles target.
// Fully reversible: remove this whole block.
(function () {
  function onArticle() {
    return location.pathname.indexOf('/learn/') === 0 &&
           location.pathname.indexOf('/learn/category/') !== 0 &&
           document.querySelector('.blog-item-content');
  }
  function init() {
    if (!onArticle() || document.getElementById('ah-enh-style')) return;

    // --- Internal link repair (link audit 2026-06-16) ---------------------
    // Remap known-broken cross-links to their correct slug, and neutralize dead
    // tag-page links (tag pages are disabled, so they 404). Runs before the
    // related-card builder below, so corrected links render as real cards.
    var LINK_REMAP = {
      '/learn/avocado-problems-in-california': '/learn/avocado-problems-california',
      '/learn/brassica-pests-and-diseases-in-santa-cruz-county': '/learn/brassica-pests-diseases-santa-cruz',
      '/learn/brassica-planting-calendar-for-santa-cruz-county': '/learn/brassica-planting-calendar-santa-cruz',
      '/learn/cool-season-cut-flowers-santa-cruz': '/learn/cool-season-cut-flowers-for-santa-cruz-county',
      '/learn/fertilizing-citrus-santa-cruz': '/learn/fertilizing-citrus-in-santa-cruz-county',
      '/learn/growing-a-cut-flower-garden-in-santa-cruz-county': '/learn/growing-cut-flower-garden-santa-cruz',
      '/learn/growing-avocados-in-containers-in-california': '/learn/growing-avocados-containers-california',
      '/learn/growing-broccoli-in-santa-cruz-county': '/learn/growing-broccoli-santa-cruz',
      '/learn/growing-brussels-sprouts-in-santa-cruz-county': '/learn/growing-brussels-sprouts-santa-cruz',
      '/learn/growing-cauliflower-in-santa-cruz-county': '/learn/growing-cauliflower-santa-cruz',
      '/learn/growing-cut-flowers-from-seed-santa-cruz': '/learn/growing-cut-flowers-from-seed-in-santa-cruz-county',
      '/learn/growing-dahlias-in-santa-cruz-county': '/learn/growing-dahlias-santa-cruz',
      '/learn/growing-meyer-lemons-santa-cruz': '/learn/growing-meyer-lemons-in-santa-cruz-county',
      '/learn/growing-snapdragons-in-santa-cruz-county': '/learn/growing-snapdragons-santa-cruz',
      '/learn/growing-sunflowers-in-santa-cruz-county': '/learn/growing-sunflowers-santa-cruz',
      '/learn/native-plants-for-pollinators-in-santa-cruz-county': '/learn/native-plants-for-pollinators',
      '/learn/saving-bean-pea-seeds': '/learn/saving-bean-and-pea-seeds',
      '/learn/native-garden-design-in-santa-cruz-county': '/learn/benefits-native-garden-design-santa-cruz',
      '/learn/cover-crops-for-santa-cruz-county-gardens-complete-guide': '/learn/cover-crops-santa-cruz-complete-guide',
      '/learn/growing-cosmos-santa-cruz': '/learn/growing-cosmos-flowers',
      '/learn/succession-planting-cut-flowers-santa-cruz': '/learn/succession-planting-cut-flowers-for-continuous-blooms',
      '/learn/drip-irrigation-setup': '/learn/drip-irrigation-raised-beds-setup'
    };
    [].slice.call(document.querySelectorAll('a[href*="/learn/"]')).forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var path = href.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '');
      if (LINK_REMAP[path]) {
        a.setAttribute('href', LINK_REMAP[path]);
      } else if (path.indexOf('/learn/tag/') === 0) {
        var span = document.createElement('span');
        span.textContent = a.textContent;
        span.className = 'ah-dead-tag';
        if (a.parentNode) a.parentNode.replaceChild(span, a);
      }
    });


    var css =
    '.blog-item-content{--ahg:#1A3B2A;--ahm:#E0A53F;--aht:#BD6438;--ahline:#dce0d2}' +
    '.blog-item-content h2:not(.ah-keep){font-family:"Palatino Linotype","Book Antiqua",Georgia,serif!important;padding-top:6px;margin-top:1.7em!important}' +
    '.blog-item-content h2:not(.ah-keep):before{content:"";display:block;width:46px;height:3px;background:var(--ahm);border-radius:2px;margin-bottom:13px}' +
    '.ah-toc{background:#fff;border:1px solid var(--ahline);border-left:4px solid var(--ahg);border-radius:0 10px 10px 0;padding:18px 22px;margin:26px 0 30px}' +
    '.ah-toc h6{font:700 11px/1 Montserrat,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#525a51;margin:0 0 12px}' +
    '.ah-toc ul{list-style:none!important;margin:0!important;padding:0!important;columns:2;column-gap:30px}' +
    '.ah-toc li{margin:0 0 8px!important;padding:0!important;break-inside:avoid}.ah-toc li:before{display:none!important}' +
    '.ah-toc a{font:14px/1.3 Montserrat,sans-serif;color:var(--ahg)!important;text-decoration:none!important;border-bottom:1px solid transparent}' +
    '.ah-toc a:hover{border-color:var(--ahm)}' +
    '.ah-prod{display:flex;gap:20px;align-items:center;background:#fff;border:1px solid var(--ahline);border-radius:12px;padding:20px;margin:34px 0;box-shadow:0 8px 30px rgba(28,33,29,.10)}' +
    '.ah-prod .cov{flex:0 0 124px;border-radius:6px;overflow:hidden;border:1px solid var(--ahline);box-shadow:0 4px 14px rgba(28,33,29,.12)}' +
    '.ah-prod .cov img{width:100%;display:block;aspect-ratio:7/9;object-fit:cover}' +
    '.ah-prod .eb{font:700 11px/1 Montserrat,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:var(--aht);margin-bottom:7px}' +
    '.ah-prod h4{font-family:"Palatino Linotype",Georgia,serif;font-size:21px;color:var(--ahg)!important;margin:0 0 6px}' +
    '.ah-prod p{font:14px/1.5 Montserrat,sans-serif;color:#525a51!important;margin:0 0 13px}' +
    '.ah-prod .price{font-family:"Palatino Linotype",Georgia,serif;font-size:20px;color:var(--ahg)!important;margin-right:14px;vertical-align:middle}' +
    '.ah-cta{display:inline-block;font:700 12px/1 Montserrat,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:13px 22px;border-radius:3px;background:var(--ahg);color:#F8F9F0!important;text-decoration:none!important}' +
    '.ah-lead{background:var(--ahg);border-radius:12px;padding:26px 28px;margin:34px 0;position:relative;overflow:hidden}' +
    '.ah-lead:after{content:"";position:absolute;right:-40px;bottom:-50px;width:180px;height:180px;border-radius:50%;background:rgba(224,165,63,.16)}' +
    '.ah-lead h3{font-family:"Palatino Linotype",Georgia,serif;color:#F8F9F0!important;font-size:22px;margin:0 0 4px}' +
    '.ah-lead .sub{color:#cdd6c8!important;font:14px/1.5 Montserrat,sans-serif;margin:0 0 16px}' +
    '.ah-lead ul{list-style:none!important;margin:0!important;padding:0!important;display:flex;flex-wrap:wrap;gap:10px;position:relative}' +
    '.ah-lead li{margin:0!important;padding:0!important}.ah-lead li:before{display:none!important}' +
    '.ah-lead li a{display:inline-block;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.28)!important;border-bottom:1px solid rgba(255,255,255,.28)!important;color:#fff!important;text-decoration:none!important;font:600 13px/1 Montserrat,sans-serif;padding:11px 16px;border-radius:30px}' +
    '.ah-lead li a:hover{background:var(--ahm);color:#2a2208!important;border-color:var(--ahm)}' +
    '.ah-bio{display:flex;gap:18px;align-items:center;background:#F1F2E6;border:1px solid var(--ahline);border-radius:12px;padding:20px 22px;margin:38px 0}' +
    '.ah-bio .av{flex:0 0 64px;height:64px;border-radius:50%;background:var(--ahg);color:#fff;display:flex;align-items:center;justify-content:center;font-family:"Palatino Linotype",Georgia,serif;font-size:24px}' +
    '.ah-bio h4{font-family:"Palatino Linotype",Georgia,serif;color:var(--ahg)!important;font-size:18px;margin:0 0 4px}' +
    '.ah-bio p{font:13.5px/1.5 Montserrat,sans-serif;color:#525a51!important;margin:0}' +
    '.ah-relwrap{margin:40px 0 0}' +
    '.ah-rel{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:14px}' +
    '.ah-rel a{background:#fff;border:1px solid var(--ahline);border-radius:10px;overflow:hidden;text-decoration:none!important;box-shadow:0 4px 14px rgba(28,33,29,.07);transition:.2s;display:block}' +
    // High-specificity overrides: the theme styles content links with border-bottom + underline at a specificity that beats a bare .class selector.
    '.blog-item-content .ah-rel a,.blog-item-content .ah-rel a:hover,.blog-item-content .ah-rel h5,.blog-item-content .ah-lead li a,.blog-item-content .ah-prod a.ah-cta,.blog-item-content .ah-prod a.ah-cta:hover{border-bottom:0!important;text-decoration:none!important;background-image:none!important}' +
    '.blog-item-content .ah-lead li a{border:1px solid rgba(255,255,255,.28)!important}' +
    '.blog-item-content .ah-lead li a:hover{border-color:var(--ahm)!important;background:var(--ahm)!important;color:#2a2208!important}' +
    '.ah-rel a:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(28,33,29,.13)}' +
    '.ah-rel .ph{aspect-ratio:16/10;background:linear-gradient(135deg,#E8EBE1,#dbe3d6);overflow:hidden;display:flex;align-items:center;justify-content:center}' +
    '.ah-rel .ph svg{width:40px;height:40px;opacity:.5}.ah-rel .ph img{width:100%;height:100%;object-fit:cover}' +
    '.ah-rel .b{padding:13px 15px 16px}' +
    '.ah-rel h5{font-family:"Palatino Linotype",Georgia,serif;font-weight:400;color:var(--ahg)!important;font-size:15.5px;line-height:1.25;margin:0}' +
    '@media(max-width:760px){.ah-rel{grid-template-columns:1fr}.ah-prod{flex-direction:column;text-align:center}.ah-prod .cov{flex:none;width:150px;margin:0 auto}.ah-toc ul{columns:1}}';
    var st = document.createElement('style'); st.id = 'ah-enh-style'; st.textContent = css;
    document.head.appendChild(st);

    var root = document.querySelector('.blog-item-content');
    var h2s = [].slice.call(root.querySelectorAll('h2'));
    var find = function (re) { for (var j = 0; j < h2s.length; j++) if (re.test(h2s[j].textContent)) return h2s[j]; return null; };
    var faq = find(/Frequently Asked/i), dl = find(/Free Downloadable Resources/i), rel = find(/Related Articles/i);
    var sections = h2s.filter(function (h) { return /^What /i.test(h.textContent); });

    // Normalize the repetitive "What Is .../What Should You Know About ..." scaffolding
    // into clean topic headers so the section list reads with variety, not repetition.
    // Original text is preserved on data-orig-heading (display-only change, reversible).
    function cleanHeading(s) {
      return s.replace(/^What (Is|Are|Should You Know About|Do You Need to Know About) /i, '')
              .replace(/\s*\?\s*$/, '').trim();
    }
    sections.forEach(function (h) {
      var orig = h.textContent.trim(), clean = cleanHeading(orig);
      if (clean && clean !== orig) {
        h.setAttribute('data-orig-heading', orig);
        h.textContent = clean.charAt(0).toUpperCase() + clean.slice(1);
      }
    });

    if (sections.length >= 3) {
      var box = document.createElement('div'); box.className = 'ah-toc';
      var items = sections.map(function (h, k) {
        h.id = h.id || 'ahs' + k;
        return '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>';
      }).join('');
      box.innerHTML = '<h6>In this guide</h6><ul>' + items + '</ul>';
      sections[0].parentElement.insertBefore(box, sections[0]);
    }

    if (dl) {
      var bio = document.createElement('div'); bio.className = 'ah-bio';
      bio.innerHTML = '<div class="av">A</div><div><h4>Adrienne Gaughan</h4>' +
        '<p>Gardenary-certified with 20+ years growing food in Santa Cruz. Ambitious Harvest turns hard-won local experience into guides built for California’s microclimates.</p></div>';
      dl.parentElement.insertBefore(bio, dl);
      var ul = dl.nextElementSibling;
      var lead = document.createElement('div'); lead.className = 'ah-lead';
      lead.innerHTML = '<h3>Free downloads to take with you</h3><p class="sub">Printable companions for this guide. No cost, no spam.</p>';
      dl.style.display = 'none';
      dl.parentElement.insertBefore(lead, dl);
      if (ul && ul.tagName === 'UL') lead.appendChild(ul);
    }

    if (rel) {
      var links = [], n = rel.nextElementSibling, g = 0;
      while (n && g < 8) {
        if (n.querySelectorAll) [].slice.call(n.querySelectorAll('a')).forEach(function (a) { links.push(a); });
        if (n.tagName === 'A') links.push(n);
        n = n.nextElementSibling; g++;
      }
      links = links.filter(function (a) { return /\/learn\//.test(a.getAttribute('href') || ''); }).slice(0, 3);
      if (links.length) {
        var wrap = document.createElement('div'); wrap.className = 'ah-relwrap';
        var grid = document.createElement('div'); grid.className = 'ah-rel';
        rel.classList.add('ah-keep');
        rel.parentElement.insertBefore(wrap, rel); wrap.appendChild(rel); wrap.appendChild(grid);
        var leaf = '<svg viewBox="0 0 24 24" fill="none" stroke="#1A3B2A" stroke-width="1.4"><path d="M12 2C7 5 4 9 4 14a8 8 0 0016 0c0-5-3-9-8-12z"/><path d="M12 5v13"/></svg>';
        var dropCard = function (c) { if (c.parentNode) c.parentNode.removeChild(c); if (!grid.children.length && wrap.parentNode) wrap.parentNode.removeChild(wrap); };
        links.forEach(function (a) {
          var href = a.getAttribute('href'), title = a.textContent.trim();
          var c = document.createElement('a'); c.href = href;
          c.innerHTML = '<div class="ph">' + leaf + '</div><div class="b"><h5>' + title + '</h5></div>';
          grid.appendChild(c); a.style.display = 'none';
          // Validate the link: a broken (404) related link is dropped so we never
          // render a dead card. Otherwise pull the article's og:image for the thumb.
          fetch(href).then(function (r) {
            if (!r.ok) { dropCard(c); return null; }
            return r.text();
          }).then(function (t) {
            if (!t) return;
            var m = t.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
            if (m && !/AHC|logo/i.test(m[1])) {
              c.querySelector('.ph').innerHTML = '<img src="' + m[1].replace(/^http:/, 'https:').split('?')[0] + '?format=600w" alt="">';
            }
          }).catch(function () { dropCard(c); });
        });
        var lc = links[0].closest('ul'); if (lc) lc.style.display = 'none';
      }
    }
  }
  function boot() {
    if (onArticle()) return init();
    var tries = 0, iv = setInterval(function () {
      if (onArticle()) { clearInterval(iv); init(); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === STORE MERCHANDISING (2026-06-16, session 41) ===
// Adds a value hero + trust bar, a featured MasterKit card, tinted cover panels
// + truthful badges on the product grid, and a why-buy strip to the /store page.
// Bundle banner intentionally omitted (no bundle product exists yet).
// NOTE: page <title> override here is interim; set the real SEO title in
// Squarespace (Pages > Store > SEO) for durable search/social. Fully reversible.
(function () {
  function onStore() {
    return location.pathname.replace(/\/$/, '') === '/store' && document.querySelector('.product-list');
  }
  function build() {
    if (document.getElementById('ah-store-style')) return;
    document.title = 'Shop Garden Guides & Kits | Ambitious Harvest';
    var CDN = 'https://images.squarespace-cdn.com/content/v1/6257536342b010638376c856/';
    var MK = '/store/p/04risdgzwd80jwjjzj7oxza4xw6ft6';
    var css =
    '.product-list-header{display:none!important}' +
    '.ah-shop-hero{background:linear-gradient(180deg,#1A3B2A,#163322);color:#F8F9F0;border-radius:14px;padding:42px 36px 40px;text-align:center;margin:0 0 28px;position:relative;overflow:hidden}' +
    '.ah-shop-hero .eb{font:700 12px/1 Montserrat,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#E0A53F!important;margin-bottom:12px}' +
    '.ah-shop-hero h1{font-family:"Palatino Linotype",Georgia,serif;font-weight:400;color:#F8F9F0!important;font-size:36px;margin:0 0 12px}' +
    '.ah-shop-hero p{color:#cdd6c8!important;max-width:56ch;margin:0 auto;font:16px/1.6 Montserrat,sans-serif}' +
    '.ah-trust{display:flex;justify-content:center;gap:30px;margin-top:22px;flex-wrap:wrap}' +
    '.ah-trust span{font:600 12.5px/1.2 Montserrat,sans-serif;color:#d7e0d2!important;display:flex;align-items:center;gap:8px}' +
    '.ah-trust svg{width:16px;height:16px;color:#E0A53F;flex:0 0 auto}' +
    '.ah-feat{display:grid;grid-template-columns:1fr 1.2fr;background:#fff;border:1px solid #dce0d2;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(28,33,29,.12);margin:0 0 36px}' +
    '.ah-feat .cov{background:radial-gradient(circle at 50% 35%,#fbf6e9,#eef0e2);display:flex;align-items:center;justify-content:center;padding:32px;position:relative}' +
    '.ah-feat .cov img{width:72%;border-radius:8px;box-shadow:0 16px 40px rgba(28,33,29,.22)}' +
    '.ah-feat .bod{padding:36px 40px;display:flex;flex-direction:column;justify-content:center}' +
    '.ah-feat .eb{font:700 12px/1 Montserrat,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#BD6438!important;margin-bottom:10px}' +
    '.ah-feat h2{font-family:"Palatino Linotype",Georgia,serif;font-weight:400;color:#1A3B2A!important;font-size:30px;margin:0 0 12px}' +
    '.ah-feat p{font:15px/1.6 Montserrat,sans-serif;color:#525a51!important;margin:0 0 16px}' +
    '.ah-feat ul{list-style:none!important;padding:0!important;margin:0 0 20px!important}' +
    '.ah-feat li{position:relative;padding-left:24px;margin:0 0 8px!important;font:14px/1.4 Montserrat,sans-serif;color:#2c3327!important}' +
    '.ah-feat li:before{content:"\\2713";position:absolute;left:0;color:#3a7256;font-weight:700}' +
    '.ah-feat .pr{display:flex;align-items:baseline;gap:12px;margin-bottom:18px}' +
    '.ah-feat .now{font-family:"Palatino Linotype",Georgia,serif;font-size:30px;color:#1A3B2A!important}' +
    '.ah-feat .was{font:16px Montserrat,sans-serif;color:#7c8378!important;text-decoration:line-through}' +
    '.ah-feat .save{font:700 11px/1 Montserrat,sans-serif;letter-spacing:.06em;text-transform:uppercase;border:1.5px solid #BD6438;color:#BD6438!important;padding:4px 9px;border-radius:3px}' +
    '.ah-cta2{display:inline-block;font:700 12px/1 Montserrat,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:14px 24px;border-radius:3px;background:#1A3B2A;color:#F8F9F0!important;text-decoration:none!important;border-bottom:0!important;width:fit-content}' +
    '.ah-badge{position:absolute;top:10px;left:10px;z-index:3;font:700 10.5px/1 Montserrat,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:5px 9px;border-radius:3px}' +
    '.ah-badge.pop{background:#E0A53F;color:#2a2208}' +
    '.ah-badge.start{background:#1A3B2A;color:#F8F9F0}' +
    // Framed cards: opaque covers don't show a tinted panel behind them, so we
    // frame each card instead (border + soft shadow + rounded cover) to stop the
    // light covers from blending into the page.
    '.product-list-item{position:relative;background:#fff!important;border:1px solid #e3e7da!important;border-radius:12px!important;padding:16px 16px 18px!important;box-shadow:0 1px 2px rgba(28,33,29,.05),0 6px 18px rgba(28,33,29,.06)!important;transition:.2s ease!important}' +
    '.product-list-item:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(28,33,29,.13)!important;border-color:#cfd6c4!important}' +
    '.product-list-item .product-list-image-wrapper{border-radius:8px!important;overflow:hidden!important;background:#fbfbf6!important;border:1px solid #eceee3!important}' +
    '.ah-why{background:#1A3B2A;color:#d7e0d2;border-radius:14px;padding:40px 36px;margin:44px 0 0;display:grid;grid-template-columns:repeat(3,1fr);gap:32px}' +
    '.ah-why h3{font-family:"Palatino Linotype",Georgia,serif;font-weight:400;color:#F8F9F0!important;font-size:19px;margin:10px 0 6px}' +
    '.ah-why p{font:14px/1.55 Montserrat,sans-serif;color:#cdd6c8!important;margin:0}' +
    '.ah-why .ic{width:40px;height:40px;border-radius:10px;background:rgba(224,165,63,.18);display:flex;align-items:center;justify-content:center;color:#E0A53F}' +
    '.ah-why .ic svg{width:21px;height:21px}' +
    '@media(max-width:880px){.ah-feat{grid-template-columns:1fr}.ah-why{grid-template-columns:1fr;gap:22px}.ah-shop-hero h1{font-size:28px}}';
    var st = document.createElement('style'); st.id = 'ah-store-style'; st.textContent = css;
    document.head.appendChild(st);

    var pl = document.querySelector('.product-list');
    var par = pl.parentNode;

    var hero = document.createElement('div'); hero.className = 'ah-shop-hero';
    hero.innerHTML = '<div class="eb">Instant digital downloads</div>' +
      '<h1>Garden Guides &amp; Kits, Built for California</h1>' +
      '<p>Every guide is written for our four local microclimates (coastal, inland valley, mountain, and desert) so the advice actually fits your yard.</p>' +
      '<div class="ah-trust">' +
      '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/></svg>30-day money-back guarantee</span>' +
      '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>Instant PDF, yours forever</span>' +
      '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>Santa Cruz &amp; Bay Area specific</span>' +
      '</div>';

    var feat = document.createElement('div'); feat.className = 'ah-feat';
    feat.innerHTML = '<div class="cov"><span class="ah-badge pop">★ Most Popular</span><img src="' + CDN + 'fba84310-2261-4060-b98f-2e6323c6fa4d/mk-gallery-1-cover.jpeg?format=600w" alt="Tomato Growing MasterKit"></div>' +
      '<div class="bod"><div class="eb">Start here · Bestseller</div><h2>The Tomato Growing MasterKit</h2>' +
      '<p>The complete, California-specific system for a tomato harvest that doesn’t quit, from variety selection to season-long care.</p>' +
      '<ul><li>12 sections + 2 bonuses (Zone Cards &amp; Season Journal)</li><li>Tailored to all four California growing zones</li><li>Printable, instant download, money-back guarantee</li></ul>' +
      '<div class="pr"><span class="now">$14.99</span><span class="was">$19.99</span><span class="save">Launch · Save 25%</span></div>' +
      '<a class="ah-cta2" href="' + MK + '">Get instant access</a></div>';

    par.insertBefore(hero, pl);
    par.insertBefore(feat, pl);

    var why = document.createElement('div'); why.className = 'ah-why';
    why.innerHTML =
      '<div><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></div><h3>Genuinely local</h3><p>Not generic advice. Every guide is written for our four California microclimates by someone who gardens here.</p></div>' +
      '<div><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v14H4z"/><path d="M8 9h8M8 13h5"/></svg></div><h3>Beautifully practical</h3><p>Printable PDFs with checklists, charts, and journal pages you’ll actually use in the garden.</p></div>' +
      '<div><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/></svg></div><h3>Risk-free</h3><p>30-day money-back guarantee. If a guide doesn’t help you grow, you don’t pay for it.</p></div>';
    par.insertBefore(why, pl.nextSibling);

    applyCards();
    setTimeout(applyCards, 1200);
  }
  function applyCards() {
    var items = [].slice.call(document.querySelectorAll('.product-list-item'));
    items.forEach(function (it, i) {
      if (it.querySelector('.ah-badge')) return;
      var link = it.querySelector('a[href*="/store/p/"]');
      var href = link ? link.getAttribute('href') : '';
      var img = it.querySelector('.product-list-image-wrapper, figure, .product-list-image-container') || it;
      if (href.indexOf('04risdgzwd80') > -1) { var b = document.createElement('span'); b.className = 'ah-badge pop'; b.textContent = '★ Most Popular'; img.appendChild(b); }
      else if (href.indexOf('first-harvest') > -1) { var b2 = document.createElement('span'); b2.className = 'ah-badge start'; b2.textContent = 'Start Here'; img.appendChild(b2); }
    });
  }
  function boot() {
    if (onStore()) return build();
    var tries = 0, iv = setInterval(function () {
      if (onStore()) { clearInterval(iv); build(); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === ARTICLE DISPLAY FIXES (2026-06-16, session 41) ===
// Two pre-existing content bugs, fixed at render time across ALL /learn/ articles:
//  1. Dark-background graphic boxes whose heading/paragraph text inherits the
//     theme's dark color (the box sets color:#f8f9f0 but not !important, so the
//     theme's h2/p rules win) -> unreadable dark-on-dark. We force light text.
//  2. Duplicate header image (a native image block + a body-inserted header of
//     the same file) -> we hide the second one.
// Fully reversible: remove this block.
(function () {
  if (location.pathname.indexOf('/learn/') !== 0 || location.pathname.indexOf('/learn/category/') === 0) return;

  function lum(rgb) {
    var m = (rgb || '').match(/\d+(\.\d+)?/g);
    if (!m || m.length < 3) return 1;
    return (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
  }
  function isTransparent(c) { return !c || c === 'rgba(0, 0, 0, 0)' || c === 'transparent'; }
  function isDarkBg(c) { return !isTransparent(c) && lum(c) < 0.45; }
  function isDarkText(c) { return lum(c) < 0.5; }

  function fixContrast(root) {
    [].slice.call(root.querySelectorAll('*')).forEach(function (box) {
      if (!isDarkBg(getComputedStyle(box).backgroundColor)) return;
      var els = [box].concat([].slice.call(box.querySelectorAll('*')));
      els.forEach(function (el) {
        if (el !== box) {
          var ownBg = getComputedStyle(el).backgroundColor;
          // Skip nested dark boxes (handled on their own pass) and light pills/badges
          if (isDarkBg(ownBg)) return;
          if (!isTransparent(ownBg) && lum(ownBg) >= 0.45) return;
        }
        if (isDarkText(getComputedStyle(el).color)) el.style.setProperty('color', '#F8F9F0', 'important');
        if (/^H[1-6]$/.test(el.tagName)) el.classList.add('ah-keep'); // drop our accent bar inside graphics
      });
    });
  }

  function dedupeHeader(root) {
    var imgs = [].slice.call(root.querySelectorAll('img')).filter(function (i) { return (i.currentSrc || i.src); });
    if (imgs.length < 2) return;
    var a = (imgs[0].currentSrc || imgs[0].src).split('?')[0];
    var b = (imgs[1].currentSrc || imgs[1].src).split('?')[0];
    if (!a || a !== b) return;
    // SAFETY: hide ONLY the duplicate <img> (and an immediate wrapper that holds
    // nothing but that image). NEVER hide an enclosing content block -- the header
    // image often shares the article's html block with the body text.
    var img = imgs[1];
    if (img.getAttribute('data-ah-dupe-hidden')) return;
    var target = img, wrap = img.parentElement;
    if (wrap && wrap !== root && /^(FIGURE|P|DIV|SPAN)$/.test(wrap.tagName) &&
        wrap.querySelectorAll('img').length === 1 && wrap.textContent.trim() === '') {
      target = wrap;
    }
    target.style.setProperty('display', 'none', 'important');
    img.setAttribute('data-ah-dupe-hidden', '1');
  }

  function run() {
    var root = document.querySelector('.blog-item-content');
    if (!root) return;
    fixContrast(root);
    dedupeHeader(root);
  }

  function boot() {
    run();
    setTimeout(run, 1200);
    setTimeout(run, 2800); // catch late-rendered graphics/images
    var root = document.querySelector('.blog-item-content');
    if (root && window.MutationObserver) {
      var t, mo = new MutationObserver(function () { clearTimeout(t); t = setTimeout(run, 300); });
      mo.observe(root, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 9000);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === HOMEPAGE POLISH (2026-06-16, session 41) ===
// Homepage only. Two wins:
//  1. Category gallery: overlay bold serif labels on the images (with a gradient
//     scrim + "Browse" prompt) instead of the tiny gray captions below them.
//  2. "Latest from the Garden": convert the sparse single-column summary list
//     into a tidy 4-column card grid (clears the block's absolute positioning).
// Fully reversible: remove this block.
(function () {
  function onHome() { return location.pathname.replace(/\/$/, '') === '' && document.querySelector('#sections'); }

  function build() {
    if (document.getElementById('ah-home-style')) return;
    var latest = null;
    [].slice.call(document.querySelectorAll('#sections > .page-section')).forEach(function (s) {
      if (s.querySelector('.summary-item-list')) latest = s;
    });
    if (latest) latest.classList.add('ah-latest-sec');

    var css =
    /* --- category gallery overlay --- */
    '.gallery-section .gallery-strips-item{position:relative;border-radius:10px;overflow:hidden;box-shadow:0 4px 16px rgba(28,33,29,.10)}' +
    '.gallery-section .gallery-strips-image-link{position:relative;display:block}' +
    '.gallery-section .gallery-strips-image-link::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(12,26,16,.82) 0%,rgba(12,26,16,.30) 42%,rgba(12,26,16,0) 68%);pointer-events:none;z-index:1}' +
    '.gallery-section .gallery-strips-item img{transition:transform .45s ease}' +
    '.gallery-section .gallery-strips-item:hover img{transform:scale(1.05)}' +
    '.gallery-section figcaption{position:absolute!important;left:0;right:0;bottom:0;z-index:2;padding:0 20px 18px!important;text-align:left!important;margin:0!important;background:none!important}' +
    '.gallery-section figcaption,.gallery-section figcaption *{color:#F8F9F0!important;font-family:"Palatino Linotype","Book Antiqua",Georgia,serif!important;font-size:21px!important;font-weight:400!important;line-height:1.18!important;letter-spacing:.01em!important}' +
    '.gallery-section figcaption::after{content:"Browse →";display:block;font-family:Montserrat,sans-serif!important;font-size:11px!important;font-weight:700!important;letter-spacing:.12em!important;text-transform:uppercase;color:#E0A53F!important;margin-top:6px}' +
    /* --- latest-from-the-garden card grid --- */
    '.ah-latest-sec .summary-item-list{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:24px!important;float:none!important;width:100%!important;position:static!important;height:auto!important}' +
    '.ah-latest-sec .summary-item{position:static!important;left:auto!important;top:auto!important;width:100%!important;margin:0!important;padding:0!important;float:none!important;background:#fff;border:1px solid #e3e7da;border-radius:10px;overflow:hidden;box-shadow:0 4px 14px rgba(28,33,29,.07);transition:.2s;display:flex!important;flex-direction:column!important}' +
    '.ah-latest-sec .summary-item:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(28,33,29,.13)}' +
    '.ah-latest-sec .summary-item > *{float:none!important;width:100%!important;margin:0!important}' +
    '.ah-latest-sec .summary-thumbnail-outer-container{width:100%!important;padding:0!important}' +
    '.ah-latest-sec .summary-thumbnail{padding-bottom:60%!important;width:100%!important;border-radius:0!important}' +
    '.ah-latest-sec .summary-content{padding:14px 16px 18px!important;text-align:left!important;display:block!important}' +
    '.ah-latest-sec .summary-title{font-family:"Palatino Linotype",Georgia,serif!important;font-size:16px!important;line-height:1.25!important;margin:0 0 5px!important;font-weight:400!important}' +
    '.ah-latest-sec .summary-title a{color:#1A3B2A!important;font-weight:400!important;border-bottom:0!important;text-decoration:none!important;background-image:none!important}' +
    '.ah-latest-sec .summary-metadata,.ah-latest-sec .summary-metadata a{font-size:11px!important;color:#7c8378!important;border-bottom:0!important}' +
    '.ah-latest-sec .summary-excerpt{display:none!important}' +
    '@media(max-width:900px){.ah-latest-sec .summary-item-list{grid-template-columns:repeat(2,1fr)!important}}' +
    '@media(max-width:560px){.ah-latest-sec .summary-item-list{grid-template-columns:1fr!important}}';

    var st = document.createElement('style'); st.id = 'ah-home-style'; st.textContent = css;
    document.head.appendChild(st);

    // The summary block positions items absolutely via inline styles; neutralize so
    // the CSS grid can lay them out. Re-run a few times in case the block re-flows.
    function relayout() {
      if (!latest) return;
      [].slice.call(latest.querySelectorAll('.summary-item')).forEach(function (it) {
        it.style.position = 'static'; it.style.left = ''; it.style.top = ''; it.style.width = '';
      });
      var l = latest.querySelector('.summary-item-list');
      if (l) { l.style.height = 'auto'; l.style.position = 'static'; }
    }
    relayout(); setTimeout(relayout, 800); setTimeout(relayout, 2000);
    if (latest && window.MutationObserver) {
      var t, mo = new MutationObserver(function () { clearTimeout(t); t = setTimeout(relayout, 200); });
      mo.observe(latest, { attributes: true, subtree: true, attributeFilter: ['style'] });
      setTimeout(function () { mo.disconnect(); }, 6000);
    }
  }

  function boot() {
    if (onHome()) return build();
    var tries = 0, iv = setInterval(function () {
      if (onHome()) { clearInterval(iv); build(); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === FOOTER ENRICHMENT (2026-06-16, session 41) ===
// Global. Prepends a brand + social + quick-links + newsletter-CTA band above the
// existing footer (which had nav links only -- no Shop link, no social, no
// newsletter). Links point to real destinations. Fully reversible.
(function () {
  function build() {
    var foot = document.querySelector('#footer-sections');
    if (!foot || document.getElementById('ah-foot-style') || foot.querySelector('.ah-foot-enhance')) return;

    var css =
    '.ah-foot-enhance{display:grid;grid-template-columns:1.5fr 1fr 1.3fr;gap:40px;max-width:1100px;margin:0 auto;padding:48px 28px 40px;border-bottom:1px solid rgba(255,255,255,.13)}' +
    '.ah-foot-enhance .ah-fe-logo{font-family:"Palatino Linotype",Georgia,serif;font-size:22px;color:#F8F9F0!important;margin-bottom:10px}' +
    '.ah-foot-enhance p{font:14px/1.55 Montserrat,sans-serif;color:#b9c7b6!important;margin:0 0 16px;max-width:32ch}' +
    '.ah-foot-enhance h4{font:700 11px/1 Montserrat,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#F8F9F0!important;margin:0 0 14px}' +
    '.ah-foot-enhance a{display:block;font:14px/1.4 Montserrat,sans-serif;color:#cdd6c8!important;text-decoration:none!important;border-bottom:0!important;padding:5px 0;background-image:none!important}' +
    '.ah-foot-enhance a:hover{color:#fff!important}' +
    '.ah-fe-social{display:flex;gap:10px;margin-top:4px}' +
    '.ah-fe-social a{width:36px;height:36px;border:1px solid rgba(255,255,255,.28);border-radius:50%;display:flex!important;align-items:center;justify-content:center;padding:0!important}' +
    '.ah-fe-social a:hover{background:rgba(255,255,255,.12)}' +
    '.ah-fe-social svg{width:16px;height:16px;color:#dfe6da}' +
    '.ah-fe-btn{display:inline-block!important;background:#E0A53F!important;color:#2a2208!important;font:700 12px/1 Montserrat,sans-serif!important;letter-spacing:.06em;text-transform:uppercase;padding:13px 20px!important;border-radius:3px;margin-top:4px}' +
    '.ah-fe-btn:hover{background:#d3982f!important;color:#2a2208!important}' +
    '@media(max-width:760px){.ah-foot-enhance{grid-template-columns:1fr;gap:28px}}';
    var st = document.createElement('style'); st.id = 'ah-foot-style'; st.textContent = css;
    document.head.appendChild(st);

    var ig = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>';
    var pin = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-3.6 19.3c-.1-.8-.2-2 .04-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.7 1.4 1.7 1.7 0 3-1.8 3-4.4 0-2.3-1.6-3.9-4-3.9-2.7 0-4.3 2-4.3 4.1 0 .8.3 1.7.7 2.2.1.1.1.2.1.3l-.3 1.2c0 .2-.2.2-.4.1-1.3-.6-2.1-2.5-2.1-4 0-3.2 2.3-6.2 6.8-6.2 3.6 0 6.3 2.5 6.3 5.9 0 3.5-2.2 6.4-5.3 6.4-1 0-2-.5-2.3-1.2l-.6 2.4c-.2.9-.8 2-1.2 2.6A10 10 0 1012 2z"/></svg>';
    var fb = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l.5-3H13V9c0-.9.3-1.5 1.6-1.5H17V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4V11H8v3h2.6v8H13z"/></svg>';
    var th = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 11.3c-.1 0-.2-.1-.3-.1-.2-3-1.8-4.7-4.5-4.7-1.6 0-3 .7-3.8 2l1.4 1c.6-.9 1.5-1.1 2.4-1.1 1.5 0 2.3.9 2.5 2.4-.6-.1-1.2-.2-1.9-.2-2.5 0-4.1 1.3-4 3.3 0 1.6 1.4 2.7 3.1 2.7 1.4 0 2.9-.8 3.4-2.7.3.6.6 1.4.6 2.4 0 1.9-1.6 3.9-4.9 3.9-3.6 0-5.2-2.4-5.2-6.1S6.9 6 10.5 6c2.3 0 3.9.9 4.9 2.3l1.5-1C15.6 5.4 13.4 4.3 10.5 4.3 5.7 4.3 3 7.3 3 12s2.7 7.7 7.5 7.7c4.3 0 6.7-2.7 6.7-5.6 0-1.5-.6-2.7-1.7-3.5z"/></svg>';

    var band = document.createElement('div'); band.className = 'ah-foot-enhance';
    band.innerHTML = '<div><div class="ah-fe-logo">Ambitious Harvest</div>' +
      '<p>Practical, locally grounded gardening for Santa Cruz County and the greater Bay Area.</p>' +
      '<div class="ah-fe-social">' +
      '<a href="https://www.instagram.com/ambitiousharvest" aria-label="Instagram">' + ig + '</a>' +
      '<a href="https://www.pinterest.com/AmbitiousHarvest" aria-label="Pinterest">' + pin + '</a>' +
      '<a href="https://www.facebook.com/AmbitiousHarvest/" aria-label="Facebook">' + fb + '</a>' +
      '<a href="https://www.threads.com/@ambitiousharvest" aria-label="Threads">' + th + '</a></div></div>' +
      '<div><h4>Explore</h4><a href="/start-here">Start Here</a><a href="/learn">The Garden Library</a><a href="/your-garden-toolkit">Garden Toolkit</a><a href="/store">Shop Guides &amp; Kits</a><a href="/disclosure">Disclosure</a></div>' +
      '<div><h4>Grow with the seasons</h4><p>Get the free Santa Cruz planting calendar, plus seasonal reminders and new guides.</p><a class="ah-fe-btn" href="/your-garden-toolkit">Get the free calendar →</a></div>';
    foot.insertBefore(band, foot.firstChild);
  }
  function boot() {
    if (document.querySelector('#footer-sections')) return build();
    var tries = 0, iv = setInterval(function () {
      if (document.querySelector('#footer-sections')) { clearInterval(iv); build(); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === START HERE POLISH (2026-06-16, session 41) ===
// /start-here only. Marigold heading accents + upgrade the muted sage CTAs to
// strong marigold buttons that pop on both the dark-green and cream bands.
// Reversible.
(function () {
  function onPage() { return location.pathname.replace(/\/$/, '') === '/start-here' && document.querySelector('#sections'); }
  function build() {
    if (document.getElementById('ah-sh-style')) return;
    var css =
    '#sections .page-section h2{position:relative}' +
    '#sections .page-section h2:not(.ah-keep)::after{content:"";display:block;width:48px;height:3px;background:#E0A53F;border-radius:2px;margin:16px auto 0}' +
    '#sections .sqs-block-button-element{background:#E0A53F!important;color:#2a2208!important;border:0!important;border-radius:3px!important;text-transform:uppercase!important;letter-spacing:.08em!important;font-weight:700!important;font-size:13px!important;padding:15px 30px!important;transition:.18s ease!important;box-shadow:0 4px 14px rgba(0,0,0,.18)!important}' +
    '#sections .sqs-block-button-element:hover{background:#d3982f!important;color:#2a2208!important;transform:translateY(-2px)!important}';
    var st = document.createElement('style'); st.id = 'ah-sh-style'; st.textContent = css;
    document.head.appendChild(st);
  }
  function boot() {
    if (onPage()) return build();
    var tries = 0, iv = setInterval(function () {
      if (onPage()) { clearInterval(iv); build(); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === LOCAL RESOURCES POLISH (2026-06-16, session 41) ===
// /local-resources only. Groups each resource entry (a bold-led name + its
// following description/location/website paragraphs) into a card, lays each
// category out in a uniform auto-fill grid, adds marigold heading accents, makes
// the hero title readable, and rebuilds the messy "On this page" jump-links into
// a clean chip bar. Robust to the page's inconsistent authoring. Reversible.
(function () {
  function onPage() { return location.pathname.replace(/\/$/, '') === '/local-resources' && document.querySelector('#sections'); }
  function isTitleP(el) { return el.tagName === 'P' && el.firstElementChild && el.firstElementChild.tagName === 'STRONG' && !el.classList.contains('sqsrte-large'); }

  function build() {
    if (document.getElementById('ah-lr-style')) { markup(); chips(); return; }
    var css =
    '#sections h2{position:relative}' +
    '#sections h2:not(.ah-keep)::after{content:"";display:block;width:46px;height:3px;background:#E0A53F;border-radius:2px;margin:14px 0 0}' +
    '.ah-res-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))!important;gap:18px!important;align-items:start!important;margin-top:8px!important}' +
    '.ah-res-card{background:#fff!important;border:1px solid #e3e7da!important;border-radius:10px!important;padding:18px 20px!important;box-shadow:0 2px 10px rgba(28,33,29,.05)!important}' +
    '.ah-res-card p{margin:0 0 6px!important;font-size:14px!important;line-height:1.55!important;color:#2c3327!important}' +
    '.ah-res-card p:last-child{margin-bottom:0!important}' +
    '.ah-res-card > p:first-child strong:first-child{font-family:"Palatino Linotype",Georgia,serif!important;font-weight:400!important;font-size:18px!important;color:#1A3B2A!important;display:block!important;margin-bottom:5px!important}' +
    '.ah-res-card a{color:#BD6438!important;text-decoration:none!important;border-bottom:1px solid rgba(189,100,56,.4)!important;background-image:none!important}' +
    /* clean category chip bar (replaces the split "On this page" links) */
    '.ah-lr-chips{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:900px;margin:6px auto 10px;padding:0 20px}' +
    '.ah-lr-chips a{display:inline-block;white-space:nowrap;font:600 13px Montserrat,sans-serif;color:#1A3B2A!important;background:#fff;border:1.5px solid #dce0d2!important;border-radius:30px;padding:8px 16px;text-decoration:none!important;background-image:none!important}' +
    '.ah-lr-chips a:hover{background:#1A3B2A;color:#F8F9F0!important;border-color:#1A3B2A!important}' +
    /* hero title readability over the photo */
    '#sections > .page-section:first-child .section-background::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,26,16,.18),rgba(12,26,16,.52));z-index:1}' +
    '#sections > .page-section:first-child h1{text-shadow:0 2px 18px rgba(0,0,0,.55),0 1px 3px rgba(0,0,0,.5)!important;position:relative;z-index:2}';
    var st = document.createElement('style'); st.id = 'ah-lr-style'; st.textContent = css;
    document.head.appendChild(st);
    markup(); chips();
  }

  // Group a bold-led name + its following (non-title) paragraphs into one card.
  function markup() {
    [].slice.call(document.querySelectorAll('#sections .sqs-html-content')).forEach(function (block) {
      if (block.querySelector('.ah-res-grid')) return;
      var children = [].slice.call(block.children);
      if (children.filter(isTitleP).length < 2) return; // not a real list
      var firstTitle = children.filter(isTitleP)[0];
      var grid = document.createElement('div'); grid.className = 'ah-res-grid';
      block.insertBefore(grid, firstTitle);
      var current = null;
      children.forEach(function (el) {
        if (el === grid) return;
        if (el.tagName === 'H2' || el.tagName === 'H3' || el.classList.contains('sqsrte-large')) { current = null; return; }
        if (isTitleP(el)) { current = document.createElement('div'); current.className = 'ah-res-card'; grid.appendChild(current); current.appendChild(el); }
        else if (current && el.tagName === 'P') { current.appendChild(el); }
      });
    });
  }

  // Replace the split "On this page" jump-links with clean chips from the H2s.
  function chips() {
    if (document.getElementById('ah-lr-chips')) return;
    var bm = [].slice.call(document.querySelectorAll('.sqs-html-content')).find(function (b) {
      return b.querySelectorAll('a[href*="#"]').length >= 5 && /On this page/i.test(b.textContent);
    });
    if (!bm) return;
    var h2s = [].slice.call(document.querySelectorAll('#sections h2')).filter(function (h) { return !h.closest('.ah-res-card'); });
    if (h2s.length < 3) return;
    var bar = document.createElement('div'); bar.id = 'ah-lr-chips'; bar.className = 'ah-lr-chips';
    h2s.forEach(function (h, i) { h.id = h.id || 'lrcat' + i; var a = document.createElement('a'); a.href = '#' + h.id; a.textContent = h.textContent.trim(); bar.appendChild(a); });
    bm.style.display = 'none';
    bm.parentNode.insertBefore(bar, bm);
  }

  function boot() {
    if (onPage()) { build(); setTimeout(function () { markup(); chips(); }, 1200); return; }
    var tries = 0, iv = setInterval(function () {
      if (onPage()) { clearInterval(iv); build(); setTimeout(function () { markup(); chips(); }, 1200); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === HOMEPAGE SHOP CALLOUT (2026-06-16, session 41) ===
// Homepage only. Inserts a "From the Garden Shop" featured-products band after
// the tools section (the homepage had no link to the store at all). Reversible.
(function () {
  function onHome() { return location.pathname.replace(/\/$/, '') === '' && document.querySelector('#sections'); }

  function build() {
    if (document.getElementById('ah-shopcallout') || document.getElementById('ah-shopcallout-sec')) return;
    var CDN = 'https://images.squarespace-cdn.com/content/v1/6257536342b010638376c856/';
    var prods = [
      { t: 'Tomato Growing MasterKit', c: 'fba84310-2261-4060-b98f-2e6323c6fa4d/mk-gallery-1-cover.jpeg', p: '$14.99', u: '/store/p/04risdgzwd80jwjjzj7oxza4xw6ft6', badge: 'Bestseller' },
      { t: 'First Harvest Kit', c: 'dd2f6938-54ca-4c68-9aa8-240e26854d4c/first-harvest-kit-1-cover.jpeg', p: '$14.99', u: '/store/p/first-harvest-kit-california-edition', badge: '' },
      { t: 'Water-Wise Garden Workbook', c: '3929876c-ddbc-48a5-ae55-ec2794fb4bf6/water-wise-garden-workbook-1-cover.jpeg', p: '$9.99', u: '/store/p/water-wise-garden-workbook-california-edition', badge: '' },
      { t: 'Seed Starting Success Kit', c: 'fbc91ab7-4aec-42af-8ef9-f77d7ae2d425/seed-starting-success-kit-1-cover.jpeg', p: '$9.99', u: '/store/p/seed-starting-success-kit-santa-cruz-county-edition', badge: '' }
    ];
    var css =
    '#ah-shopcallout-sec{background:#1A3B2A;padding:64px 28px 70px}' +
    '#ah-shopcallout{max-width:1140px;margin:0 auto;text-align:center}' +
    '#ah-shopcallout .eb{font:700 12px/1 Montserrat,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#E0A53F!important;margin-bottom:12px}' +
    '#ah-shopcallout h2{font-family:"Palatino Linotype",Georgia,serif;color:#F8F9F0!important;font-size:33px;margin:0 0 12px}' +
    '#ah-shopcallout .sub{font:16px/1.6 Montserrat,sans-serif;color:#cdd6c8!important;max-width:56ch;margin:0 auto 36px}' +
    '#ah-shopcallout .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-bottom:36px}' +
    '#ah-shopcallout .pc{background:#fff;border-radius:12px;overflow:hidden;text-decoration:none!important;box-shadow:0 8px 24px rgba(0,0,0,.18);transition:.2s;display:block;position:relative}' +
    '#ah-shopcallout .pc:hover{transform:translateY(-5px);box-shadow:0 14px 34px rgba(0,0,0,.26)}' +
    '#ah-shopcallout .pc .cov{background:linear-gradient(160deg,#f4f1e4,#e9ece0);padding:18px;display:flex;align-items:center;justify-content:center}' +
    '#ah-shopcallout .pc .cov img{width:78%;border-radius:5px;box-shadow:0 8px 20px rgba(28,33,29,.18)}' +
    '#ah-shopcallout .pc .b{padding:14px 16px 18px;text-align:left}' +
    '#ah-shopcallout .pc h3{font-family:"Palatino Linotype",Georgia,serif!important;color:#1A3B2A!important;font-size:16px!important;line-height:1.22;margin:0 0 6px;font-weight:400!important}' +
    '#ah-shopcallout .pc .price{font-family:"Palatino Linotype",Georgia,serif;color:#1A3B2A!important;font-size:17px}' +
    '#ah-shopcallout .badge{position:absolute;top:10px;left:10px;background:#E0A53F;color:#2a2208;font:700 10px/1 Montserrat,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:5px 9px;border-radius:3px;z-index:2}' +
    '#ah-shopcallout .shopall{display:inline-block;background:#E0A53F!important;color:#2a2208!important;font:700 13px/1 Montserrat,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:16px 32px;border-radius:3px;text-decoration:none!important;border-bottom:0!important}' +
    '#ah-shopcallout .shopall:hover{background:#d3982f!important}' +
    '@media(max-width:900px){#ah-shopcallout .grid{grid-template-columns:repeat(2,1fr)}}';
    var st = document.createElement('style'); st.id = 'ah-shopcallout'; st.textContent = css;
    document.head.appendChild(st);

    var cards = prods.map(function (p) {
      return '<a class="pc" href="' + p.u + '">' + (p.badge ? '<span class="badge">' + p.badge + '</span>' : '') +
        '<div class="cov"><img src="' + CDN + p.c + '?format=500w" alt="' + p.t + '"></div>' +
        '<div class="b"><h3>' + p.t + '</h3><span class="price">' + p.p + '</span></div></a>';
    }).join('');
    var sec = document.createElement('section'); sec.id = 'ah-shopcallout-sec';
    sec.innerHTML = '<div id="ah-shopcallout"><div class="eb">From the Garden Shop</div>' +
      '<h2>California-Specific Guides &amp; Kits</h2>' +
      '<p class="sub">Printable, microclimate-tuned guides to take the guesswork out of your garden. Instant download, 30-day money-back guarantee.</p>' +
      '<div class="grid">' + cards + '</div>' +
      '<a class="shopall" href="/store">Shop all 16 guides &amp; kits →</a></div>';

    // Insert after the tools section (heading "Plan your garden..."); fall back to
    // before the category gallery, else append to #sections.
    var secs = [].slice.call(document.querySelectorAll('#sections > .page-section'));
    var tools = secs.find(function (s) { var h = s.querySelector('h1,h2,h3'); return h && /plan your garden/i.test(h.textContent); });
    var gallery = document.querySelector('.gallery-section');
    if (tools && tools.parentNode) tools.parentNode.insertBefore(sec, tools.nextSibling);
    else if (gallery && gallery.parentNode) gallery.parentNode.insertBefore(sec, gallery);
    else document.querySelector('#sections').appendChild(sec);
  }

  function boot() {
    if (onHome()) return build();
    var tries = 0, iv = setInterval(function () {
      if (onHome()) { clearInterval(iv); build(); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === HOMEPAGE: WHY-SECTION REDESIGN + HERO POLISH (2026-06-16, session 41) ===
// Homepage only. (1) Replaces the "Why Local Gardening Knowledge Matters"
// paragraph with a centered 3-column value section. (2) Hero: makes the value
// line the headline (brand name becomes an eyebrow), trims the second paragraph,
// upgrades the CTA, and adds a second "Shop Guides" CTA. Reversible.
(function () {
  function onHome() { return location.pathname.replace(/\/$/, '') === '' && document.querySelector('#sections'); }

  function build() {
    if (document.getElementById('ah-why3-style')) return;
    var css =
    /* hero */
    '#sections > .page-section:first-child h1{font-size:15px!important;font-family:Montserrat,sans-serif!important;font-weight:700!important;letter-spacing:.22em!important;text-transform:uppercase!important;color:#E0A53F!important;margin:0 0 14px!important;line-height:1!important}' +
    '#sections > .page-section:first-child h4{font-family:"Palatino Linotype",Georgia,serif!important;font-size:50px!important;font-weight:400!important;color:#F8F9F0!important;line-height:1.08!important;margin:0 0 16px!important}' +
    '#sections > .page-section:first-child .sqs-block-button-element{background:#E0A53F!important;color:#2a2208!important;border:0!important;border-radius:3px!important;text-transform:uppercase!important;letter-spacing:.08em!important;font-weight:700!important;padding:15px 30px!important}' +
    '#ah-hero-cta2{display:inline-block;margin-left:12px;background:transparent;color:#F8F9F0!important;border:1.5px solid rgba(255,255,255,.7)!important;border-radius:3px;text-transform:uppercase;letter-spacing:.08em;font:700 13px/1 Montserrat,sans-serif;padding:14px 28px;text-decoration:none!important;vertical-align:middle}' +
    '#ah-hero-cta2:hover{background:rgba(255,255,255,.14)!important}' +
    /* why value grid */
    '#ah-why-wrap{max-width:1040px;margin:0 auto;text-align:center;padding:8px 28px}' +
    '#ah-why-wrap h2{font-family:"Palatino Linotype",Georgia,serif!important;color:#1A3B2A!important;font-size:32px!important;margin:0 0 10px!important;font-weight:400!important}' +
    '#ah-why-wrap .lead{font:16px/1.6 Montserrat,sans-serif;color:#525a51!important;max-width:60ch;margin:0 auto 38px}' +
    '#ah-why-wrap .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:34px}' +
    '#ah-why-wrap .col{text-align:center}' +
    '#ah-why-wrap .ic{width:54px;height:54px;border-radius:14px;background:#1A3B2A;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}' +
    '#ah-why-wrap .ic svg{width:26px;height:26px;color:#E0A53F}' +
    '#ah-why-wrap h3{font-family:"Palatino Linotype",Georgia,serif!important;color:#1A3B2A!important;font-size:20px!important;margin:0 0 8px!important;font-weight:400!important}' +
    '#ah-why-wrap .col p{font:14.5px/1.6 Montserrat,sans-serif!important;color:#525a51!important;margin:0!important}' +
    '@media(max-width:760px){#ah-why-wrap .grid{grid-template-columns:1fr;gap:26px}#sections > .page-section:first-child h4{font-size:34px!important}}';
    var st = document.createElement('style'); st.id = 'ah-why3-style'; st.textContent = css;
    document.head.appendChild(st);

    // ---- Hero ----
    var hero = document.querySelector('#sections > .page-section');
    if (hero) {
      var ps = [].slice.call(hero.querySelectorAll('p')).filter(function (p) { return p.textContent.trim().length > 20; });
      if (ps[1]) ps[1].style.display = 'none';
      var btn = hero.querySelector('.sqs-block-button-element');
      if (btn && !document.getElementById('ah-hero-cta2')) {
        var a = document.createElement('a'); a.id = 'ah-hero-cta2'; a.href = '/store'; a.textContent = 'Shop Guides';
        btn.parentNode.appendChild(a);
      }
    }

    // ---- Why section ----
    var secs = [].slice.call(document.querySelectorAll('#sections > .page-section'));
    var why = secs.find(function (s) { var h = s.querySelector('h1,h2,h3'); return h && /why local gardening/i.test(h.textContent); });
    if (why && !why.querySelector('#ah-why-wrap')) {
      var inner = why.querySelector('.content-wrapper') || why;
      [].slice.call(inner.children).forEach(function (c) { c.style.display = 'none'; });
      var w = document.createElement('div'); w.id = 'ah-why-wrap';
      w.innerHTML = '<h2>Why Local Gardening Knowledge Matters</h2>' +
        '<p class="lead">Generic advice was not written for our fog, dry summers, or mild winters. What works in the Midwest or Pacific Northwest often fails here.</p>' +
        '<div class="grid">' +
        '<div class="col"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></div><h3>Local, not generic</h3><p>Written for our coastal fog, dry summers, and mild winters, not the Midwest or Pacific Northwest.</p></div>' +
        '<div class="col"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h6M8 17h4"/></svg></div><h3>Tested, not theoretical</h3><p>The right varieties, timing, and water-wise techniques that actually produce here.</p></div>' +
        '<div class="col"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="4"/></svg></div><h3>Four California zones</h3><p>Guidance tuned to coastal, inland valley, mountain, and desert microclimates.</p></div>' +
        '</div>';
      inner.appendChild(w);
    }
  }

  function boot() {
    if (onHome()) return build();
    var tries = 0, iv = setInterval(function () {
      if (onHome()) { clearInterval(iv); build(); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === LEARN LIBRARY + CATEGORY GRID (2026-06-16, session 41) ===
// /learn index and /learn/category/* only (NOT individual articles). Converts
// the sparse single-column "side by side" blog list into a multi-column card
// grid, force-loads the lazy items (the list rendered blank-first), and paints
// each thumbnail as a background (the native <img> collapses in this layout).
// Reversible.
(function () {
  function onList() {
    var p = location.pathname.replace(/\/$/, '');
    return (p === '/learn' || p.indexOf('/learn/category/') === 0) && document.querySelector('.blog-side-by-side-wrapper');
  }

  function gridify() {
    [].slice.call(document.querySelectorAll('.blog-item')).forEach(function (it) {
      it.classList.add('is-loaded');
      if (it.getAttribute('data-ah-grid')) return;
      var img = it.querySelector('.blog-image-wrapper img');
      if (img) {
        var url = img.getAttribute('data-image') || img.getAttribute('data-src') || img.getAttribute('src');
        var a = img.closest('a.image-wrapper') || img.parentElement;
        if (a && url) {
          a.style.backgroundImage = 'url("' + url.split('?')[0] + '?format=750w")';
          a.classList.add('ah-bgimg');
        }
      }
      it.setAttribute('data-ah-grid', '1');
    });
  }

  function build() {
    if (document.getElementById('ah-learn-style')) { gridify(); return; }
    var css =
    '.blog-side-by-side-wrapper{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:26px!important;max-width:1180px;margin:0 auto}' +
    '.blog-item{display:flex!important;flex-direction:column!important;background:#fff!important;border:1px solid #e3e7da!important;border-radius:10px!important;overflow:hidden!important;box-shadow:0 4px 14px rgba(28,33,29,.07)!important;margin:0!important;padding:0!important;width:100%!important;opacity:1!important;transition:.2s}' +
    '.blog-item:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(28,33,29,.13)!important}' +
    '.blog-item .blog-image-wrapper{width:100%!important;margin:0!important;padding:0!important;flex:none!important}' +
    '.blog-item .ah-bgimg{display:block!important;width:100%!important;aspect-ratio:16/10!important;background-size:cover!important;background-position:center!important}' +
    '.blog-item .ah-bgimg img{display:none!important}' +
    '.blog-item .blog-item-summary{width:100%!important;padding:14px 16px 18px!important;margin:0!important;flex:none!important}' +
    '.blog-item .blog-title{font-family:"Palatino Linotype",Georgia,serif!important;font-size:17px!important;line-height:1.25!important;margin:0 0 6px!important}' +
    '.blog-item .blog-title a{color:#1A3B2A!important}' +
    '.blog-item .blog-excerpt,.blog-item .blog-excerpt p{font-size:13px!important;line-height:1.5!important;color:#525a51!important}' +
    '.blog-item .blog-excerpt{display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:0 0 6px!important}' +
    '.blog-item .blog-meta,.blog-item .blog-meta-item{font-size:11.5px!important;color:#7c8378!important}' +
    '@media(max-width:900px){.blog-side-by-side-wrapper{grid-template-columns:repeat(2,1fr)!important}}' +
    '@media(max-width:560px){.blog-side-by-side-wrapper{grid-template-columns:1fr!important}}';
    var st = document.createElement('style'); st.id = 'ah-learn-style'; st.textContent = css;
    document.head.appendChild(st);
    gridify();
    setTimeout(gridify, 800); setTimeout(gridify, 2000);
    var wrap = document.querySelector('.blog-side-by-side-wrapper');
    if (wrap && window.MutationObserver) {
      var t, mo = new MutationObserver(function () { clearTimeout(t); t = setTimeout(gridify, 200); });
      mo.observe(wrap, { childList: true, subtree: true });
    }
  }

  function boot() {
    if (onList()) return build();
    var tries = 0, iv = setInterval(function () {
      if (onList()) { clearInterval(iv); build(); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === CONTENT-PAGE POLISH (2026-06-16, session 41) ===
// /about + the tool pages. Adds alignment-aware marigold heading accents and the
// brand button style, but ONLY to real page-section headings -- never headings
// inside a tool/code block (the Garden Conditions dashboard and Planting Calendar
// are .sqs-block-code tools and are left completely untouched) and never the hero.
// Reversible.
(function () {
  var PATHS = ['/about', '/garden-events', '/garden-conditions', '/planting-calendar'];
  function onPage() {
    return PATHS.indexOf(location.pathname.replace(/\/$/, '')) >= 0 && document.querySelector('#sections');
  }

  function accentize() {
    var heroSec = document.querySelector('#sections > .page-section');
    [].slice.call(document.querySelectorAll('#sections h1, #sections h2, #sections h3')).forEach(function (h) {
      if (h.getAttribute('data-ah-acc')) return;
      if (h.closest('.sqs-block-code')) return;          // never touch tool internals
      if (h.closest('.page-section') === heroSec) return; // never the hero
      var ta = getComputedStyle(h).textAlign;
      h.classList.add((ta === 'center' || ta === 'middle') ? 'ah-hac-c' : 'ah-hac-l');
      h.setAttribute('data-ah-acc', '1');
    });
  }

  function build() {
    if (document.getElementById('ah-content-style')) { accentize(); return; }
    var css =
    '#sections h1.ah-hac-l::after,#sections h2.ah-hac-l::after,#sections h3.ah-hac-l::after{content:"";display:block;width:46px;height:3px;background:#E0A53F;border-radius:2px;margin:14px 0 0}' +
    '#sections h1.ah-hac-c::after,#sections h2.ah-hac-c::after,#sections h3.ah-hac-c::after{content:"";display:block;width:46px;height:3px;background:#E0A53F;border-radius:2px;margin:14px auto 0}' +
    '#sections .sqs-block-button-element{background:#1A3B2A!important;color:#F8F9F0!important;border:0!important;border-radius:3px!important;text-transform:uppercase!important;letter-spacing:.08em!important;font-weight:600!important;font-size:13px!important;padding:15px 30px!important;box-shadow:0 2px 10px rgba(28,33,29,.12)!important;transition:.18s}' +
    '#sections .sqs-block-button-element:hover{background:#2c5d42!important;transform:translateY(-2px)}';
    var st = document.createElement('style'); st.id = 'ah-content-style'; st.textContent = css;
    document.head.appendChild(st);
    accentize();
    setTimeout(accentize, 1000);
  }

  function boot() {
    if (onPage()) return build();
    var tries = 0, iv = setInterval(function () {
      if (onPage()) { clearInterval(iv); build(); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === LEGAL PAGE POLISH (2026-06-16, session 41) ===
// /terms-of-use + /privacy-policy. These are dark-green pages of uniform 14px
// paragraphs. Light touch: style the first line as a serif title with a marigold
// accent, the "Last updated" line as a muted subtitle, give the body a readable
// size/measure, and tint links marigold. Keeps the existing dark theme. Reversible.
(function () {
  var PATHS = ['/terms-of-use', '/privacy-policy', '/disclosure'];
  function onPage() {
    return PATHS.indexOf(location.pathname.replace(/\/$/, '')) >= 0 && document.querySelector('#sections .sqs-html-content');
  }

  function build() {
    if (document.getElementById('ah-legal-style')) { mark(); return; }
    var css =
    '#sections .sqs-html-content{max-width:760px;margin:0 auto}' +
    '#sections .sqs-html-content > p{font-size:15px!important;line-height:1.72!important}' +
    '#sections .sqs-html-content .sqsrte-text-color--lightAccent{color:#dfe6da!important}' +
    '#sections .sqs-html-content .ah-legal-title{margin-bottom:4px!important;font-family:"Palatino Linotype",Georgia,serif!important;font-size:42px!important;line-height:1.1!important;color:#F8F9F0!important;font-weight:400!important}' +
    '#sections .sqs-html-content .ah-legal-title .sqsrte-text-color--lightAccent{font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;font-weight:400!important;color:#F8F9F0!important}' +
    '#sections .sqs-html-content .ah-legal-title::after{content:"";display:block;width:54px;height:3px;background:#E0A53F;border-radius:2px;margin:18px 0 6px}' +
    '#sections .sqs-html-content .ah-legal-sub{margin-bottom:26px!important}' +
    '#sections .sqs-html-content .ah-legal-sub,#sections .sqs-html-content .ah-legal-sub .sqsrte-text-color--lightAccent{font-family:Montserrat,sans-serif!important;font-size:12px!important;letter-spacing:.1em!important;text-transform:uppercase!important;color:#9fb09a!important}' +
    '#sections .sqs-html-content a,#sections .sqs-html-content a .sqsrte-text-color--lightAccent{color:#E0A53F!important}';
    var st = document.createElement('style'); st.id = 'ah-legal-style'; st.textContent = css;
    document.head.appendChild(st);
    mark();
  }

  function mark() {
    var content = document.querySelector('#sections .sqs-html-content');
    if (!content) return;
    // The title is the first text element (a <p> on Terms/Privacy, an <h3> on
    // Disclosure). Only treat it as a title if it is SHORT, so a long body
    // paragraph can never be blown up to 42px.
    var els = [].slice.call(content.querySelectorAll(':scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4'))
      .filter(function (e) { return e.textContent.trim(); });
    var first = els[0];
    if (first && !first.classList.contains('ah-legal-title') && first.textContent.trim().length < 60) first.classList.add('ah-legal-title');
    var second = els[1];
    if (second && !second.classList.contains('ah-legal-sub') && /updated/i.test(second.textContent) && second.textContent.trim().length < 60) second.classList.add('ah-legal-sub');
  }

  function boot() {
    if (onPage()) { build(); setTimeout(mark, 1000); return; }
    var tries = 0, iv = setInterval(function () {
      if (onPage()) { clearInterval(iv); build(); setTimeout(mark, 1000); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === CONTACT PAGE POLISH (2026-06-16, session 41) ===
// /contact only. Marigold accent under "Get in Touch", brand styling on the
// form's Send button (was muted sage), and the social icons (which rendered as
// unreadable low-contrast green blocks) swapped for clean brand-circle glyphs.
// The form itself is untouched. Reversible.
(function () {
  function onPage() { return location.pathname.replace(/\/$/, '') === '/contact' && document.querySelector('#sections'); }
  var SOC = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    pinterest: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-3.6 19.3c-.1-.8-.2-2 .04-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.7 1.4 1.7 1.7 0 3-1.8 3-4.4 0-2.3-1.6-3.9-4-3.9-2.7 0-4.3 2-4.3 4.1 0 .8.3 1.7.7 2.2.1.1.1.2.1.3l-.3 1.2c0 .2-.2.2-.4.1-1.3-.6-2.1-2.5-2.1-4 0-3.2 2.3-6.2 6.8-6.2 3.6 0 6.3 2.5 6.3 5.9 0 3.5-2.2 6.4-5.3 6.4-1 0-2-.5-2.3-1.2l-.6 2.4c-.2.9-.8 2-1.2 2.6A10 10 0 1012 2z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l.5-3H13V9c0-.9.3-1.5 1.6-1.5H17V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4V11H8v3h2.6v8H13z"/></svg>',
    threads: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 11.3c-.1 0-.2-.1-.3-.1-.2-3-1.8-4.7-4.5-4.7-1.6 0-3 .7-3.8 2l1.4 1c.6-.9 1.5-1.1 2.4-1.1 1.5 0 2.3.9 2.5 2.4-.6-.1-1.2-.2-1.9-.2-2.5 0-4.1 1.3-4 3.3 0 1.6 1.4 2.7 3.1 2.7 1.4 0 2.9-.8 3.4-2.7.3.6.6 1.4.6 2.4 0 1.9-1.6 3.9-4.9 3.9-3.6 0-5.2-2.4-5.2-6.1S6.9 6 10.5 6c2.3 0 3.9.9 4.9 2.3l1.5-1C15.6 5.4 13.4 4.3 10.5 4.3 5.7 4.3 3 7.3 3 12s2.7 7.7 7.5 7.7c4.3 0 6.7-2.7 6.7-5.6 0-1.5-.6-2.7-1.7-3.5z"/></svg>'
  };
  function socials() {
    [].slice.call(document.querySelectorAll('#sections .sqs-svg-icon--wrapper')).forEach(function (a) {
      if (a.classList.contains('ah-soc')) return;
      var cls = a.className || '';
      var key = Object.keys(SOC).filter(function (k) { return cls.indexOf(k) >= 0; })[0];
      if (key) { a.innerHTML = SOC[key]; a.classList.add('ah-soc'); }
    });
  }
  function build() {
    if (document.getElementById('ah-contact-style')) { socials(); return; }
    var css =
    '#sections h1{position:relative}' +
    '#sections h1::after{content:"";display:block;width:48px;height:3px;background:#E0A53F;border-radius:2px;margin:16px auto 0}' +
    '#sections .sqs-block-form .form-submit-button button,#sections .sqs-block-form button.sqs-system-button,#sections form button.button{background:#1A3B2A!important;background-color:#1A3B2A!important;color:#F8F9F0!important;border:0!important;border-radius:3px!important;text-transform:uppercase!important;letter-spacing:.08em!important;font-weight:600!important;padding:15px 34px!important;box-shadow:0 2px 10px rgba(28,33,29,.12)!important;transition:.18s}' +
    '#sections .sqs-block-form button.sqs-system-button:hover,#sections form button.button:hover{background:#2c5d42!important;background-color:#2c5d42!important;transform:translateY(-2px)}' +
    '#sections .sqs-svg-icon--wrapper.ah-soc{width:42px!important;height:42px!important;border-radius:50%!important;background:#1A3B2A!important;display:inline-flex!important;align-items:center;justify-content:center;margin:0 6px!important;transition:.18s;vertical-align:middle}' +
    '#sections .sqs-svg-icon--wrapper.ah-soc svg{width:19px;height:19px;color:#F8F9F0}' +
    '#sections .sqs-svg-icon--wrapper.ah-soc:hover{background:#E0A53F!important}' +
    '#sections .sqs-svg-icon--wrapper.ah-soc:hover svg{color:#2a2208}';
    var st = document.createElement('style'); st.id = 'ah-contact-style'; st.textContent = css;
    document.head.appendChild(st);
    socials();
  }
  function boot() {
    if (onPage()) { build(); setTimeout(socials, 1000); return; }
    var tries = 0, iv = setInterval(function () {
      if (onPage()) { clearInterval(iv); build(); setTimeout(socials, 1000); }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === PLANT GUIDE HUB: photo cards (added 2026-06-17) ===
// Turns the text-link "Plant Guides by Microclimate" hub into a photo directory.
// For each crop <h2> followed by /learn/ guide links, inserts a clickable banner
// image (that crop's featured photo) linking to the first guide. Image map is baked
// from each crop's current featured image; if a crop's featured image is swapped,
// refresh its URL here (regenerate via the crop->og:image sweep).
(function () {
  function onHub() { return /\/learn\/plant-guides-by-microclimate\/?$/.test(location.pathname); }
  var CROP_IMG = {
      "artichoke": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef7e92731e4dc6e0efbb/1781735816256/artichoke-plants-with-silvery-foliage-in-coastal-clay.jpg?format=750w",
      "avocado": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef80b9ff76225b5e868e/1781735818264/Avocado+Tree.png?format=750w",
      "beefsteak-tomato": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef8179f2903073306f81/1781735820390/Tomato.png?format=750w",
      "bell-pepper": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef827c0e4f0def71ddc4/1781735822433/Peppers+%2814%29.JPG?format=750w",
      "blueberry-southern-highbush": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31c9a4c9ca437e0da09132/1781659207140/blueberry-southern-highbush-coastal-fog-belt-santa-cruz.jpg?format=750w",
      "broccoli": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef8407cf281b59e90dbb/1781735824404/growing-broccoli-santa-cruz.jpg?format=750w",
      "brussels-sprouts": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef85e65b3d6f374d6739/1781735826451/growing-brussels-sprouts-santa-cruz.jpg?format=750w",
      "bush-bean": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31d627951aff6cb79caf3f/1781735828541/best-bean-varieties-santa-cruz.jpg?format=750w",
      "eureka-lemon": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef873a1b0f25d1c4b33a/1781735830571/growing-meyer-lemons-santa-cruz.jpg?format=750w",
      "everbearing-strawberry": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31d62887944957a2321a84/1781735832720/Strawberry.jpg?format=750w",
      "feijoa-pineapple-guava": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef88d0305a47cc348e3a/1781736534078/pg-feijoa-pineapple-guava.jpg?format=750w",
      "grapes": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef8ad0305a47cc348e66/1781736528584/pg-grapes.jpg?format=750w",
      "heritage-apple": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef8ba6b79330e05bb0bf/1781735834806/best-apple-varieties-santa-cruz.jpg?format=750w",
      "jalapeno": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31c9a10d96d8090a99473e/1781729029055/24-companion-plants-peppers.jpg?format=750w",
      "low-chill-peach": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef8d64969441a99f9486/1781735836849/growing-stone-fruit-santa-cruz.jpg?format=750w",
      "meyer-lemon": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31c9a55092893df6a8b996/1781661469336/meyer-lemon-banana-belt-santa-cruz.jpg?format=750w",
      "persimmon": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef8e47c094685082093c/1781736530647/pg-persimmon.jpg?format=750w",
      "potato": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef900188286be06bd3e5/1781736526792/pg-potato.jpg?format=750w",
      "ranunculus": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef918e3f597e42106fae/1781735839493/growing-ranunculus-santa-cruz.jpg?format=750w",
      "roma-tomato": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31c9a73ab4dd5fd33a5abb/1781661389669/roma-tomato-banana-belt-santa-cruz.jpg?format=750w",
      "romaine-lettuce": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31d62a9edb270341c26a52/1781735841729/Felton+garden+shaded+by+redwoods+with+winter+greens.jpg?format=750w",
      "satsuma-mandarin": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31ef9307cf281b59e91425/1781735843998/growing-mandarins-satsumas.jpg?format=750w",
      "sugar-snap-pea": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31c9a35092893df6a8b96f/1781735850055/growing-sugar-snap-peas.jpg?format=750w",
      "sungold-cherry-tomato": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31d62b7c0e4f0def695825/1781735845919/Tomato.png?format=750w",
      "zucchini": "https://static1.squarespace.com/static/6257536342b010638376c856/6266f6ac7683d664da300493/6a31d62d47c0946850788fd2/1781735848070/best-zucchini-varieties-santa-cruz.jpg?format=750w"
  };
  function build() {
    var scope = document.querySelector('.blog-item-content, .entry-content, [data-content-field="main-content"]') || document.querySelector('article') || document.body;
    var hs = scope.querySelectorAll('h2');
    Array.prototype.forEach.call(hs, function (h) {
      var prev = h.previousElementSibling;
      if (prev && prev.className && String(prev.className).indexOf('ah-pg-card') !== -1) return;
      var link = null, n = h.nextElementSibling;
      while (n && n.tagName !== 'H2') {
        var a = (n.matches && n.matches('a[href*="/learn/"]')) ? n : (n.querySelector ? n.querySelector('a[href*="/learn/"]') : null);
        if (a) { link = a; break; }
        n = n.nextElementSibling;
      }
      if (!link) return;
      var m = (link.getAttribute('href') || '').match(/\/learn\/(.+?)-(banana-belt|coastal-fog-belt|san-lorenzo-valley|pajaro-valley)-santa-cruz/);
      if (!m) return;
      var img = CROP_IMG[m[1]];
      if (!img) return;
      var card = document.createElement('a');
      card.href = link.getAttribute('href');
      card.className = 'ah-pg-card';
      card.setAttribute('aria-label', (h.textContent || '').trim());
      card.style.cssText = 'display:block;margin:22px 0 4px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(26,59,42,.14);line-height:0;';
      var im = document.createElement('img');
      im.src = img; im.alt = (h.textContent || '').trim(); im.loading = 'lazy';
      im.style.cssText = 'width:100%;height:210px;object-fit:cover;display:block;';
      card.appendChild(im);
      h.parentNode.insertBefore(card, h);
    });
  }
  function boot() {
    if (!onHub()) return;
    var t = 0, iv = setInterval(function () {
      build(); // idempotent (skips already-carded headings); re-run to catch late-rendered sections
      if (++t > 40) clearInterval(iv);
    }, 300);
    window.addEventListener('load', build);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// === BARE TABLE BEAUTIFIER (2026-06-18) ===
// Some older articles carry de-styled inline tables (their CSS was stripped by the
// Squarespace editor) that render jumbled. Style them with the brand palette at render
// time. Non-destructive: the stored table data is untouched; this only restyles in the
// browser. Skips tables that already have inline styling (cluster graphics, already-
// styled tables) so it never double-styles or overrides intentional designs.
(function () {
  var FOREST = '#1a3b2a', CREAM = '#f8f9f0', SAGE_LIGHT = '#dde2d8', INK = '#1c3c2c';
  function isBare(t) {
    if (t.getAttribute('data-ah-tablestyled')) return false;
    if (t.closest('[data-graphic]')) return false;            // inside a cluster graphic (already styled)
    if (/background/i.test(t.getAttribute('style') || '')) return false;
    var cell = t.querySelector('td,th');
    if (cell && /background/i.test(cell.getAttribute('style') || '')) return false;
    return true;
  }
  function style(t) {
    t.setAttribute('data-ah-tablestyled', '1');
    t.style.width = '100%'; t.style.borderCollapse = 'collapse';
    t.style.fontFamily = "'Montserrat', system-ui, sans-serif"; t.style.fontSize = '0.9rem';
    var rows = t.querySelectorAll('tr'), first = true, ri = 0;
    rows.forEach(function (r) {
      var headerRow = (r.parentNode && r.parentNode.tagName === 'THEAD') || (first && r.querySelector('th')) || first;
      var cells = r.children;
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i];
        c.style.padding = '10px 12px'; c.style.textAlign = 'left'; c.style.verticalAlign = 'top';
        if (c.tagName === 'TH' || headerRow) {
          c.style.setProperty('background-color', FOREST, 'important');
          c.style.setProperty('color', CREAM, 'important');
          c.style.fontWeight = '700'; c.style.fontSize = '0.82rem';
        } else {
          c.style.borderBottom = '1px solid ' + SAGE_LIGHT;
          c.style.setProperty('color', INK, 'important');
          if (i === 0) { c.style.fontWeight = '700'; c.style.setProperty('color', FOREST, 'important'); }
          c.style.setProperty('background-color', (ri % 2 ? CREAM : '#ffffff'), 'important');
        }
      }
      if (!headerRow) ri++;
      first = false;
    });
    // wrap for horizontal scroll on narrow screens
    if (t.parentNode && (!t.parentNode.getAttribute || t.parentNode.getAttribute('data-ah-tablewrap') !== '1')) {
      var w = document.createElement('div');
      w.setAttribute('data-ah-tablewrap', '1');
      w.style.overflowX = 'auto'; w.style.margin = '24px 0';
      t.parentNode.insertBefore(w, t); w.appendChild(t); t.style.margin = '0';
    }
  }
  function run() {
    var root = document.querySelector('.blog-item-content, [data-content-field="main-content"], article, main') || document;
    var tables = root.querySelectorAll('table');
    for (var i = 0; i < tables.length; i++) { if (isBare(tables[i])) style(tables[i]); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 400); });
  else setTimeout(run, 400);
})();
