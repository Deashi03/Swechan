"""usage: dedup.py <script.py> <spec.json> <lemma> [senseId]
Removes the entry for <lemma> from a module script (the sense stays in `words`, now pointing at the
existing entry) and drops the sense from the group's picture spec (the earlier picture is kept)."""
import re,sys,json
scr,spec,lemma=sys.argv[1:4]; sid=sys.argv[4] if len(sys.argv)>4 else 's.'+lemma.replace(' ','-')+'.1'
t=open(scr).read().split('\n')
pat=re.compile(r"^(?:\w+\()?[nvax]\('"+re.escape(lemma)+r"',")
hit=[i for i,l in enumerate(t) if pat.match(l)]
assert len(hit)==1,(hit,lemma)
del t[hit[0]]; open(scr,'w').write('\n'.join(t))
s=json.load(open(spec)); n=len(s); s=[e for e in s if e['senseId']!=sid]
json.dump(s,open(spec,'w'),ensure_ascii=False); print('removed entry',lemma,'spec',n,'->',len(s))
