"""Upsert illustration entries into wordVisuals.json and fulfil the visual plan (kvalitetsplanen A5).
usage: python3 vis.py <json-spec-file>
spec: [{senseId, motif, group, quiz, confusableWith?, symbol?, animated?, plan?, waiver?}]

- The plan is NOT overwritten: a row that already exists keeps its kind. `plan` only sets the kind of a
  sense that has no row yet (default: symbol for symbol pictures, otherwise scene).
- If the plan says animation, deliver an animation (scripts/scenes, or an illustration with
  "animated": true – CSS animation in the motif, base state = poster frame). A still picture needs
  "waiver": "<reason>" and is reported otherwise (the quality gate stops it for new modules).
- Delivering a picture clears status "manual" (the manual track)."""
import json,sys
import os
R=os.environ.get('SWECHAN_REPO', os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')))+'/src/content/data/images/'
spec=json.load(open(sys.argv[1]))
reg=json.load(open(R+'wordVisuals.json')); by={i['senseId']:i for i in reg['images']}
plan=json.load(open(R+'visualPlan.json'))
warn=[]
for s in spec:
    sid=s['senseId']
    e={'senseId':sid,'kind':'illustration','motif':s['motif'],'group':s['group'],'quiz':s.get('quiz',True)}
    if s.get('animated'): e['animated']=True
    if s.get('confusableWith'): e['confusableWith']=s['confusableWith']
    if s.get('symbol'): e['symbol']=True
    prev=by.get(sid)
    if prev and prev['kind'] in ('animation','face'): prev['fallbackMotif']=s['motif']; continue
    by[sid]=e
    row=plan['plan'].get(sid)
    if row is None:
        row={'kind':s.get('plan','symbol' if s.get('symbol') else 'scene'),'by':'manual'}
    else:
        row=dict(row); row['by']='manual'
    row.pop('status',None)
    if s.get('waiver'): row['waiver']=s['waiver']
    if row['kind']=='animation' and not e.get('animated') and not row.get('waiver'):
        warn.append(sid)
    plan['plan'][sid]=row
order=[i['senseId'] for i in reg['images']]
reg['images']=[by[k] for k in order]+[by[k] for k in by if k not in set(order)]
json.dump(reg,open(R+'wordVisuals.json','w'),ensure_ascii=False,indent=1); open(R+'wordVisuals.json','a').write('\n')
txt=json.dumps(plan,ensure_ascii=False,separators=(',',':')).replace('},"','},\n"').replace('{"_comment"','{\n"_comment"',1)
open(R+'visualPlan.json','w').write(txt+'\n')
print('ok',len(spec))
for sid in warn:
    print(f'VARNING {sid}: planen säger animation men bilden är stilla – gör en animation ("animated": true eller scripts/scenes) eller ange "waiver": "<skäl>"')
