"""add_sense(entry_id, n, sense) – append sense number n to an existing entry (idempotent: replaces s.<key>.<n> if present)."""
import json,glob,collections
from dsl import D
def add_sense(entry_id, n, sense):
    for f in glob.glob(D+'dictionary/*.json'):
        d=json.load(open(f),object_pairs_hook=collections.OrderedDict)
        for e in d['entries']:
            if e['id']!=entry_id: continue
            sid=f"s.{entry_id[2:]}.{n}"
            new={"id":sid,**{k:v for k,v in sense.items() if k!='id'}}
            e['senses']=[x for x in e['senses'] if x['id']!=sid]+[new]
            json.dump(d,open(f,'w'),ensure_ascii=False,indent=1)
            print('sense',sid,'->',f.split('/')[-1]); return sid
    raise SystemExit('saknar '+entry_id)
def set_label(sid,label):
    for f in glob.glob(D+'dictionary/*.json'):
        d=json.load(open(f),object_pairs_hook=collections.OrderedDict)
        for e in d['entries']:
            for s in e['senses']:
                if s['id']==sid:
                    if s.get('labelSv'): return
                    items=list(s.items()); i=[k for k,_ in items].index('examples')+1
                    s.clear(); s.update(items[:i]+[('labelSv',label)]+items[i:])
                    json.dump(d,open(f,'w'),ensure_ascii=False,indent=1); print('label',sid,'->',label); return
    raise SystemExit('saknar '+sid)
