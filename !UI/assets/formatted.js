// This is just index-DU3ghlCc.js with formatting and indents. It breaks functionality.

var Pe = Object.defineProperty;
var De = (t, e, n) => e in t ? Pe(t, e, {enumerable: true, configurable: true, writable: true, value: n}) : t[e] = n;
var jt = (t, e, n) => De(t, typeof e != "symbol" ? e + "" : e, n);
(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) i(s);
  new MutationObserver(s => {
    for (const r of s) if (r.type === "childList") for (const o of r.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && i(o);
  }).observe(document, {childList: true, subtree: true});
  function n(s) {
    const r = {};
    return s.integrity && (r.integrity = s.integrity), s.referrerPolicy && (r.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? r.credentials = "include" : s.crossOrigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin", r;
  }
  function i(s) {
    if (s.ep) return;
    s.ep = true;
    const r = n(s);
    fetch(s.href, r);
  }
}());
function M() {}
const Mt = t => t;
function K(t) {
  t.forEach(ge);
}
function Pt(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
let _t;
function Ee(t, e) {
  return t === e ? true : (_t || (_t = document.createElement("a")), _t.href = e, t === _t.href);
}
function le(t) {
  const e = typeof t == "string" && t.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return e ? [parseFloat(e[1]), e[2] || "px"] : [t, "px"];
}
const ye = typeof window < "u";
let Dt = ye ? () => window.performance.now() : () => Date.now(), Vt = ye ? t => requestAnimationFrame(t) : M;
const Z = new Set;
function ve(t) {
  Z.forEach(e => {
    e.c(t) || (Z.delete(e), e.f());
  }), Z.size !== 0 && Vt(ve);
}
function Et(t) {
  let e;
  return Z.size === 0 && Vt(ve), {promise: new Promise(n => {
    Z.add(e = {c: t, f: n});
  }), abort() {
    Z.delete(e);
  }};
}
function h(t, e) {
  t.appendChild(e);
}
function $e(t) {
  if (!t) return document;
  const e = t.getRootNode ? t.getRootNode() : t.ownerDocument;
  return e && e.host ? e : t.ownerDocument;
}
function Ne(t) {
  const e = document.createElement("style");
  return e.textContent = "/* empty */", (h($e(t).head || $e(t), e), e.sheet), e.sheet;
}
function k(t, e, n) {
  t.insertBefore(e, n || null);
}
function w(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function Fe(t, e) {
  for (let n = 0; n < t.length; n += 1) t[n] && t[n].d(e);
}
function b(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function A(t, e) {
  e = "" + e, t.data !== e && (t.data = e);
}
function ht(t, e, n, i) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
function Y(t, e, n) {
  t.classList.toggle(e, !!n);
}
function Ae(t, e, {bubbles: n = false, cancelable: i = false} = {}) {
  return new CustomEvent(t, {detail: e, bubbles: n, cancelable: i});
}
const bt = new Map;
let wt = 0;
function Te(t) {
  let e = 5381, n = t.length;
  for (; n--;) e = (e << 5) - e ^ t.charCodeAt(n);
  return e >>> 0;
}
function Be(t, e) {
  const n = {stylesheet: Ne(e), rules: {}};
  return bt.set(t, n), n;
}
function ot(t, e, n, i, s, r, o, l = 0) {
  const a = 16.666 / i;
  let c = `{
`;
  for (let $ = 0; $ <= 1; $ += a) {
    const u = e + (n - e) * r($);
    c += $ * 100 + `%{${o(u, 1 - u)}}
`;
  }
  const f = c + `100% {${o(n, 1 - n)}}
}`, p = `__svelte_${Te(f)}_${l}`, _ = $e(t), {stylesheet: g, rules: d} = bt.get(_) || Be(_, t);
  d[p] || (d[p] = true, g.insertRule(`@keyframes ${p} ${f}`, g.cssRules.length));
  const m = t.style.animation || "";
  return t.style.animation = `${m ? `${m}, ` : ""}${p} ${i}ms linear ${s}ms 1 both`, wt += 1, p;
}
function at(t, e) {
  const n = (t.style.animation || "").split(", "), i = n.filter(e ? r => r.indexOf(e) < 0 : r => r.indexOf("__svelte") === -1), s = n.length - i.length;
  s && (t.style.animation = i.join(", "), wt -= s, wt || je());
}
function je() {
  Vt(() => {
    wt || (bt.forEach(t => {
      const {ownerNode: e} = t.stylesheet;
      e && w(e);
    }), bt.clear());
  });
}
function qe(t, e, n, i) {
  if (!e) return M;
  const s = t.getBoundingClientRect();
  if (e.left === s.left && e.right === s.right && e.top === s.top && e.bottom === s.bottom) return M;
  const {delay: r = 0, duration: o = 300, easing: l = Mt, start: a = Dt() + r, end: c = a + o, tick: f = M, css: p} = n(t, {from: e, to: s}, i);
  let _ = true, g = false, d;
  function m() {
    p && (d = ot(t, 0, 1, o, r, l, p)), r || (g = true);
  }
  function $() {
    p && at(t, d), _ = false;
  }
  return Et(u => {
    if (!g && u >= a && (g = true), g && u >= c && (f(1, 0), $()), !_) return false;
    if (g) {
      const y = u - a, x = 0 + 1 * l(y / o);
      f(x, 1 - x);
    }
    return true;
  }), m(), f(0, 1), $;
}
function Ie(t) {
  const e = getComputedStyle(t);
  if (e.position !== "absolute" && e.position !== "fixed") {
    const {width: n, height: i} = e, s = t.getBoundingClientRect();
    t.style.position = "absolute", t.style.width = n, t.style.height = i, ze(t, s);
  }
}
function ze(t, e) {
  const n = t.getBoundingClientRect();
  if (e.left !== n.left || e.top !== n.top) {
    const i = getComputedStyle(t), s = i.transform === "none" ? "" : i.transform;
    t.style.transform = `${s} translate(${e.left - n.left}px, ${e.top - n.top}px)`;
  }
}
let ct;
function lt(t) {
  ct = t;
}
function we() {
  if (!ct) throw new Error("Function called outside component initialization");
  return ct;
}
function Ve(t) {
  we().$$.on_mount.push(t);
}
function ke(t) {
  we().$$.on_destroy.push(t);
}
const X = [], oe = [];
let tt = [];
const ae = [], Ue = Promise.resolve();
let It = false;
function Ge() {
  It || (It = true, Ue.then(Ce));
}
function q(t) {
  tt.push(t);
}
const qt = new Set;
let Q = 0;
function Ce() {
  if (Q !== 0) return;
  const t = ct;
  do {
    try {
      for (; Q < X.length;) {
        const e = X[Q];
        Q++, lt(e), He(e.$$);
      }
    } catch (e) {
      throw X.length = 0, Q = 0, e;
    }
    for (lt(null), X.length = 0, Q = 0; oe.length;) oe.pop()();
    for (let e = 0; e < tt.length; e += 1) {
      const n = tt[e];
      qt.has(n) || (qt.add(n), n());
    }
    tt.length = 0;
  } while (X.length);
  for (; ae.length;) ae.pop()();
  It = false, qt.clear(), lt(t);
}
function He(t) {
  if (t.fragment !== null) {
    t.update(), K(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(q);
  }
}
function Ke(t) {
  const e = [], n = [];
  tt.forEach(i => t.indexOf(i) === -1 ? e.push(i) : n.push(i)), n.forEach(i => i()), tt = e;
}
let st;
function Ut() {
  return st || (st = Promise.resolve(), st.then(() => {
    st = null;
  })), st;
}
function W(t, e, n) {
  t.dispatchEvent(Ae(`${e ? "intro" : "outro"}${n}`));
}
const vt = new Set;
let j;
function Gt() {
  j = {r: 0, c: [], p: j};
}
function Ht() {
  j.r || K(j.c), j = j.p;
}
function R(t, e) {
  t && t.i && (vt.delete(t), t.i(e));
}
function z(t, e, n, i) {
  if (t && t.o) {
    if (vt.has(t)) return;
    vt.add(t), j.c.push(() => {
      vt.delete(t), i && (n && t.d(1), i());
    }), t.o(e);
  } else i && i();
}
const Kt = {duration: 0};
function Se(t, e, n) {
  const i = {direction: "in"};
  let s = e(t, n, i), r = false, o, l, a = 0;
  function c() {
    o && at(t, o);
  }
  function f() {
    const {delay: _ = 0, duration: g = 300, easing: d = Mt, tick: m = M, css: $} = s || Kt;
    $ && (o = ot(t, 0, 1, g, _, d, $, a++)), m(0, 1);
    const u = Dt() + _, y = u + g;
    l && l.abort(), r = true, q(() => W(t, true, "start")), l = Et(x => {
      if (r) {
        if (x >= y) return m(1, 0), W(t, true, "end"), c(), r = false;
        if (x >= u) {
          const C = d((x - u) / g);
          m(C, 1 - C);
        }
      }
      return r;
    });
  }
  let p = false;
  return {start() {
    p || (p = true, at(t), typeof s == "function" ? (s = s(i), Ut().then(f)) : f());
  }, invalidate() {
    p = false;
  }, end() {
    r && (c(), r = false);
  }};
}
function We(t, e, n) {
  const i = {direction: "out"};
  let s = e(t, n, i), r = true, o;
  const l = j;
  l.r += 1;
  let a;
  function c() {
    const {delay: f = 0, duration: p = 300, easing: _ = Mt, tick: g = M, css: d} = s || Kt;
    d && (o = ot(t, 1, 0, p, f, _, d));
    const m = Dt() + f, $ = m + p;
    q(() => W(t, false, "start")), "inert" in t && (a = t.inert, t.inert = true), Et(u => {
      if (r) {
        if (u >= $) return g(0, 1), W(t, false, "end"), --l.r || K(l.c), false;
        if (u >= m) {
          const y = _((u - m) / p);
          g(1 - y, y);
        }
      }
      return r;
    });
  }
  return typeof s == "function" ? Ut().then(() => {
    s = s(i), c();
  }) : c(), {end(f) {
    f && "inert" in t && (t.inert = a), f && s.tick && s.tick(1, 0), r && (o && at(t, o), r = false);
  }};
}
function kt(t, e, n, i) {
  let r = e(t, n, {direction: "both"}), o = i ? 0 : 1, l = null, a = null, c = null, f;
  function p() {
    c && at(t, c);
  }
  function _(d, m) {
    const $ = d.b - o;
    return m *= Math.abs($), {a: o, b: d.b, d: $, duration: m, start: d.start, end: d.start + m, group: d.group};
  }
  function g(d) {
    const {delay: m = 0, duration: $ = 300, easing: u = Mt, tick: y = M, css: x} = r || Kt, C = {start: Dt() + m, b: d};
    d || (C.group = j, j.r += 1), "inert" in t && (d ? f !== undefined && (t.inert = f) : (f = t.inert, t.inert = true)), l || a ? a = C : (x && (p(), c = ot(t, o, d, $, m, u, x)), d && y(0, 1), l = _(C, $), q(() => W(t, d, "start")), Et(O => {
      if (a && O > a.start && (l = _(a, $), a = null, W(t, l.b, "start"), x && (p(), c = ot(t, o, l.b, l.duration, 0, u, r.css))), l) {
        if (O >= l.end) y(o = l.b, 1 - o), W(t, l.b, "end"), a || (l.b ? p() : --l.group.r || K(l.group.c)), l = null; else if (O >= l.start) {
          const V = O - l.start;
          o = l.a + l.d * u(V / l.duration), y(o, 1 - o);
        }
      }
      return !!(l || a);
    }));
  }
  return {run(d) {
    typeof r == "function" ? Ut().then(() => {
      r = r({direction: d ? "in" : "out"}), g(d);
    }) : g(d);
  }, end() {
    p(), l = a = null;
  }};
}
function Ct(t) {
  return (t == null ? undefined : t.length) !== undefined ? t : Array.from(t);
}
function Je(t, e) {
  t.d(1), e.delete(t.key);
}
function Qe(t, e) {
  t.f(), Je(t, e);
}
function Xe(t, e, n, i, s, r, o, l, a, c, f, p) {
  let _ = t.length, g = r.length, d = _;
  const m = {};
  for (; d--;) m[t[d].key] = d;
  const $ = [], u = new Map, y = new Map, x = [];
  for (d = g; d--;) {
    const S = p(s, r, d), E = n(S);
    let N = o.get(E);
    N ? x.push(() => N.p(S, e)) : (N = c(E, S), N.c()), u.set(E, $[d] = N), E in m && y.set(E, Math.abs(d - m[E]));
  }
  const C = new Set, O = new Set;
  function V(S) {
    R(S, 1), S.m(l, f), o.set(S.key, S), f = S.first, g--;
  }
  for (; _ && g;) {
    const S = $[g - 1], E = t[_ - 1], N = S.key, I = E.key;
    S === E ? (f = S.first, _--, g--) : u.has(I) ? !o.has(N) || C.has(N) ? V(S) : O.has(I) ? _-- : y.get(N) > y.get(I) ? (O.add(N), V(S)) : (C.add(I), _--) : (a(E, o), _--);
  }
  for (; _--;) {
    const S = t[_];
    u.has(S.key) || a(S, o);
  }
  for (; g;) V($[g - 1]);
  return K(x), $;
}
function zt(t) {
  t && t.c();
}
function St(t, e, n) {
  const {fragment: i, after_update: s} = t.$$;
  i && i.m(e, n), q(() => {
    const r = t.$$.on_mount.map(ge).filter(et);
    t.$$.on_destroy ? t.$$.on_destroy.push(...r) : K(r), t.$$.on_mount = [];
  }), s.forEach(q);
}
function xt(t, e) {
  const n = t.$$;
  n.fragment !== null && (Ke(n.after_update), K(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function Ye(t, e) {
  t.$$.dirty[0] === -1 && (X.push(t), Ge(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function Lt(t, e, n, i, s, r, o = null, l = [-1]) {
  const a = ct;
  lt(t);
  const c = t.$$ = {fragment: null, ctx: [], props: r, update: M, not_equal: s, bound: Object.create(null), on_mount: [], on_destroy: [], on_disconnect: [], before_update: [], after_update: [], context: new Map(e.context || (a ? a.$$.context : [])), callbacks: Object.create(null), dirty: l, skip_bound: false, root: e.target || a.$$.root};
  o && o(c.root);
  let f = false;
  if (c.ctx = n ? n(t, e.props || {}, (p, _, ...g) => {
    const d = g.length ? g[0] : _;
    return c.ctx && s(c.ctx[p], c.ctx[p] = d) && (!c.skip_bound && c.bound[p] && c.bound[p](d), f && Ye(t, p)), _;
  }) : [], c.update(), f = true, K(c.before_update), c.fragment = i ? i(c.ctx) : false, e.target) {
    if (e.hydrate) {
      const p = Array.from(e.target.childNodes);
      c.fragment && c.fragment.l(p), p.forEach(w);
    } else c.fragment && c.fragment.c();
    e.intro && R(t.$$.fragment), St(t, e.target, e.anchor), Ce();
  }
  lt(a);
}
class Nt {
  constructor() {
    jt(this, "$$");
    jt(this, "$$set");
  }
  $destroy() {
    xt(this, 1), this.$destroy = M;
  }
  $on(e, n) {
    if (!(typeof n == "function")) return M;
    const i = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return i.push(n), () => {
      const s = i.indexOf(n);
      s !== -1 && i.splice(s, 1);
    };
  }
  $set(e) {
    this.$$set && !(Object.keys(e).length === 0) && (this.$$.skip_bound = true, this.$$set(e), this.$$.skip_bound = false);
  }
}
const Ze = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = {v: new Set})).v.add(Ze);
function xe(t) {
  const e = t - 1;
  return e * e * e + 1;
}
function J(t, {delay: e = 0, duration: n = 400, easing: i = xe, x: s = 0, y: r = 0, opacity: o = 0} = {}) {
  const l = getComputedStyle(t), a = +l.opacity, c = l.transform === "none" ? "" : l.transform, f = a * (1 - o), [p, _] = le(s), [g, d] = le(r);
  return {delay: e, duration: n, easing: i, css: (m, $) => `
			transform: ${c} translate(${(1 - m) * p}${_}, ${(1 - m) * g}${d});
			opacity: ${a - f * $}`};
}
function tn(t) {
  let e, n, i, s, r;
  return {c() {
    e = document.createElement("div"), n = document.createTextNode(t[0]), b(e, "class", "container svelte-1hfhhcc");
  }, m(o, l) {
    k(o, e, l), h(e, n), r = true;
  }, p(o, [l]) {
    (!r || l & 1) && A(n, o[0]);
  }, i(o) {
    r || (o && q(() => {
      r && (s && s.end(1), i = Se(e, J, {y: 50, opacity: 0}), i.start());
    }), r = true);
  }, o(o) {
    i && i.invalidate(), o && (s = We(e, J, {y: -50, opacity: 0})), r = false;
  }, d(o) {
    o && w(e), o && s && s.end();
  }};
}
function en(t, e, n) {
  let {text: i} = e;
  return t.$$set = s => {
    "text" in s && n(0, i = s.text);
  }, [i];
}
class nn extends Nt {
  constructor(e) {
    super(), Lt(this, e, en, tn, Pt, {text: 0});
  }
}
const T = {};
function rt(t, e) {
  e !== null && (T[t] === undefined && (T[t] = []), T[t].push(e));
}
function Me(t) {
  t ? (T[t] === undefined && (T[t] = []), T[t] = []) : (T.camera_mode_changed = [], T.frame = [], T.localPlayerData = []);
}
function $t(t, e) {
  if (T[t] != null) try {
    T[t].forEach(n => n(e));
  } catch {
    console.error(t), console.error(e);
  }
  return e;
}
function sn(t = "http://127.0.0.1:5420", e = {}) {
  e.useLastReplay || false ? fetch(`${t}/state/all_frames`).then(i => i.json()).then(i => i.frames).then(i => {
    $t("frame", i[i.length - 1]);
  }) : fetch(`${t}/state`).then(i => i.json()).then(i => {
    $t("frame", i);
  }), fetch(`${t}/state/local_player`).then(i => i.json()).then(i => {
    $t("local_player_data", i);
  });
}
async function rn(t = "http://127.0.0.1:5420") {
  return await fetch(`${t}/netvars`).then(e => e.json());
}
window.overlayConnector = {event: $t};
function ce(t) {
  let e, n, i, s = t[0].points + "", r, o, l, a, c, f, p = t[0].primaryPlayer + "", _, g, d, m, $, u, y = t[0].secondaryPlayer + "", x, C, O, V, S, E, N, I = t[0].speed.toFixed(1) + "", Ot, Wt, Jt, Ft, Qt, ft, Xt, U, nt, ut = t[0].distance.toFixed(1) + "", Rt, Yt, Zt, At, te, dt, ee, G, it, pt = t[0].scoreTime.toFixed(0) + "", Tt, ne, ie, Bt, se, mt, H, F;
  return {c() {
    e = document.createElement("div"), n = document.createElement("div"), i = document.createElement("div"), r = document.createTextNode(s), o = document.createTextNode(" "), l = document.createElement("span"), l.textContent = "pts", a = document.createTextNode(" "), c = document.createElement("div"), f = document.createElement("div"), _ = document.createTextNode(p), g = document.createTextNode(" "), d = document.createElement("p"), d.textContent = "Scored By", m = document.createTextNode(" "), $ = document.createElement("div"), u = document.createElement("div"), x = document.createTextNode(y), C = document.createTextNode(" "), O = document.createElement("p"), O.textContent = "Assist By", V = document.createTextNode(" "), S = document.createElement("div"), E = document.createElement("div"), N = document.createElement("div"), Ot = document.createTextNode(I), Wt = document.createTextNode(" m/s"), Jt = document.createTextNode(" "), Ft = document.createElement("hr"), Qt = document.createTextNode(" "), ft = document.createElement("p"), ft.textContent = "Speed", Xt = document.createTextNode(" "), U = document.createElement("div"), nt = document.createElement("div"), Rt = document.createTextNode(ut), Yt = document.createTextNode(" m"), Zt = document.createTextNode(" "), At = document.createElement("hr"), te = document.createTextNode(" "), dt = document.createElement("p"), dt.textContent = "Distance", ee = document.createTextNode(" "), G = document.createElement("div"), it = document.createElement("div"), Tt = document.createTextNode(pt), ne = document.createTextNode(" s"), ie = document.createTextNode(" "), Bt = document.createElement("hr"), se = document.createTextNode(" "), mt = document.createElement("p"), mt.textContent = "Time", b(l, "class", "svelte-re7f2i"), b(i, "class", "points svelte-re7f2i"), b(f, "class", "player"), b(d, "class", "subtext svelte-re7f2i"), b(c, "class", "stacked-name svelte-re7f2i"), b(u, "class", "assist"), b(O, "class", "subtext svelte-re7f2i"), b($, "class", "stacked-name svelte-re7f2i"), b(n, "class", "row svelte-re7f2i"), b(N, "class", "speed svelte-re7f2i"), b(Ft, "class", "svelte-re7f2i"), b(ft, "class", "subtext svelte-re7f2i"), b(E, "class", "stacked-stat svelte-re7f2i"), b(nt, "class", "distance svelte-re7f2i"), b(At, "class", "svelte-re7f2i"), b(dt, "class", "subtext svelte-re7f2i"), b(U, "class", "stacked-stat svelte-re7f2i"), b(it, "class", "time svelte-re7f2i"), b(Bt, "class", "svelte-re7f2i"), b(mt, "class", "subtext svelte-re7f2i"), b(G, "class", "stacked-stat svelte-re7f2i"), b(S, "class", "row svelte-re7f2i"), b(e, "class", "container svelte-re7f2i"), Y(e, "orange", t[0].primaryTeam == 0), Y(e, "blue", t[0].primaryTeam == 1);
  }, m(L, B) {
    k(L, e, B), h(e, n), h(n, i), h(i, r), h(i, o), h(i, l), h(n, a), h(n, c), h(c, f), h(f, _), h(c, g), h(c, d), h(n, m), h(n, $), h($, u), h(u, x), h($, C), h($, O), h(e, V), h(e, S), h(S, E), h(E, N), h(N, Ot), h(N, Wt), h(E, Jt), h(E, Ft), h(E, Qt), h(E, ft), h(S, Xt), h(S, U), h(U, nt), h(nt, Rt), h(nt, Yt), h(U, Zt), h(U, At), h(U, te), h(U, dt), h(S, ee), h(S, G), h(G, it), h(it, Tt), h(it, ne), h(G, ie), h(G, Bt), h(G, se), h(G, mt), F = true;
  }, p(L, B) {
    (!F || B & 1) && s !== (s = L[0].points + "") && A(r, s), (!F || B & 1) && p !== (p = L[0].primaryPlayer + "") && A(_, p), (!F || B & 1) && y !== (y = L[0].secondaryPlayer + "") && A(x, y), (!F || B & 1) && I !== (I = L[0].speed.toFixed(1) + "") && A(Ot, I), (!F || B & 1) && ut !== (ut = L[0].distance.toFixed(1) + "") && A(Rt, ut), (!F || B & 1) && pt !== (pt = L[0].scoreTime.toFixed(0) + "") && A(Tt, pt), (!F || B & 1) && Y(e, "orange", L[0].primaryTeam == 0), (!F || B & 1) && Y(e, "blue", L[0].primaryTeam == 1);
  }, i(L) {
    F || (L && q(() => {
      F && (H || (H = kt(e, J, {y: -50, opacity: 0}, true)), H.run(1));
    }), F = true);
  }, o(L) {
    L && (H || (H = kt(e, J, {y: -50, opacity: 0}, false)), H.run(0)), F = false;
  }, d(L) {
    L && w(e), L && H && H.end();
  }};
}
function ln(t) {
  let e, n = t[0] && ce(t);
  return {c() {
    n && n.c(), e = document.createTextNode("");
  }, m(i, s) {
    n && n.m(i, s), k(i, e, s);
  }, p(i, [s]) {
    i[0] ? n ? (n.p(i, s), s & 1 && R(n, 1)) : (n = ce(i), n.c(), R(n, 1), n.m(e.parentNode, e)) : n && (Gt(), z(n, 1, 1, () => {
      n = null;
    }), Ht());
  }, i(i) {
    R(n);
  }, o(i) {
    z(n);
  }, d(i) {
    i && w(e), n && n.d(i);
  }};
}
function on(t, e, n) {
  let i = null;
  return rt("goal", s => {
    n(0, i = s), setTimeout(() => {
      n(0, i = null);
    }, 3e3);
  }), ke(() => {
    Me("goal");
  }), [i];
}
class an extends Nt {
  constructor(e) {
    super(), Lt(this, e, on, ln, Pt, {});
  }
}
function yt(t, e = false) {
  const n = e ? 1 : 255;
  let i = (Math.round(t.r * n) | 256).toString(16).slice(1) + (Math.round(t.g * n) | 256).toString(16).slice(1) + (Math.round(t.b * n) | 256).toString(16).slice(1), s = (t.a * n | 256).toString(16).slice(1);
  return i = i + s, `#${i}`;
}
function cn(t, {from: e, to: n}, i = {}) {
  const s = getComputedStyle(t), r = s.transform === "none" ? "" : s.transform, [o, l] = s.transformOrigin.split(" ").map(parseFloat), a = e.left + e.width * o / n.width - (n.left + o), c = e.top + e.height * l / n.height - (n.top + l), {delay: f = 0, duration: p = g => Math.sqrt(g) * 120, easing: _ = xe} = i;
  return {delay: f, duration: typeof p == "function" ? p(Math.sqrt(a * a + c * c)) : p, easing: _, css: (g, d) => {
    const m = d * a, $ = d * c, u = g + d * e.width / n.width, y = g + d * e.height / n.height;
    return `transform: ${r} translate(${m}px, ${$}px) scale(${u}, ${y});`;
  }};
}
function fe(t, e, n) {
  const i = t.slice();
  return i[6] = e[n], i;
}
function ue(t) {
  let e;
  function n(r, o) {
    return r[6].isSpectator ? un : fn;
  }
  let i = n(t), s = i(t);
  return {c() {
    s.c(), e = document.createTextNode("");
  }, m(r, o) {
    s.m(r, o), k(r, e, o);
  }, p(r, o) {
    i === (i = n(r)) && s ? s.p(r, o) : (s.d(1), s = i(r), s && (s.c(), s.m(e.parentNode, e)));
  }, d(r) {
    r && w(e), s.d(r);
  }};
}
function fn(t) {
  let e;
  return {c() {
    e = document.createElement("div"), b(e, "class", "player-colors svelte-1fgkmso"), ht(e, "border-color", yt(t[6].secondaryColor)), ht(e, "background-color", yt(t[6].primaryColor));
  }, m(n, i) {
    k(n, e, i);
  }, p(n, i) {
    i & 2 && ht(e, "border-color", yt(n[6].secondaryColor)), i & 2 && ht(e, "background-color", yt(n[6].primaryColor));
  }, d(n) {
    n && w(e);
  }};
}
function un(t) {
  let e, n;
  return {c() {
    e = document.createElement("img"), b(e, "class", "team-logo svelte-1fgkmso"), Ee(e.src, n = "/ui/img/faceFaceWhite.png") || b(e, "src", n), b(e, "alt", "");
  }, m(i, s) {
    k(i, e, s);
  }, p: M, d(i) {
    i && w(e);
  }};
}
function de(t, e) {
  let n, i, s, r = e[6].name + "", o, l, a, c = M, f = e[0] && ue(e);
  return {key: t, first: null, c() {
    n = document.createElement("div"), f && f.c(), i = document.createTextNode(" "), s = document.createElement("p"), o = document.createTextNode(r), l = document.createTextNode(" "), b(s, "class", "svelte-1fgkmso"), b(n, "class", "player svelte-1fgkmso"), Y(n, "spectator", e[6].isSpectator), this.first = n;
  }, m(p, _) {
    k(p, n, _), f && f.m(n, null), h(n, i), h(n, s), h(s, o), h(n, l);
  }, p(p, _) {
    e = p, e[0] ? f ? f.p(e, _) : (f = ue(e), f.c(), f.m(n, i)) : f && (f.d(1), f = null), _ & 2 && r !== (r = e[6].name + "") && A(o, r), _ & 2 && Y(n, "spectator", e[6].isSpectator);
  }, r() {
    a = n.getBoundingClientRect();
  }, f() {
    Ie(n), c();
  }, a() {
    c(), c = qe(n, a, cn, {duration: 400});
  }, d(p) {
    p && w(n), f && f.d();
  }};
}
function dn(t) {
  let e, n = [], i = new Map, s, r = Ct(t[1]);
  const o = l => l[6].name;
  for (let l = 0; l < r.length; l += 1) {
    let a = fe(t, r, l), c = o(a);
    i.set(c, n[l] = de(c, a));
  }
  return {c() {
    e = document.createElement("div");
    for (let l = 0; l < n.length; l += 1) n[l].c();
    b(e, "class", "container svelte-1fgkmso");
  }, m(l, a) {
    k(l, e, a);
    for (let c = 0; c < n.length; c += 1) n[c] && n[c].m(e, null);
  }, p(l, [a]) {
    if (a & 3) {
      r = Ct(l[1]);
      for (let c = 0; c < n.length; c += 1) n[c].r();
      n = Xe(n, a, o, 1, l, r, i, e, Qe, de, null, fe);
      for (let c = 0; c < n.length; c += 1) n[c].a();
    }
  }, i(l) {
    l && (s || q(() => {
      s = Se(e, J, {x: 200, duration: 1e3}), s.start();
    }));
  }, o: M, d(l) {
    l && w(e);
    for (let a = 0; a < n.length; a += 1) n[a].d();
  }};
}
function pn(t, e, n) {
  let {players: i} = e, {localPlayerData: s} = e, r = i.sort((c, f) => {
    const p = Math.sqrt(Math.pow(c.position.x - s.position.x, 2) + Math.pow(c.position.y - s.position.y, 2) + Math.pow(c.position.z - s.position.z, 2)), _ = Math.sqrt(Math.pow(f.position.x - s.position.x, 2) + Math.pow(f.position.y - s.position.y, 2) + Math.pow(f.position.z - s.position.z, 2));
    return p - _;
  }), {showTeamLogos: o = true} = e, l = (new Date).getTime();
  function a(c) {
    const f = (new Date).getTime();
    f - l > 1e3 && (n(1, r = c.sort((p, _) => {
      const g = Math.sqrt(Math.pow(p.position.x - s.position.x, 2) + Math.pow(p.position.y - s.position.y, 2) + Math.pow(p.position.z - s.position.z, 2)), d = Math.sqrt(Math.pow(_.position.x - s.position.x, 2) + Math.pow(_.position.y - s.position.y, 2) + Math.pow(_.position.z - s.position.z, 2));
      return g - d;
    })), l = f);
  }
  return t.$$set = c => {
    "players" in c && n(2, i = c.players), "localPlayerData" in c && n(3, s = c.localPlayerData), "showTeamLogos" in c && n(0, o = c.showTeamLogos);
  }, t.$$.update = () => {
    t.$$.dirty & 4 && a(i);
  }, [o, r, i, s];
}
class mn extends Nt {
  constructor(e) {
    super(), Lt(this, e, pn, dn, Pt, {players: 2, localPlayerData: 3, showTeamLogos: 0});
  }
}
function pe(t, e, n) {
  const i = t.slice();
  return i[10] = e[n], i;
}
function _n(t) {
  let e;
  return {c() {
    e = document.createTextNode("unkown error");
  }, m(n, i) {
    k(n, e, i);
  }, p: M, i: M, o: M, d(n) {
    n && w(e);
  }};
}
function hn(t) {
  let e;
  return {c() {
    e = document.createElement("br");
  }, m(n, i) {
    k(n, e, i);
  }, p: M, i: M, o: M, d(n) {
    n && w(e);
  }};
}
function gn(t) {
  let e, n;
  return {c() {
    e = document.createTextNode("no frame: "), n = document.createTextNode(t[0]);
  }, m(i, s) {
    k(i, e, s), k(i, n, s);
  }, p(i, s) {
    s & 1 && A(n, i[0]);
  }, i: M, o: M, d(i) {
    i && (w(e), w(n));
  }};
}
function yn(t) {
  let e, n;
  return {c() {
    e = document.createTextNode("no player: "), n = document.createTextNode(t[1]);
  }, m(i, s) {
    k(i, e, s), k(i, n, s);
  }, p(i, s) {
    s & 2 && A(n, i[1]);
  }, i: M, o: M, d(i) {
    i && (w(e), w(n));
  }};
}
function vn(t) {
  let e, n, i, s, r, o;
  return {c() {
    e = document.createTextNode("no frame: "), n = document.createTextNode(t[0]), i = document.createTextNode(" "), s = document.createElement("br"), r = document.createTextNode(`
		no player: `), o = document.createTextNode(t[1]);
  }, m(l, a) {
    k(l, e, a), k(l, n, a), k(l, i, a), k(l, s, a), k(l, r, a), k(l, o, a);
  }, p(l, a) {
    a & 1 && A(n, l[0]), a & 2 && A(o, l[1]);
  }, i: M, o: M, d(l) {
    l && (w(e), w(n), w(i), w(s), w(r), w(o));
  }};
}
function $n(t) {
  let e, n, i, s, r, o, l, a, c, f, p, _, g;
  s = new an({}), f = new mn({props: {players: [...t[0].players.map(_e), ...t[0].spectators.map(he)], localPlayerData: t[1]}});
  let d = Ct(t[3]), m = [];
  for (let u = 0; u < d.length; u += 1) m[u] = me(pe(t, d, u));
  const $ = u => z(m[u], 1, 1, () => {
    m[u] = null;
  });
  return {c() {
    e = document.createTextNode(" "), n = document.createElement("div"), i = document.createElement("div"), zt(s.$$.fragment), o = document.createTextNode(" "), l = document.createElement("div"), l.innerHTML = "", a = document.createTextNode(" "), c = document.createElement("div"), zt(f.$$.fragment), p = document.createTextNode(" "), _ = document.createElement("div");
    for (let u = 0; u < m.length; u += 1) m[u].c();
    b(i, "class", "goal-banner svelte-vi4svy"), b(n, "class", "main-bar-container svelte-vi4svy"), b(l, "class", "minimap svelte-vi4svy"), b(c, "class", "roster-all svelte-vi4svy"), b(_, "class", "event-list svelte-vi4svy");
  }, m(u, y) {
    k(u, e, y), k(u, n, y), h(n, i), St(s, i, null), k(u, o, y), k(u, l, y), k(u, a, y), k(u, c, y), St(f, c, null), k(u, p, y), k(u, _, y);
    for (let x = 0; x < m.length; x += 1) m[x] && m[x].m(_, null);
    g = true;
  }, p(u, y) {
    const x = {};
    if (y & 1 && (x.players = [...u[0].players.map(_e), ...u[0].spectators.map(he)]), y & 2 && (x.localPlayerData = u[1]), f.$set(x), y & 8) {
      d = Ct(u[3]);
      let C;
      for (C = 0; C < d.length; C += 1) {
        const O = pe(u, d, C);
        m[C] ? (m[C].p(O, y), R(m[C], 1)) : (m[C] = me(O), m[C].c(), R(m[C], 1), m[C].m(_, null));
      }
      for (Gt(), C = d.length; C < m.length; C += 1) $(C);
      Ht();
    }
  }, i(u) {
    if (!g) {
      R(s.$$.fragment, u), u && q(() => {
        g && (r || (r = kt(n, J, {duration: 1e3, y: -100}, true)), r.run(1));
      }), R(f.$$.fragment, u);
      for (let y = 0; y < d.length; y += 1) R(m[y]);
      g = true;
    }
  }, o(u) {
    z(s.$$.fragment, u), u && (r || (r = kt(n, J, {duration: 1e3, y: -100}, false)), r.run(0)), z(f.$$.fragment, u), m = m.filter(Boolean);
    for (let y = 0; y < m.length; y += 1) z(m[y]);
    g = false;
  }, d(u) {
    u && (w(e), w(n), w(o), w(l), w(a), w(c), w(p), w(_)), xt(s), u && r && r.end(), xt(f), Fe(m, u);
  }};
}
function me(t) {
  let e, n;
  return e = new nn({props: {text: t[10]}}), {c() {
    zt(e.$$.fragment);
  }, m(i, s) {
    St(e, i, s), n = true;
  }, p(i, s) {
    const r = {};
    s & 8 && (r.text = i[10]), e.$set(r);
  }, i(i) {
    n || (R(e.$$.fragment, i), n = true);
  }, o(i) {
    z(e.$$.fragment, i), n = false;
  }, d(i) {
    xt(e, i);
  }};
}
function bn(t) {
  let e, n, i, s;
  const r = [$n, vn, yn, gn, hn, _n], o = [];
  function l(a, c) {
    return !a[2] && a[0] && a[1] ? 0 : !a[1] && !a[0] ? 1 : a[1] ? a[0] ? a[2] ? 4 : 5 : 3 : 2;
  }
  return n = l(t), i = o[n] = r[n](t), {c() {
    e = document.createElement("main"), i.c();
  }, m(a, c) {
    k(a, e, c), o[n].m(e, null), s = true;
  }, p(a, [c]) {
    let f = n;
    n = l(a), n === f ? o[n].p(a, c) : (Gt(), z(o[f], 1, 1, () => {
      o[f] = null;
    }), Ht(), i = o[n], i ? i.p(a, c) : (i = o[n] = r[n](a), i.c()), R(i, 1), i.m(e, null));
  }, i(a) {
    s || (R(i), s = true);
  }, o(a) {
    z(i), s = false;
  }, d(a) {
    a && w(e), o[n].d();
  }};
}
const _e = t => ({name: t.playerName, position: t.head.position, primaryColor: t.cosmeticMaterialMetadata.maskColor1, secondaryColor: t.cosmeticMaterialMetadata.maskColor2, isSpectator: false}), he = t => ({name: t.playerName, position: t.transform.position, primaryColor: {r: 0, g: 0, b: 0, a: 0}, secondaryColor: {r: 0, g: 0, b: 0, a: 0}, isSpectator: true});
function wn(t, e, n) {
  let i = null, s = null, r = null, o = false, l;
  l = setInterval(() => {
    sn("http://127.0.0.1:5420", {useLastReplay: true});
  }, 1e3), rn().then(f => {}), rt("camera_mode_changed", () => {
    n(3, a), setTimeout(() => {
      a.pop(), n(3, a);
    }, 1e3);
  }), rt("frame", f => {
    i = f, n(2, o = false);
  }), rt("local_player_data", f => {
    n(1, r = f);
  }), rt("hide", f => {
    n(2, o = f);
  }), Ve(() => {}), ke(() => {
    Me(), clearInterval(l);
  });
  let a = [];
  function c(f) {
    n(0, s = i), requestAnimationFrame(c);
  }
  return requestAnimationFrame(c), [s, r, o, a];
}
class kn extends Nt {
  constructor(e) {
    super(), Lt(this, e, wn, bn, Pt, {});
  }
}
const Cn = document.getElementById("app");
new kn({target: Cn});
