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
    "keeping-your-flock-cool-in-santa-cruz-summer-heat": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "growing-flock-treats-best-garden-crops-for-chickens-ducks-geese": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "backyard-flock-first-aid-kit-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "chickens-or-ducks-for-a-santa-cruz-backyard": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "hatchery-chicks-or-rescue-hens": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "deep-litter-or-sand-coop-bedding-coastal-california": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
    "standard-or-bantam-chicken-breeds-small-backyard": "https://gaughanadrienne-gif.github.io/ah-graphics/ah-gfx-gardenflock.html",
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

// === GARDEN COOP -> BUILD YOUR FLOCK CROSS-LINK (2026-06-16) ===
// Flock/coop articles get a callout to the Build Your Flock local availability tool.
// Shared so the product callout below can step aside on these articles.
function ahIsFlockArticle(slug) {
  var FLOCK = {
    'starting-a-backyard-flock-in-santa-cruz-county': 1,
    'choosing-the-right-breeds-for-coastal-california-gardens': 1,
    'designing-a-predator-proof-run-for-your-garden-flock': 1,
    'raising-chicks-and-ducklings-in-santa-cruz': 1,
    'what-to-feed-your-backyard-flock-year-round-in-california': 1,
    'common-health-issues-backyard-chickens-ducks-geese': 1,
    'adopting-rescue-birds-quarantine-deworming-flock-introduction': 1,
    'keeping-a-mixed-flock-chickens-ducks-geese-together': 1,
    'how-your-flock-can-work-your-garden': 1,
    'composting-with-chicken-and-duck-waste': 1,
    'managing-free-range-time-protecting-plants': 1,
    'best-and-worst-garden-plants-for-free-range-flock': 1,
    'keeping-ducks-in-your-california-garden': 1,
    'keeping-a-goose-single-goose-flocks': 1,
    'heritage-and-rescue-chicken-breeds-santa-cruz': 1,
    'predator-proofing-your-flock-santa-cruz-county': 1,
    'hardware-cloth-coop-locks-night-safety': 1,
    'what-to-do-when-a-predator-gets-in': 1,
    'seasonal-flock-care-spring-summer-coastal-california': 1,
    'seasonal-flock-care-fall-winter-coastal-california': 1
  };
  if (FLOCK[slug]) return true;
  return /flock|coop|chicken|duckling|ducks|goose|geese|poultry|pullet|backyard-bird|hatchling/.test(slug);
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
    box.className = 'ah-flock-callout';
    box.innerHTML = '' +
      '<div style="font-family:Montserrat,Arial,sans-serif;background-color:#f8f9f0;border:1px solid #dde2d8;border-left:4px solid #4A7A5B;border-radius:8px;padding:1.5rem 1.75rem;margin:2.5rem 0;">' +
        '<p style="font-size:0.65rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#4A7A5B !important;margin:0 0 0.4rem 0;">Local Resource</p>' +
        '<p style="font-family:Georgia,serif;font-size:1.25rem;color:#1a3b2a !important;margin:0 0 0.4rem 0;">Build Your Flock</p>' +
        '<p style="font-size:0.9rem;color:#5a6c5a !important;margin:0 0 1rem 0;line-height:1.55;">See which chickens, ducks, and geese are available right now from Santa Cruz County shelters, feed stores, and breeders.</p>' +
        '<a href="/build-your-flock" style="display:inline-block;background-color:#1a3b2a;color:#f8f9f0 !important;text-decoration:none;padding:0.65rem 1.5rem;border-radius:6px;font-size:0.85rem;font-weight:700;">Browse local availability &rarr;</a>' +
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
      '<div><h4>Explore</h4><a href="/start-here">Start Here</a><a href="/learn">The Garden Library</a><a href="/your-garden-toolkit">Garden Toolkit</a><a href="/store">Shop Guides &amp; Kits</a></div>' +
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
