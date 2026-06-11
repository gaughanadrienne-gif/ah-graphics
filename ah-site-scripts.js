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
    "microgreens-nutrition-benefits": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-microgreens.html",
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
    "grow-herbs-santa-cruz": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-listicles.html",
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
    "growing-sweet-peas-in-santa-cruz-county-fragrant-favorites-for-cool-season-bouquets": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-beanspeas.html",
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

  // Two triggers for loading:
  // 1. Article has placeholder divs (already migrated)
  // 2. Article slug is in the lookup table (proactive, for future migration)
  var placeholders = document.querySelectorAll('.ah-graphic[data-graphic]');
  var hasPlaceholders = placeholders.length > 0;

  // If no placeholders and no cluster mapping, nothing to do
  if (!hasPlaceholders && !clusterPage) return;

  // If there are placeholders but no cluster mapping, still try to render
  // from any previously loaded graphics (for cross-cluster placeholder testing)
  if (hasPlaceholders && !clusterPage) {
    renderPlaceholders();
    return;
  }

  // If cluster is already cached, render immediately
  if (window._ahClusterCache[clusterPage]) {
    renderPlaceholders();
    return;
  }

  // Fetch the cluster page and extract the graphics script
  loadCluster(clusterPage, function() {
    renderPlaceholders();
  });

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

