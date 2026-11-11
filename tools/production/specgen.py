import os
"""usage: specgen.py FILE.ts PREFIX OUT.json 'grp1a,grp1b;grp2a,...' 'noquiz1,noquiz2' ['key=senseId,...']
symbol status comes from visualPlan (kind symbol) -> quiz false, symbol true."""
import re,json,sys
f,pre,out=sys.argv[1:4]; groups=sys.argv[4] if len(sys.argv)>4 else ''; noq=set((sys.argv[5] if len(sys.argv)>5 else '').split(','))
special=dict(x.split('=') for x in (sys.argv[6].split(',') if len(sys.argv)>6 and sys.argv[6] else []))
plan=json.load(open(os.environ.get('SWECHAN_REPO', os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')))+'/src/content/data/images/visualPlan.json'))['plan']
t=open(os.environ.get('SWECHAN_REPO', os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')))+'/src/ui/wordArt/'+f).read()
keys=re.findall(r"^  '"+re.escape(pre)+r"\.([^']+)':",t,re.M)
gmap={}
for gr in groups.split(';'):
    ks=[k for k in gr.split(',') if k]
    for k in ks: gmap[k]=ks[0]
spec=[]
for k in keys:
    sid=special.get(k) or (f's.{k}.1' if not re.search(r'\.\d+$',k) else f's.{k}')
    sym=plan.get(sid,{}).get('kind')=='symbol'
    e={'senseId':sid,'motif':f'{pre}.{k}','group':gmap.get(k,re.sub(r'\.\d+$','',k).split('-')[0]),'quiz':not sym and k not in noq,'plan':'symbol' if sym else 'scene'}
    if sym: e['symbol']=True
    spec.append(e)
json.dump(spec,open(out,'w'),ensure_ascii=False); print(len(spec), 'symbols', sum(1 for e in spec if e.get('symbol')))
