from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode

def split_links(raw: str) -> list[str]:
    if not raw: return []
    parts = [p.strip() for p in raw.replace("\r","").replace("\n",",").split(",")]
    out = []
    for p in parts:
        if not p: continue
        try:
            u = urlparse(p)
            if u.scheme not in ("http","https"): continue
            # strip tracking params
            q = [(k,v) for k,v in parse_qsl(u.query) if not k.lower().startswith(("utm_","fbclid","gclid"))]
            clean = urlunparse((u.scheme,u.netloc,u.path,"", urlencode(q), ""))
            out.append(clean)
        except: pass
    # de-dup while preserving order
    seen=set(); res=[]
    for x in out:
        if x in seen: continue
        seen.add(x); res.append(x)
    return res