// === CONTEXTUAL PRODUCT CALLOUTS (2026-06-11) ===
// Routes each article to its most relevant Garden Shop product.
// Tomato articles are excluded (the quiz callout already carries the MasterKit CTA).
(function() {
  if (location.pathname.indexOf('/learn/') !== 0) return;
  setTimeout(function() {
    var slug = location.pathname.replace('/learn/', '').replace(/\/$/, '');
    if (slug.indexOf('tomato') !== -1) return;
    if (document.querySelector('.ah-product-callout')) return;

    var P = {
      kids:      { url: '/store/p/kids-garden-activity-pack-santa-cruz-county-edition', title: 'Kids Garden Activity Pack', line: 'Hands-on garden activities, trackers, and badges for curious kids.', price: '$7.99' },
      dahlia:    { url: '/store/p/california-dahlia-growing-guide', title: 'California Dahlia Growing Guide', line: 'Zone-by-zone tuber timing and an overwintering flowchart for California.', price: '$9.99' },
      herb:      { url: '/store/p/herb-growing-kitchen-garden-guide-california-edition', title: 'Herb Growing Kitchen Garden Guide', line: 'Every herb from seed to cutting board, tuned to our Mediterranean climate.', price: '$9.99' },
      firewise:  { url: '/store/p/firewise-food-garden-kit-california-edition', title: 'Firewise Food Garden Kit', line: 'Make your food garden part of your defensible space plan.', price: '$14.99' },
      water:     { url: '/store/p/water-wise-garden-workbook-california-edition', title: 'Water-Wise Garden Workbook', line: 'Audit your water use and redesign your garden with real numbers.', price: '$9.99' },
      pest:      { url: '/store/p/gopher-pest-defense-kit-santa-cruz-county-edition', title: 'Gopher & Pest Defense Kit', line: 'The integrated five-step defense system for gophers and garden pests.', price: '$12.99' },
      compost:   { url: '/store/p/composting-soil-building-guide', title: 'Composting & Soil Building Guide', line: 'Composting methods built for real California clay and sand soils.', price: '$9.99' },
      container: { url: '/store/p/container-small-space-garden-guide', title: 'Container & Small Space Garden Guide', line: 'Real harvests from balconies, patios, and doorsteps.', price: '$9.99' },
      preserve:  { url: '/store/p/preserving-the-harvest-guide-california-edition', title: 'Preserving the Harvest Guide', line: 'Tested canning, freezing, drying, and fermenting methods. Safety first.', price: '$9.99' },
      seed:      { url: '/store/p/seed-starting-success-kit-santa-cruz-county-edition', title: 'Seed Starting Success Kit', line: 'Sowing dates and transplant timing built for our five microclimates.', price: '$9.99' },
      companion: { url: '/store/p/companion-planting-master-chart-guide', title: 'Companion Planting Master Chart & Guide', line: 'Pairings backed by mechanisms, not folklore, mapped to our seasons.', price: '$9.99' },
      micro:     { url: '/store/p/microclimate-mastery-guide-santa-cruz-county-edition', title: 'Microclimate Mastery Guide', line: 'The five real growing zones of Santa Cruz County, decoded.', price: '$12.99' },
      seasonal:  { url: '/store/p/seasonal-planting-master-guide-santa-cruz-county-edition', title: 'Seasonal Planting Master Guide', line: 'Twelve months of planting mapped to your microclimate.', price: '$12.99' },
      first:     { url: '/store/p/first-harvest-kit-california-edition', title: 'First Harvest Kit', line: 'From bare ground to your first harvest, every decision in order.', price: '$14.99' },
      planner:   { url: '/store/p/garden-planner-journal-santa-cruz-county-edition', title: 'Garden Planner & Journal', line: 'Twelve monthly spreads designed to print, with local planting windows.', price: '$7.99' }
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
      [/microclimate|frost-dates|fog-belt|june-gloom/, 'micro'],
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

    var box = document.createElement('div');
    box.className = 'ah-product-callout';
    box.innerHTML = '' +
      '<div style="font-family:Montserrat,Arial,sans-serif;background-color:#f8f9f0;border:1px solid #dde2d8;border-left:4px solid #c9a84c;border-radius:8px;padding:1.5rem 1.75rem;margin:2.5rem 0;">' +
        '<p style="font-size:0.65rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#b8694a !important;margin:0 0 0.4rem 0;">From the Garden Shop</p>' +
        '<p style="font-family:Georgia,serif;font-size:1.25rem;color:#1a3b2a !important;margin:0 0 0.4rem 0;">' + prod.title + '</p>' +
        '<p style="font-size:0.9rem;color:#5a6c5a !important;margin:0 0 1rem 0;line-height:1.55;">' + prod.line + '</p>' +
        '<a href="' + prod.url + '" style="display:inline-block;background-color:#1a3b2a;color:#f8f9f0 !important;text-decoration:none;padding:0.65rem 1.5rem;border-radius:6px;font-size:0.85rem;font-weight:700;">View the Guide <span style="color:#c9a84c !important;">' + prod.price + '</span></a>' +
      '</div>';

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

// === GARDEN SHOP POLISH v2 (2026-06-11) ===
// Styles the /store product-list-section (dark theme): bigger art, stacked
// title/price, gold pricing, hover lift, tagline band.
(function() {
  if (location.pathname.indexOf('/store') !== 0) return;
  var css = '' +
    '.product-list-item { background: #16291f !important; border: 1px solid rgba(201,168,76,.18); border-radius: 14px; padding: 22px !important; transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }' +
    '.product-list-item:hover { transform: translateY(-4px); box-shadow: 0 16px 38px rgba(0,0,0,.35); border-color: rgba(201,168,76,.5); }' +
    '.product-list-image-wrapper, .product-list-item-image { width: 230px !important; max-width: 35vw; }' +
    '.product-list-item img { border-radius: 10px; }' +
    '.product-list-title-price { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }' +
    '.product-list-item-title { font-family: Montserrat, sans-serif !important; font-weight: 600 !important; font-size: 1.15rem !important; line-height: 1.35 !important; color: #f8f9f0 !important; letter-spacing: .01em; }' +
    '.product-list-item-price, .product-list-list-layout-price-meta { font-family: Montserrat, sans-serif !important; font-weight: 700 !important; font-size: 1rem !important; }' +
    '.product-list-item-price .sale-price, .product-list-item-price { color: #c9a84c !important; }' +
    '.product-list-item-price .original-price { color: #8c9c8c !important; font-weight: 500 !important; }' +
    '.product-list-description, .product-list-description-rich-text, .product-list-description p { color: #c9d4c4 !important; font-size: .92rem !important; line-height: 1.6 !important; }' +
    '.grid-meta-status, .product-list-item-status { background: #c9a84c !important; color: #14241b !important; font-weight: 700 !important; border-radius: 4px; }' +
    '.ah-shop-intro { font-family: Montserrat, sans-serif; text-align: center; padding: 0 1rem 2rem; }' +
    '.ah-shop-intro .ah-rule { width: 70px; height: 3px; background: #c9a84c; margin: 0 auto 1rem; }' +
    '.ah-shop-intro p { color: #c9d4c4; font-size: .95rem; max-width: 600px; margin: 0 auto; line-height: 1.7; }';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function addIntro() {
    if (document.querySelector('.ah-shop-intro')) return;
    var list = document.querySelector('.product-list-container') ||
               document.querySelector('.product-list');
    if (!list) return;
    var intro = document.createElement('div');
    intro.className = 'ah-shop-intro';
    intro.innerHTML = '<div class="ah-rule"></div>' +
      '<p>California-specific growing guides written from twenty years of Santa Cruz County gardens. Instant PDF downloads, printable worksheets, and a 30-day money-back guarantee on everything.</p>';
    list.parentNode.insertBefore(intro, list);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(addIntro, 800); });
  } else {
    setTimeout(addIntro, 800);
  }
})();
