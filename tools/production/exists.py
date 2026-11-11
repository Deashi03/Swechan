import os
import json,glob,sys,os
D=os.environ.get('SWECHAN_REPO', os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')))+'/src/content/data/'
lem={}
for f in glob.glob(D+'dictionary/*.json'):
    d=json.load(open(f)); e=d if isinstance(d,list) else d.get('entries',d)
    for x in e: lem.setdefault(x['lemma'].lower(),[]).append(os.path.basename(f)[:-5])
core=json.load(open(D+'core/coreVocabulary.json'))
cl=set(w.lower() for w in core['lemmas']+core['irregularForms'])
for w in sys.argv[1:]:
    w2=w.replace('_',' ').lower()
    r=lem.get(w2); c='CORE' if w2 in cl else ''
    if r or c: print(f'{w2}: {",".join(r or [])} {c}')
