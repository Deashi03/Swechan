"""Medium answers with the right word are accepted unless the reviewer says another word fits equally well.
usage: accept.py <blind-dir>  → prints comma list of senseIds"""
import json,glob,sys,re
import os
d=sys.argv[1]; key=json.load(open(d+'/key.json'))
lem={}
for f in glob.glob(os.environ.get('SWECHAN_REPO', os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')))+'/src/content/data/dictionary/*.json'):
    for e in json.load(open(f))['entries']:
        for s in e['senses']: lem[s['id']]=e['lemma']
acc=[]
for f in glob.glob(d+'/answers_*.json'):
    for m,items in json.load(open(f)).items():
        for n,r in items.items():
            sid=key.get(m,{}).get(n)
            if sid and r.get('conf')=='medium' and r.get('word')==lem.get(sid) and not re.search(r'equal|lika|same|unclear|ambiguous',r.get('problem',''),re.I): acc.append(sid)
print(','.join(acc))
