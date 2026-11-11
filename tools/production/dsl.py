"""Compact authoring DSL for Swechan modules (0.5). One call per word.
n('potatis','en potatisen potatisar potatisarna','A1', s(...), ...)
v('koka','1 kokar kokade kokat koka pp=kokt','A1', s(...))
a('färsk','färskt färska färska färskare färskast','A2', s(...))   # or 'indecl'
x('ofta','adverb','A1', s(...))
s(ja, defSv, defJa, exSv, exJa, **kw)  kw: lab, tags, frame='Subj|compl', note=(sv,ja), coll=[...], concept, reg, syn=[(id,rel)], gn=[...], ex2=(sv,ja)
"""
import json, glob, os, re, sys
REPO=os.environ.get('SWECHAN_REPO', os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')))
D=REPO+'/src/content/data/'
import datetime
U=os.environ.get('SWECHAN_DATE', datetime.date.today().isoformat())
VER=os.environ.get('SWECHAN_VERSION', re.search(r"APP_VERSION = '([0-9]+\.[0-9]+)", open(REPO+'/src/config/appConfig.ts').read()).group(1))
TAGS=['mat']
def s(ja,defSv,defJa,exSv,exJa,lab=None,tags=None,frame=None,note=None,coll=None,concept=False,reg=None,syn=None,gn=None,ex2=None,alt=None,expl=None):
    d={"ja":ja,"defSv":defSv,"defJa":defJa,"concept":concept,"examples":[{"sv":exSv,"ja":exJa}]}
    if ex2: d["examples"].append({"sv":ex2[0],"ja":ex2[1]})
    if lab: d["labelSv"]=lab
    if alt: d["jaAlt"]=alt
    if coll: d["collocations"]=coll
    if reg: d["register"]=reg
    if note: d["usageNote"]={"sv":note[0],"ja":note[1]}
    if expl: d["explanation"]={"sv":expl[0],"ja":expl[1]}
    if syn: d["synonyms"]=[{"senseId":i,"relation":r} for i,r in syn]
    if gn: d["grammarNotes"]=gn
    if frame:
        sub,_,comp=frame.partition('|'); f={}
        if sub: f["subject"]=sub
        if comp: f["complement"]=comp
        d["frame"]=f
    d["tags"]=tags if tags is not None else list(TAGS)
    d["quality"]={"status":"ai-draft"}
    return d
def _entry(lemma,pos,level,infl,senses,pron=None,key=None):
    key=key or lemma.replace(' ','-')
    e={"id":"e."+key,"lemma":lemma,"pos":pos,"level":level,"inflection":infl}
    if pron: e["pronunciationNote"]=pron
    e["senses"]=[dict(sn,id=f"s.{key}.{i}") for i,sn in enumerate(senses,1)]
    # key order: id first
    e["senses"]=[{"id":sn["id"],**{k:v for k,v in sn.items() if k!="id"}} for sn in e["senses"]]
    return e
def n(lemma,forms,level,*senses,pron=None,variants=None,key=None):
    f=forms.split(); g=f[0]; rest=[None if x=='-' else x for x in f[1:]]
    infl={"kind":"noun","gender":g,"indefSg":lemma,"defSg":rest[0],"indefPl":rest[1],"defPl":rest[2]}
    if variants: infl["variants"]=variants
    return _entry(lemma,"noun",level,infl,senses,pron,key)
def v(lemma,forms,level,*senses,pron=None,variants=None,particle=None,key=None):
    f=[t.replace('_',' ') for t in forms.split()]; grp=f[0]; pres,past,sup,imp=f[1:5]
    infl={"kind":"verb","infinitive":lemma,"present":pres,"past":past,"supine":sup,"imperative":imp,"group":grp}
    for t in f[5:]:
        if t.startswith('pp='): infl["pastParticiple"]=t[3:]
    if particle: infl["particle"]=particle
    if variants: infl["variants"]=variants
    return _entry(lemma,"verb",level,infl,senses,pron,key)
def a(lemma,forms,level,*senses,pron=None,variants=None):
    if forms=='indecl': infl={"kind":"adjective","common":lemma,"neuter":lemma,"plural":lemma,"definite":lemma,"indeclinable":True}
    else:
        f=forms.split(); infl={"kind":"adjective","common":lemma,"neuter":f[0],"plural":f[1],"definite":f[2]}
        if len(f)>3: infl["comparative"]=f[3]; infl["superlative"]=f[4]
    if variants: infl["variants"]=variants
    return _entry(lemma,"adjective",level,infl,senses,pron)
def x(lemma,pos,level,*senses,pron=None,key=None):
    return _entry(lemma,pos,level,{"kind":"none"},senses,pron,key)

def existing_entries(exclude_file=None):
    out={}
    for f in glob.glob(D+'dictionary/*.json'):
        if exclude_file and os.path.abspath(f)==os.path.abspath(exclude_file): continue
        for e in json.load(open(f))['entries']: out[e['id']]=(e,f)
    return out
def ch(i,focus,prompt,opts,ex,exja=None,correct=None):
    """opts[0] is the correct answer; it is moved to position `correct` (default: by question number)."""
    k=correct if correct is not None else (int(i[1:])*3+len(prompt))%len(opts)
    o=list(opts[1:]); o.insert(k,opts[0])
    q={"kind":"choice","id":i,"focus":focus,"promptSv":prompt,"options":o,"correctIndex":k,"explanationSv":ex}
    if exja: q["explanationJa"]=exja
    return q
def tf(i,focus,st,correct,ex,exja=None):
    q={"kind":"truefalse","id":i,"focus":focus,"statementSv":st,"correct":correct,"explanationSv":ex}
    if exja: q["explanationJa"]=exja
    return q

def prev(mid):
    """Prerequisite that may not exist yet in a parallel worktree: falls back to the last published module."""
    return mid if os.path.exists(D+f'modules/{mid[2:]}.json') else os.environ.get('PREV_FALLBACK','m.konflikter-i-parrelationer')

def catalog_entry(cid):
    c=json.load(open(REPO+'/planning/catalog/swechan-catalog.v1.json'))
    return next(m for m in c['modules'] if m['catalogId']==cid)

def module(slug,cid,titleJa,descSv,descJa,level,prereq,words,reading,conversation,entries,order,tags=None,related=None,factSources=None,dictfile=None):
    """words: list of senseIds; suffix '*' = passive (active False)."""
    cat=catalog_entry(cid)
    if not 15<=len(words)<=20: sys.exit(f'{slug}: {len(words)} ord – en modul ska ha 15–20 ord')
    dictfile=dictfile or D+f'dictionary/m-{slug}.json'
    ex=existing_entries(exclude_file=dictfile)
    lem={(e['lemma'],e['pos']):i for i,(e,_) in ex.items()}
    for e in entries:
        if e['id'] in ex or (e['lemma'],e['pos']) in lem:
            sys.exit(f"DUBBLETT: {e['id']} finns redan i {ex.get(e['id'],(None,'?'))[1]} – återanvänd betydelsen")
    if entries:
        # keep explanations added later with explain.py (0.8) unless the script now sets one
        if os.path.exists(dictfile):
            old={s['id']:s for e in json.load(open(dictfile))['entries'] for s in e['senses']}
            for e in entries:
                for s in e['senses']:
                    if 'explanation' not in s and 'explanation' in old.get(s['id'],{}): s['explanation']=old[s['id']]['explanation']
        json.dump({"entries":entries},open(dictfile,'w'),ensure_ascii=False,indent=1)
    elif os.path.exists(dictfile): os.remove(dictfile)
    ws=[{"senseId":w.rstrip('*'),"active":not w.endswith('*')} for w in words]
    title,paras,qs=reading
    scen,points=conversation
    m={"id":f"m.{slug}","contentVersion":1,"updatedAt":U,"titleSv":cat['titleSv'],"titleJa":titleJa,
       "descriptionSv":descSv,"descriptionJa":descJa,"categoryId":cat['catalogCategoryId'],
       "tags":tags or list(TAGS),"level":level,"prerequisites":prereq,"related":related or [],"recommendedOrder":order,
       "words":ws,"reading":{"titleSv":title,"paragraphs":paras,"questions":qs,"factSources":factSources or ["Vardagsscen utan faktapåståenden."]},
       "conversation":{"scenarioSv":scen,"discussionPoints":points}}
    with open(D+f'modules/{slug}.json','w') as f: json.dump(m,f,ensure_ascii=False,indent=1); f.write("\n")
    # verified 1:1 link
    p=D+'catalog/publishedMapping.json'; mp=json.load(open(p))
    mp['links']=[l for l in mp['links'] if l['moduleId']!=m['id']]
    mp['links'].append({"catalogId":cid,"moduleId":m['id'],"verifiedBy":"Skriven för katalogposten i "+VER+": titel och ämne motsvarar posten exakt (AI-utkast; språket ej mänskligt granskat).","note":("Förkunskap: "+", ".join(prereq)) if prereq else "Första modulen i sin kedja."})
    mp['links'].sort(key=lambda l:l['catalogId'])
    open(p,'w').write(json.dumps(mp,ensure_ascii=False,indent=2)+"\n")
    print(f"{m['id']}: {len(ws)} ord, {len(entries)} nya poster")

def patch(path, pairs):
    """Apply (old, new) replacements; report misses instead of aborting."""
    s=open(path).read(); miss=[]
    for a,b in pairs:
        if s.count(a)!=1: miss.append(a[:70]); continue
        s=s.replace(a,b)
    open(path,'w').write(s)
    for m in miss: print('MISS:',m)

def fixn(e,g,ds,ip,dp):
    """Multiword noun (adjective + noun): set the inflection by hand."""
    e['inflection']={"kind":"noun","gender":g,"indefSg":e['lemma'],"defSg":ds,"indefPl":ip,"defPl":dp}
    return e
