# Public deployment repository

This repository backs live Ambitious Harvest web assets. Anything committed
here, including deleted files in Git history, must be treated as public and
downloadable.

## Allowed

- Generated HTML, JavaScript, JSON, images, and video intentionally served on
  the public website
- Public tools and public editorial graphics
- Automation needed to refresh public data

## Keep elsewhere

- Customer-only, purchase-bonus, or email-gated downloads
- Family or household tools and data
- Credentials, API keys, private feed URLs, and local configuration
- Research, drafts, operational notes, and source files that are not themselves
  public deliverables

The purchase-bonus files currently at the repository root are a temporary
compatibility exception while their fulfillment links are migrated. Do not add
new gated files here. Remove the exception only after every external delivery
link has been verified against its replacement.


## Tool runtime releases

Garden Events and Build Your Flock use canonical `*-embed.html` sources here.
After editing either source, run `python scripts/build_tool_runtimes.py` and
commit the matching generated `*-runtime.js` file. The builder also updates its revision query in
the tool loader at the end of `ah-site-scripts.js`. Commit that file too. Pages
rejects stale generated runtimes or loader revisions.

The shared script loads each revision only on its tool page. It mounts a namespaced
tool root and leaves the native root hidden and inert as a sink for late legacy
async callbacks. Only the current runtime is visible and interactive. The surrounding Squarespace page stays intact. Native code
blocks are compatibility shells, not the current executable release authority.
Do not paste an older native embed over the canonical sources.

Related recommendations refresh from the complete public feed and sitemap every
day. The builder fails closed on incomplete inventory and only recommends known
public destinations. A script fallback handles newly published articles until
the next manifest release.
