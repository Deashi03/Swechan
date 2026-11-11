"""usage: conf.py s.a.1 s.b.1 [s.c.1 …] – marks the senses as mutually confusable in wordVisuals.json and in every
group spec under agent/out/*/spec.json (so a later vis.py run keeps it). Keeps blindTest records."""
import json,sys,glob
ids=sys.argv[1:]
import os
R=os.environ.get('SWECHAN_REPO', os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')))+'/src/content/data/images/wordVisuals.json'
def upd(entries):
    for e in entries:
        if e['senseId'] in ids:
            cw=list(e.get('confusableWith',[]))
            for o in ids:
                if o!=e['senseId'] and o not in cw: cw.append(o)
            e['confusableWith']=cw
reg=json.load(open(R)); upd(reg['images']); json.dump(reg,open(R,'w'),ensure_ascii=False,indent=1); open(R,'a').write('\n')
for f in glob.glob(os.environ.get('PRODUCTION_SPECS', '/nonexistent/*.json')):
    s=json.load(open(f)); upd(s); json.dump(s,open(f,'w'),ensure_ascii=False)
print('ok',ids)
