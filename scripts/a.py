def pairs_gen(L):
    if len(L) == 2:
        yield [(L[0], L[1])]
    else:
        first = L.pop(0)
        for i, e in enumerate(L):
            second = L.pop(i)
            for list_of_pairs in pairs_gen(L):
                list_of_pairs.insert(0, (first, second))
                yield list_of_pairs
            L.insert(i, second)
        L.insert(0, first)


list = [
    '10c.png', '10d.png', '10h.png', '10s.png',
    '2c.png',  '2d.png',  '2h.png',  '2s.png',
    '3c.png',  '3d.png',  '3h.png',  '3s.png',
    '4c.png',  '4d.png',  '4h.png',  '4s.png',
    '5c.png',  '5d.png',  '5h.png',  '5s.png',
    '6c.png',  '6d.png',  '6h.png',  '6s.png',
    '7c.png',  '7d.png',  '7h.png',  '7s.png',
    '8c.png',  '8d.png',  '8h.png',  '8s.png',
    '9c.png',  '9d.png',  '9h.png',  '9s.png',
    'Ac.png',  'Ad.png',  'Ah.png',  'As.png',
    'Jc.png',  'Jd.png',  'Jh.png',  'Js.png',
    'Kc.png',  'Kd.png',  'Kh.png',  'Ks.png',
    'Qc.png',  'Qd.png',  'Qh.png',  'Qs.png'
]

for pairs in pairs_gen(list):
    print(pairs)
