#!/bin/bash
# usage: tools/production/check.sh [module-id …]
# 1. Regenerates the module index and contentVersion (npm run content:version).
# 2. Prints every vocabulary-check problem as a "VOC" line.
# 3. Runs module:validate for the given module ids.
# 4. Runs the quality gate (npm run audit:content): the contract for the given modules, then the
#    whole-repo check that no metric got worse. Exit code 1 if the gate fails.
# Set SWECHAN_REPO to work in another worktree.
HERE=$(cd "$(dirname "$0")" && pwd)
R=${SWECHAN_REPO:-$(cd "$HERE/../.." && pwd)}
cd "$R" || exit 1
npm run -s content:index >/dev/null
npm run -s content:version | sed 's/^/VER /'
sed "s#'\.\./\.\./src/#'./#g" "$HERE/vocab-check.test.template.ts" > src/zz_vc.test.ts
npx vitest run src/zz_vc.test.ts 2>&1 | grep '=>' | sed 's/^/VOC /'
rm -f src/zz_vc.test.ts
for m in "$@"; do npm run -s module:validate -- "$m" 2>&1 | tail -30; done
if [ $# -gt 0 ]; then node scripts/audit-content.mjs --module "$@" | sed 's/^/KONTRAKT /'; fi
node scripts/audit-content.mjs --check > /tmp/swechan-audit.txt 2>&1
status=$?
grep -E "SPÄRR|lägstanivå|Kontraktsfel|\[K|\[TEXT|\[standard|OK\.|bättre" /tmp/swechan-audit.txt | sed 's/^/SPÄRR /'
exit $status
