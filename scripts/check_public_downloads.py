"""Compare the Git-tracked PDF inventory with the reviewed public download list."""
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parents[1]
known = set((root / "scripts/public-pdf-paths.txt").read_text(encoding="utf-8").splitlines())
tracked = subprocess.check_output(["git", "ls-files", "-z"], cwd=root).decode("utf-8").split("\0")
actual = {name for name in tracked if name.lower().endswith(".pdf")}
unexpected = actual - known
missing = known - actual
if unexpected or missing:
    for name in sorted(unexpected):
        print(f"Unreviewed PDF in public repository: {name}")
    for name in sorted(missing):
        print(f"Reviewed public delivery path is missing: {name}")
    raise SystemExit(1)
print(f"Verified {len(actual)} reviewed public PDF paths.")
