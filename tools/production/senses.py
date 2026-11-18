"""Sense inventory for a headword (kvalitetsplanen A6). Replaces exists.py in the production brief.

usage:
  python3 senses.py <ord> [<ord> …]
      Shows: does the lemma exist (which file), its senses in display order (id, label, level, gloss, in
      which modules it is taught), whether it is in the core vocabulary, and whether senseInventory is set.
      Ends with what you must do before writing the module.
  python3 senses.py --mark <entry-id> <källa> [--core <sense-id>] [--note "<text>"]
      Sets senseInventory = { checkedAgainst: <källa>, date: today, coreSense?, note? } after you have
      checked the senses against the dictionary (SO, SAOL or Lexin) and added the missing common ones
      with add_sense (they do not have to be module words).

Rule (contract K3/K4): every headword that a new module teaches has a senseInventory; a lemma in the core
vocabulary also names its basic sense in coreSense. Show the everyday sense first with "order"."""
import collections
import datetime
import glob
import json
import os
import sys

D = os.environ.get('SWECHAN_REPO', os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))) + '/src/content/data/'
strip = lambda t: __import__('re').sub(r'\{([^|{}]+)\|[^{}]+\}', r'\1', t)


def entries():
    for f in sorted(glob.glob(D + 'dictionary/*.json')):
        d = json.load(open(f), object_pairs_hook=collections.OrderedDict)
        for e in d['entries']:
            yield f, d, e


def module_words():
    out = collections.defaultdict(list)
    for f in glob.glob(D + 'modules/*.json'):
        m = json.load(open(f))
        for w in m['words']:
            out[w['senseId']].append(m['id'])
    return out


def show(words):
    core = json.load(open(D + 'core/coreVocabulary.json'))
    cl = set(w.lower() for w in core['lemmas'])
    mw = module_words()
    found = collections.defaultdict(list)
    for f, _, e in entries():
        found[e['lemma'].lower()].append((f, e))
    for w in words:
        w2 = w.replace('_', ' ').lower()
        print(f'\n=== {w2}' + ('  (GRUNDORD)' if w2 in cl else ''))
        if not found.get(w2):
            print('  Finns inte. Skapa posten och lägg in ALLA vanliga betydelser (inte bara modulens).')
            if w2 in cl:
                print('  Grundord: grundbetydelsen ska finnas och anges i senseInventory.coreSense.')
            continue
        for f, e in found[w2]:
            ss = e['senses']
            pos = {s['id']: i for i, s in enumerate(ss)}
            ss = sorted(ss, key=lambda s: (s.get('order', float('inf')), pos[s['id']]))
            print(f"  {e['id']} ({e['pos']}, nivå {e['level']}) i {os.path.basename(f)}")
            for s in ss:
                lv = s.get('level', e['level'])
                mods = ', '.join(mw.get(s['id'], [])) or 'inte modulord'
                print(f"    {s['id']:<28} {s.get('labelSv', ''):<18} {lv}  {strip(s['ja'])}  [{mods}]")
            inv = e.get('senseInventory')
            if inv:
                print(f"  senseInventory: {inv.get('checkedAgainst')} {inv.get('date')}" + (f", coreSense {inv['coreSense']}" if inv.get('coreSense') else ''))
            else:
                print('  ATT GÖRA: kontrollera betydelserna mot SO/SAOL/Lexin, lägg till saknade vanliga betydelser med add_sense,')
                print("            sätt order (vardagsbetydelsen först) och kör: python3 senses.py --mark " + e['id'] + ' SO' + (' --core <id>' if w2 in cl else ''))
            if w2 in cl and not (inv or {}).get('coreSense'):
                print('  Grundord: ange grundbetydelsen med --core <sense-id> (lägg till den om den saknas).')


def mark(entry_id, source, core_sense=None, note=None):
    for f, d, e in entries():
        if e['id'] != entry_id:
            continue
        if core_sense and core_sense not in {s['id'] for s in e['senses']}:
            raise SystemExit(f'{core_sense} är inte en betydelse i {entry_id}')
        inv = collections.OrderedDict([('checkedAgainst', source), ('date', datetime.date.today().isoformat())])
        if core_sense:
            inv['coreSense'] = core_sense
        if note:
            inv['note'] = note
        e['senseInventory'] = inv
        open(f, 'w').write(json.dumps(d, ensure_ascii=False, indent=1) + '\n')
        print('senseInventory', entry_id, '->', os.path.basename(f))
        return
    raise SystemExit('saknar ' + entry_id)


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        raise SystemExit(__doc__)
    if a[0] == '--mark':
        core = a[a.index('--core') + 1] if '--core' in a else None
        note = a[a.index('--note') + 1] if '--note' in a else None
        mark(a[1], a[2], core, note)
    else:
        show(a)
