#!/bin/bash
# usage: tools/production/check.sh [module-id …]
# Regenerates the module index, prints every vocabulary-check problem as a "VOC" line, then runs
# module:validate for the given module ids. Set SWECHAN_REPO to work in another worktree.
HERE=$(cd "$(dirname "$0")" && pwd)
R=${SWECHAN_REPO:-$(cd "$HERE/../.." && pwd)}
cd "$R" || exit 1
npm run -s content:index >/dev/null
sed "s#'\.\./\.\./src/#'./#g" "$HERE/vocab-check.test.template.ts" > src/zz_vc.test.ts
npx vitest run src/zz_vc.test.ts 2>&1 | grep '=>' | sed 's/^/VOC /'
rm -f src/zz_vc.test.ts
for m in "$@"; do npm run -s module:validate -- "$m" 2>&1 | tail -30; done
