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

Garden Events has a native inline compatibility embed. Its canonical executable
source is `garden-events-embed.html` here. After editing it, run
`python scripts/build_tool_runtimes.py`, then commit the generated
`garden-events-runtime.js` and updated loader revision in `ah-site-scripts.js`.
Pages rejects stale generated assets or loader revisions.

The shared site script mounts the current Garden Events runtime in a namespaced
root. The native root remains hidden and inert as a sink for late legacy async
callbacks. The surrounding Squarespace page stays intact.

Build Your Flock already fetches `build-your-flock-embed.html` from GitHub Pages
in its native shell. Publish changes to that embed directly; it needs no second
runtime loader. Feed refresh failures suppress retained stock and expose a
supplier-specific verification notice.

Related recommendations refresh from the complete public feed and sitemap every
day. The builder fails closed on incomplete inventory and only recommends known
public destinations. A no-store fetch and safe script fallback handle new posts
until the next manifest release.
