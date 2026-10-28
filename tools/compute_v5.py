"""v5 LAST DOWNLINK helper: recompute bearings, geometry checks and Vigenere ciphertexts.
Pixel coordinates below were read from UT_Map_Preview.png (page-up = north).
Edit TEAMS / KEYS or B if you change buildings, then run: python3 compute_v5.py
"""
import math, itertools

B = {'53':(360,288),'55':(688,265),'45':(810,287),'47':(628,405),'49':(378,440),'61':(268,483),
     '51':(473,487),'48':(548,482),'44':(728,473),'40':(1313,358),'31':(1620,432),'30':(1680,502),
     '41':(1078,585),'43':(855,610),'42':(811,660),'62':(155,665),'63':(140,715),'4':(578,730),
     '93':(1497,586),'23':(1492,632),'25':(1538,640),'24':(1593,647),'22':(1415,665),'21':(1523,690),
     '20':(1580,735),'14':(1223,708),'11':(1158,725),'10':(1070,778),'13':(1218,778),'15':(1288,820),
     '12':(1215,840),'0':(1160,823),'5':(933,797),'7':(908,827),'9':(1088,860),'26':(1632,800),
     '29':(1585,832),'27':(1588,868),'16':(1320,878),'28':(1456,878),'8':(970,895),'6':(887,916),
     '3':(672,915),'2':(578,1000),'18':(1277,950),'94':(1343,963),'19':(1140,1000),'17':(1246,1030)}

TEAMS = {1:('41',['3','19','26']), 2:('44',['3','63','94']), 3:('4',['2','40','6']),
         4:('40',['49','26','9']), 5:('53',['63','4','55'])}
KEYS = {1:'EYES ON EARTH', 2:'MAP OUR WORLD', 3:'EARTH IN FOCUS', 4:'READ THE EARTH', 5:'SEE THE CHANGE'}
WORDS = {'0':'ZERO','1':'ONE','2':'TWO','3':'THREE','4':'FOUR','5':'FIVE','6':'SIX','7':'SEVEN','8':'EIGHT','9':'NINE'}

def az(s, t):
    sx, sy = B[s]; tx, ty = B[t]
    return math.degrees(math.atan2(tx-sx, sy-ty)) % 360, math.hypot(tx-sx, ty-sy)

def vig(p, k):
    p = ''.join(c for c in p.upper() if c.isalpha()); k = ''.join(c for c in k.upper() if c.isalpha())
    return ''.join(chr((ord(c)-65+ord(k[i%len(k)])-65) % 26 + 65) for i, c in enumerate(p))

def dec(c, k):
    k = ''.join(x for x in k.upper() if x.isalpha()); c = c.replace(' ', '')
    return ''.join(chr((ord(x)-65-(ord(k[i%len(k)])-65)) % 26 + 65) for i, x in enumerate(c))

for t, (tgt, st) in TEAMS.items():
    plain = ' '.join(WORDS[d] for d in ''.join(s.zfill(2) for s in st))
    c = vig(plain, KEYS[t]); g = ' '.join(c[i:i+5] for i in range(0, len(c), 5))
    assert dec(g, KEYS[t]) == plain.replace(' ', '')
    print(f'\nTeam {t}: key {KEYS[t].replace(" ","")} | target {tgt}')
    print(f'  plain  {plain}\n  cipher {g}')
    azs = []
    for s in st:
        a, d = az(s, tgt); azs.append(a)
        print(f'  station {s.zfill(2)} -> {tgt}: {round(a):03d} deg  ({d:.0f} px)')
    angles = []
    for i, j in itertools.combinations(range(3), 2):
        d = abs(azs[i]-azs[j]) % 180; angles.append(min(d, 180-d))
    tx, ty = B[tgt]
    near = sorted((math.hypot(x-tx, y-ty), k) for k, (x, y) in B.items() if k != tgt)[:2]
    print(f'  min crossing angle {min(angles):.0f} deg; nearest other circles {[(k, round(d)) for d, k in near]} px')
