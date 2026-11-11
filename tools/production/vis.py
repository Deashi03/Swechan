"""Upsert illustration entries into wordVisuals.json and set the plan to manual.
usage: python3 vis.py <json-spec-file>   spec: [{senseId, motif, group, quiz, confusableWith?, symbol?, plan?}]"""
import json,sys
import os
R=os.environ.get('SWECHAN_REPO', os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')))+'/src/content/data/images/'
spec=json.load(open(sys.argv[1]))
reg=json.load(open(R+'wordVisuals.json')); by={i['senseId']:i for i in reg['images']}
plan=json.load(open(R+'visualPlan.json'))
for s in spec:
    e={'senseId':s['senseId'],'kind':'illustration','motif':s['motif'],'group':s['group'],'quiz':s.get('quiz',True)}
    if s.get('confusableWith'): e['confusableWith']=s['confusableWith']
    if s.get('symbol'): e['symbol']=True
    prev=by.get(s['senseId'])
    if prev and prev['kind']=='animation': prev['fallbackMotif']=s['motif']; continue
    by[s['senseId']]=e
    plan['plan'][s['senseId']]={'kind':s.get('plan','scene'),'by':'manual'}
order=[i['senseId'] for i in reg['images']]
reg['images']=[by[k] for k in order]+[by[k] for k in by if k not in set(order)]
json.dump(reg,open(R+'wordVisuals.json','w'),ensure_ascii=False,indent=1); open(R+'wordVisuals.json','a').write('\n')
txt=json.dumps(plan,ensure_ascii=False,separators=(',',':')).replace('},"','},\n"').replace('{"_comment"','{\n"_comment"',1)
open(R+'visualPlan.json','w').write(txt+'\n')
print('ok',len(spec))
