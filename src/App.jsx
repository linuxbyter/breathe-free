import { useState, useEffect, useRef } from "react";

/* ─── STYLES ──────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f5f2ec; --surface: #ffffff; --green: #1a5c3a; --green-light: #2d8a58;
    --green-pale: #e8f4ee; --amber: #c47c2b; --red: #b03a2e; --text: #1a1a1a;
    --muted: #6b6b6b; --border: #e0dbd0; --shadow: 0 2px 12px rgba(0,0,0,0.07);
  }
  [data-theme="dark"] {
    --bg: #0e1a12; --surface: #162418; --green: #4ade80; --green-light: #6bec98;
    --green-pale: #1a2e20; --amber: #f0a84e; --red: #f87171; --text: #e8efe9;
    --muted: #7aad85; --border: #243328; --shadow: 0 2px 12px rgba(0,0,0,0.3);
  }

  html { cursor: default; }
  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); transition: background 0.3s, color 0.3s; -webkit-font-smoothing: antialiased; }

  /* prevent browser text-cursor on non-input elements */
  div, span, p, h1, h2, h3, h4, li, td, th, label { cursor: default; user-select: none; -webkit-user-select: none; }
  input, textarea { cursor: text; user-select: text; -webkit-user-select: text; }
  button, a, [role="button"] { cursor: pointer !important; }
  a { text-decoration: none; color: inherit; }

  .app { min-height: 100vh; max-width: 920px; margin: 0 auto; padding: 0 16px 80px; }

  /* NAV */
  .nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 0 16px; border-bottom: 1px solid var(--border); margin-bottom: 28px; flex-wrap: wrap; gap: 10px; }
  .logo { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: var(--green); letter-spacing: -0.5px; }
  .logo em { color: var(--amber); font-style: italic; }
  .dark-toggle { background: var(--green-pale); border: 1px solid var(--border); border-radius: 20px; padding: 6px 12px; font-size: 0.8rem; color: var(--text); font-family: 'DM Sans', sans-serif; }
  .tabs { display: flex; gap: 3px; background: var(--border); border-radius: 10px; padding: 4px; flex-wrap: wrap; }
  .tab { padding: 7px 11px; border-radius: 7px; border: none; background: none; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500; color: var(--muted); white-space: nowrap; transition: all 0.15s; }
  .tab.active { background: var(--surface); color: var(--green); box-shadow: var(--shadow); }

  /* CARDS */
  .card { background: var(--surface); border-radius: 16px; padding: 24px; border: 1px solid var(--border); margin-bottom: 16px; box-shadow: var(--shadow); }
  .card-title { font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: var(--green); margin-bottom: 4px; }
  .card-sub { font-size: 0.82rem; color: var(--muted); margin-bottom: 18px; }

  /* ONBOARDING */
  .onboard-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .onboard-card { background: var(--surface); border-radius: 20px; padding: 36px 28px; max-width: 480px; width: 100%; border: 1px solid var(--border); box-shadow: var(--shadow); }
  .onboard-prog { display: flex; gap: 6px; margin-bottom: 24px; }
  .onboard-dot { height: 4px; flex: 1; border-radius: 2px; background: var(--border); transition: background 0.3s; }
  .onboard-dot.done { background: var(--green); }
  .onboard-step { font-size: 0.75rem; color: var(--muted); margin-bottom: 8px; letter-spacing: 1px; text-transform: uppercase; }
  .onboard-q { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: var(--green); margin-bottom: 24px; line-height: 1.3; }
  .onboard-opts { display: flex; flex-direction: column; gap: 10px; }
  .onboard-opt { padding: 13px 18px; border: 1.5px solid var(--border); border-radius: 12px; background: var(--bg); font-family: 'DM Sans', sans-serif; font-size: 0.9rem; text-align: left; color: var(--text); transition: all 0.15s; }
  .onboard-opt:hover { border-color: var(--green); }
  .onboard-opt.sel { border-color: var(--green); background: var(--green-pale); color: var(--green); font-weight: 600; }

  /* STATS */
  .stat-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin-bottom: 20px; }
  .stat-box { background: var(--green-pale); border-radius: 12px; padding: 18px; text-align: center; }
  .stat-num { font-family: 'DM Serif Display', serif; font-size: 2.2rem; color: var(--green); line-height: 1; }
  .stat-lbl { font-size: 0.75rem; color: var(--muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* MILESTONES */
  .milestone { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); align-items: flex-start; }
  .milestone:last-child { border-bottom: none; }
  .ms-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border); flex-shrink: 0; margin-top: 5px; transition: background 0.4s; }
  .ms-dot.done { background: var(--green-light); }
  .ms-time { font-size: 0.78rem; color: var(--amber); font-weight: 600; margin-bottom: 2px; }
  .ms-text { font-size: 0.85rem; color: var(--text); }

  /* LUNG */
  .lung-wrap { display: flex; flex-direction: column; align-items: center; padding: 16px 0; }
  .lung-pct { font-family: 'DM Serif Display', serif; font-size: 1.3rem; color: var(--green); margin-top: 8px; }
  .lung-lbl { font-size: 0.78rem; color: var(--muted); margin-top: 4px; text-align: center; }

  /* CRAVING */
  .craving-box { background: var(--green-pale); border-radius: 14px; padding: 20px; margin-bottom: 16px; text-align: center; border: 1px solid var(--border); }
  .craving-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; color: var(--text); }
  .craving-cd { font-family: 'DM Serif Display', serif; font-size: 3rem; color: var(--green); line-height: 1; margin: 8px 0; }
  .craving-msg { font-size: 0.82rem; color: var(--muted); margin-bottom: 14px; line-height: 1.6; }
  .craving-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin-bottom: 14px; }
  .craving-fill { height: 100%; background: var(--green); border-radius: 3px; transition: width 1s linear; }

  /* STREAK */
  .streak-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .streak-num { font-weight: 700; font-size: 1.1rem; color: var(--green); }
  .streak-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 5px; margin-bottom: 10px; }
  .s-day { aspect-ratio: 1; border-radius: 4px; background: var(--border); transition: background 0.3s; }
  .s-day.on { background: var(--green); }
  .s-day.today { outline: 2px solid var(--amber); outline-offset: 2px; }
  .streak-legend { display: flex; gap: 14px; font-size: 0.74rem; color: var(--muted); align-items: center; }
  .legend-dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; margin-right: 4px; }

  /* SHARE */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; }
  .share-card { background: linear-gradient(135deg, #1a5c3a 0%, #0d3d26 100%); border-radius: 20px; padding: 32px 28px; max-width: 360px; width: 100%; color: white; text-align: center; position: relative; }
  .share-close { position: absolute; top: 14px; right: 16px; background: none; border: none; color: rgba(255,255,255,0.6); font-size: 1.2rem; }
  .share-logo { font-family: 'DM Serif Display', serif; font-size: 1rem; opacity: 0.6; margin-bottom: 16px; }
  .share-days { font-family: 'DM Serif Display', serif; font-size: 4.5rem; line-height: 1; }
  .share-days-lbl { font-size: 0.85rem; opacity: 0.7; margin-bottom: 18px; }
  .share-stats { display: flex; gap: 20px; justify-content: center; margin-bottom: 18px; }
  .share-stat-n { font-weight: 700; font-size: 1.2rem; }
  .share-stat-l { font-size: 0.7rem; opacity: 0.6; }
  .share-tag { font-size: 0.72rem; opacity: 0.45; }
  .share-hint { color: rgba(255,255,255,0.75); font-size: 0.78rem; text-align: center; margin-top: 10px; }

  /* BUTTONS */
  .btn { display: inline-flex; align-items: center; gap: 6px; background: var(--green); color: white; border: none; padding: 11px 20px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500; transition: opacity 0.15s; }
  .btn:hover { opacity: 0.88; }
  .btn-amber { background: var(--amber); }
  .btn-red { background: var(--red); }
  .btn-outline { background: none; border: 1px solid var(--border); color: var(--muted); }
  .btn-outline:hover { background: var(--bg); }
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .btn[disabled] { opacity: 0.45; pointer-events: none; }

  /* INPUTS */
  .input { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; background: var(--bg); color: var(--text); outline: none; }
  .input:focus { border-color: var(--green); }
  .input-row { display: flex; gap: 8px; margin-bottom: 14px; }
  .input-row .input { margin-bottom: 0; }

  /* TABS CONTENT */
  /* Community banner */
  .comm-banner { background: linear-gradient(135deg, #1a5c3a, #0d3d26); border-radius: 16px; padding: 28px 24px; color: white; position: relative; overflow: hidden; margin-bottom: 16px; }
  .comm-banner::after { content: '◉'; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 7rem; opacity: 0.06; }
  .comm-tag { font-size: 0.7rem; background: rgba(255,255,255,0.15); padding: 3px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px; letter-spacing: 1px; text-transform: uppercase; }
  .comm-title { font-family: 'DM Serif Display', serif; font-size: 1.8rem; margin-bottom: 8px; }
  .comm-sub { font-size: 0.84rem; opacity: 0.72; line-height: 1.65; max-width: 500px; }

  .act-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px,1fr)); gap: 12px; }
  .act-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
  .act-icon { font-size: 1.5rem; margin-bottom: 8px; }
  .act-name { font-weight: 600; font-size: 0.88rem; color: var(--text); margin-bottom: 4px; }
  .act-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.55; }
  .act-n { font-size: 0.72rem; color: var(--green); font-weight: 600; margin-top: 8px; }

  /* Real communities */
  .comm-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .comm-row:last-child { border-bottom: none; }
  .comm-platform { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
  .comm-info { flex: 1; }
  .comm-name { font-weight: 600; font-size: 0.88rem; color: var(--text); margin-bottom: 2px; }
  .comm-meta { font-size: 0.75rem; color: var(--muted); }
  .comm-members { font-size: 0.72rem; color: var(--green); font-weight: 600; }
  .ext-link { font-size: 0.78rem; background: var(--green-pale); color: var(--green); border: none; padding: 6px 12px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-weight: 500; flex-shrink: 0; }

  /* Research */
  .brand-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(255px,1fr)); gap: 14px; }
  .brand-card { border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .brand-hdr { padding: 13px 16px; background: var(--green-pale); display: flex; align-items: center; justify-content: space-between; }
  .brand-name { font-weight: 600; font-size: 0.92rem; color: var(--green); }
  .brand-type { font-size: 0.7rem; background: var(--green); color: white; padding: 3px 8px; border-radius: 20px; }
  .brand-body { padding: 13px 16px; }
  .ing-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed var(--border); font-size: 0.81rem; }
  .ing-row:last-child { border-bottom: none; }
  .ing-lbl { color: var(--muted); }
  .ing-val { font-weight: 600; color: var(--text); text-align: right; max-width: 55%; }
  .risk-badge { display: inline-block; font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; font-weight: 600; margin-top: 10px; }
  .risk-h { background: #fdecea; color: var(--red); }
  .risk-m { background: #fef3e2; color: var(--amber); }
  .filter-row { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
  .f-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); font-size: 0.8rem; font-family: 'DM Sans', sans-serif; color: var(--text); }
  .f-btn.active { background: var(--green); color: white; border-color: var(--green); }
  .chem-table { width: 100%; border-collapse: collapse; font-size: 0.81rem; }
  .chem-table th { background: var(--green); color: white; padding: 9px 12px; text-align: left; }
  .chem-table td { padding: 8px 12px; border-bottom: 1px solid var(--border); vertical-align: top; color: var(--muted); }
  .chem-table tr:nth-child(even) td { background: var(--bg); }
  .chem-cat { font-size: 0.7rem; background: var(--green-pale); color: var(--green); padding: 2px 7px; border-radius: 10px; font-weight: 600; }

  /* SAVINGS */
  .save-hero { background: linear-gradient(135deg, #1a5c3a, #0d3d26); border-radius: 16px; padding: 28px 24px; color: white; margin-bottom: 16px; }
  .save-hero-title { font-family: 'DM Serif Display', serif; font-size: 1.5rem; margin-bottom: 6px; }
  .save-hero-sub { font-size: 0.84rem; opacity: 0.72; margin-bottom: 18px; line-height: 1.6; }
  .save-amount { font-family: 'DM Serif Display', serif; font-size: 3.5rem; line-height: 1; }
  .save-amount-lbl { font-size: 0.8rem; opacity: 0.65; margin-bottom: 20px; }

  .goal-card { border: 1px solid var(--border); border-radius: 14px; padding: 18px; margin-bottom: 12px; }
  .goal-name { font-weight: 600; font-size: 0.92rem; color: var(--text); margin-bottom: 4px; }
  .goal-meta { font-size: 0.78rem; color: var(--muted); margin-bottom: 10px; }
  .goal-bar-wrap { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
  .goal-bar { height: 100%; background: var(--green); border-radius: 4px; transition: width 0.6s ease; }
  .goal-pct { font-size: 0.78rem; color: var(--green); font-weight: 600; }

  .chumz-card { background: #fff8f0; border: 1.5px solid var(--amber); border-radius: 14px; padding: 20px; }
  .chumz-logo { font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: var(--amber); margin-bottom: 6px; }
  .chumz-desc { font-size: 0.84rem; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }
  .chumz-features { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .chumz-feat { font-size: 0.75rem; border: 1px solid var(--border); border-radius: 20px; padding: 4px 10px; color: var(--muted); }
  .alt-savers { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
  .alt-card { border: 1px solid var(--border); border-radius: 10px; padding: 12px; }
  .alt-name { font-weight: 600; font-size: 0.82rem; margin-bottom: 4px; color: var(--text); }
  .alt-info { font-size: 0.75rem; color: var(--muted); line-height: 1.5; }

  /* BLOG */
  .blog-row { display: flex; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--border); }
  .blog-row:last-child { border-bottom: none; }
  .blog-n { font-family: 'DM Serif Display', serif; font-size: 2rem; color: var(--border); min-width: 36px; line-height: 1; }
  .blog-tag { font-size: 0.7rem; color: var(--amber); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .blog-title { font-weight: 600; font-size: 0.9rem; color: var(--text); margin-bottom: 6px; }
  .blog-ex { font-size: 0.81rem; color: var(--muted); line-height: 1.55; }
  .blog-meta { font-size: 0.72rem; color: var(--muted); margin-top: 8px; }

  /* ABOUT */
  .a-section { margin-bottom: 24px; }
  .a-section h3 { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--green); margin-bottom: 8px; }
  .a-section p { font-size: 0.88rem; color: var(--muted); line-height: 1.65; }
  .team-card { display: flex; gap: 14px; align-items: center; padding: 16px; background: var(--green-pale); border-radius: 12px; margin-bottom: 10px; }
  .team-av { width: 44px; height: 44px; border-radius: 50%; background: var(--green); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1rem; flex-shrink: 0; }
  .team-name { font-weight: 600; font-size: 0.9rem; color: var(--text); }
  .team-role { font-size: 0.78rem; color: var(--muted); }
  .fund-card { border: 1px solid var(--amber); border-radius: 14px; padding: 20px; background: var(--bg); }
  .fund-lbl { font-size: 0.72rem; color: var(--amber); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .fund-title { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--text); margin-bottom: 8px; }
  .fund-text { font-size: 0.84rem; color: var(--muted); line-height: 1.65; }
  .inv-badges { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
  .inv-badge { font-size: 0.74rem; border: 1px solid var(--border); border-radius: 8px; padding: 5px 12px; color: var(--muted); font-weight: 500; }

  .waitlist-box { background: linear-gradient(135deg, #1a5c3a, #0d3d26); border-radius: 16px; padding: 28px 24px; color: white; margin-bottom: 16px; }
  .wl-title { font-family: 'DM Serif Display', serif; font-size: 1.4rem; margin-bottom: 8px; }
  .wl-sub { font-size: 0.84rem; opacity: 0.72; margin-bottom: 10px; }
  .wl-count { font-size: 0.82rem; opacity: 0.6; margin-bottom: 16px; }
  .wl-count strong { opacity: 1; }
  .wl-form { display: flex; gap: 8px; }
  .wl-input { flex: 1; padding: 10px 14px; border-radius: 10px; border: none; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; background: rgba(255,255,255,0.15); color: white; outline: none; cursor: text; }
  .wl-input::placeholder { color: rgba(255,255,255,0.45); }
  .wl-btn { background: var(--amber); color: white; border: none; padding: 10px 18px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.85rem; white-space: nowrap; }
  .wl-done { font-size: 0.88rem; background: rgba(255,255,255,0.12); border-radius: 10px; padding: 12px 16px; }

  .notif-bar { background: var(--green-pale); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border: 1px solid var(--border); margin-bottom: 16px; }

  @media (max-width: 600px) {
    .tab { padding: 6px 8px; font-size: 0.72rem; }
    .stat-num { font-size: 1.8rem; }
    .comm-title { font-size: 1.4rem; }
    .wl-form { flex-direction: column; }
    .alt-savers { grid-template-columns: 1fr; }
  }
`;

/* ─── DATA ────────────────────────────────────────────────────────────────── */
const BRANDS = [
  { name:"Marlboro Red", type:"Regular", nicotine:"1.2 mg", tar:"12 mg", co:"13 mg", flavor:"None (Full flavour)", risk:"h", origin:"USA / Phillip Morris" },
  { name:"Camel Filters", type:"Regular", nicotine:"1.1 mg", tar:"11 mg", co:"12 mg", flavor:"None", risk:"h", origin:"USA / R.J. Reynolds" },
  { name:"Dunhill Fine Cut", type:"Regular", nicotine:"0.8 mg", tar:"8 mg", co:"9 mg", flavor:"None", risk:"h", origin:"UK / BAT" },
  { name:"Café Crème", type:"Flavoured (Coffee)", nicotine:"0.6 mg", tar:"6 mg", co:"7 mg", flavor:"Coffee / Vanilla extract", risk:"m", origin:"Switzerland / Villiger" },
  { name:"Double O", type:"Flavoured", nicotine:"0.7 mg", tar:"7 mg", co:"8 mg", flavor:"Menthol / Fruit blend", risk:"m", origin:"Kenya / BAT Kenya" },
  { name:"Supermatch Menthol", type:"Menthol", nicotine:"0.6 mg", tar:"6 mg", co:"7 mg", flavor:"Menthol (L-Menthol 0.3%)", risk:"m", origin:"Kenya / BAT Kenya" },
];

const CHEMICALS = [
  { name:"Nicotine", cat:"Alkaloid", effect:"Primary addictive agent. Stimulates dopamine release, creating dependency." },
  { name:"Tar", cat:"Particulate", effect:"Collective term for toxic particles. Coats lung tissue, causes cancer." },
  { name:"Carbon Monoxide", cat:"Gas", effect:"Reduces blood oxygen capacity. Linked to heart disease." },
  { name:"Formaldehyde", cat:"Aldehyde", effect:"Known carcinogen produced during combustion of tobacco." },
  { name:"Benzene", cat:"Aromatic", effect:"Linked to leukemia. Present in tobacco smoke." },
  { name:"Ammonia", cat:"Additive", effect:"Added to increase nicotine absorption speed and intensity." },
  { name:"L-Menthol", cat:"Flavourant", effect:"Creates cooling sensation. Masks harshness, increases inhalation depth." },
  { name:"Propylene Glycol", cat:"Humectant", effect:"Keeps tobacco moist. Also found in e-cigarettes." },
  { name:"Coumarin", cat:"Flavourant", effect:"Sweet/vanilla-like scent. Banned in food; still found in some tobaccos." },
  { name:"Acrolein", cat:"Gas", effect:"Irritates respiratory tract. Damages cilia in lungs." },
];

const MILESTONES = [
  { time:"20 minutes", body:"Heart rate drops to normal level", h:0.33 },
  { time:"8 hours", body:"Carbon monoxide in blood drops by half", h:8 },
  { time:"24 hours", body:"Heart attack risk begins to decrease", h:24 },
  { time:"48 hours", body:"Nerve endings regrow; taste and smell improve", h:48 },
  { time:"72 hours", body:"Bronchial tubes relax; breathing becomes easier", h:72 },
  { time:"2 weeks", body:"Circulation and lung function improve significantly", h:336 },
  { time:"3 months", body:"Coughing decreases; cilia regrow in lungs", h:2160 },
  { time:"1 year", body:"Heart disease risk is half that of a smoker", h:8760 },
];

const ACTIVITIES = [
  { icon:"🚴", name:"CycleStrong", desc:"Weekly group rides for ex-smokers rebuilding lung endurance", n:"214 members" },
  { icon:"🏃", name:"Morning Strides", desc:"5AM run crews across Nairobi, Mombasa & Kisumu", n:"389 members" },
  { icon:"🧘", name:"Breathwork Sessions", desc:"Guided breathing & mindfulness to manage cravings", n:"156 members" },
  { icon:"🏋️", name:"Iron & Air", desc:"Strength training designed around respiratory recovery", n:"98 members" },
];

const COMMUNITIES = [
  { icon:"💬", platform:"Reddit", color:"#ff4500", bg:"#fff0eb", name:"r/StopSmoking", meta:"The largest quit-smoking community online", members:"590k+ members", url:"https://reddit.com/r/StopSmoking" },
  { icon:"👥", platform:"Facebook", color:"#1877f2", bg:"#eef4ff", name:"Turkeyville", meta:"Cold turkey cessation — one of the oldest groups", members:"10k+ members", url:"https://www.facebook.com/groups/Turkeyville" },
  { icon:"💬", platform:"Reddit", color:"#ff4500", bg:"#fff0eb", name:"r/Quit Smoking", meta:"General quit smoking support — all methods", members:"130k+ members", url:"https://reddit.com/r/quitsmoking" },
  { icon:"🌐", platform:"EX Program", color:"#1a5c3a", bg:"#e8f4ee", name:"BecomeAnEX", meta:"Evidence-based cessation community by Truth Initiative & Mayo Clinic", members:"Free to join", url:"https://www.becomeanex.org" },
  { icon:"📱", platform:"App", color:"#6c5ce7", bg:"#f0eeff", name:"Smoke Free App", meta:"Community + streak tracking + cravings tools", members:"Available on iOS & Android", url:"https://smokefreeapp.com" },
  { icon:"🌐", platform:"WHO / Smokefree", color:"#0077b6", bg:"#e0f2ff", name:"Smokefree.gov", meta:"US Surgeon General quit plans — works globally", members:"Free resources", url:"https://smokefree.gov" },
];

const BLOG_POSTS = [
  { tag:"Science", title:"Why Flavoured Cigarettes Are More Dangerous Than You Think", ex:"Brands like Double O and Café Crème use L-menthol and coffee extracts to reduce the harshness of smoke — leading to deeper inhalation and faster nicotine absorption.", rt:"4 min", date:"Feb 2025" },
  { tag:"Recovery", title:"The 72-Hour Window: What Your Body Goes Through When You Quit", ex:"The first three days are the hardest — and the most transformative. We break down what's happening neurologically as nicotine leaves your system.", rt:"6 min", date:"Jan 2025" },
  { tag:"Lifestyle", title:"How to Use Exercise as a Craving Blocker — A Nairobi Runner's Guide", ex:"A brisk 5-minute walk cuts craving intensity by up to 50%. We spoke to Morning Strides members about building a fitness habit that replaced the cigarette break.", rt:"5 min", date:"Jan 2025" },
  { tag:"Kenya", title:"The Hidden Cost of Smoking: What Your KES Is Actually Buying", ex:"A packet a day costs over KES 36,000 a year. We mapped what that money could do instead — school fees, chama contributions, a savings account.", rt:"3 min", date:"Dec 2024" },
];

const MSGS = [
  "Hold on. This craving will peak and fade in under 10 minutes.",
  "Your brain is asking for dopamine. Give it time — it's relearning.",
  "Breathe slowly. In for 4 counts, hold for 4, out for 4.",
  "One craving at a time. You don't have to quit forever — just the next 10 minutes.",
  "You've survived every craving so far. This one is no different.",
];

const toDay = () => new Date().toISOString().slice(0, 10);
const liveCount = () => 1847 + (Math.floor(Date.now() / 86400000) % 30) * 7;

/* ─── SUB-COMPONENTS ─────────────────────────────────────────────────────── */

function LungViz({ days }) {
  const pct = Math.min(100, Math.round((days / 365) * 100));
  const r = Math.round(180 - 180 * pct / 100);
  const g = Math.round(60 + 140 * pct / 100);
  const fill = `rgb(${r},${g},40)`;
  const op = 0.4 + 0.6 * pct / 100;
  return (
    <div className="lung-wrap">
      <svg width="130" height="105" viewBox="0 0 130 105">
        <ellipse cx="40" cy="58" rx="24" ry="34" fill={fill} opacity={op} />
        <ellipse cx="40" cy="42" rx="13" ry="20" fill={fill} opacity={op * 0.7} />
        <ellipse cx="90" cy="58" rx="24" ry="34" fill={fill} opacity={op} />
        <ellipse cx="90" cy="42" rx="13" ry="20" fill={fill} opacity={op * 0.7} />
        <rect x="60" y="10" width="9" height="30" rx="4" fill={fill} opacity={op} />
        <path d="M64 40 Q46 45 40 51" stroke={fill} strokeWidth="4" fill="none" opacity={op} strokeLinecap="round" />
        <path d="M64 40 Q82 45 90 51" stroke={fill} strokeWidth="4" fill="none" opacity={op} strokeLinecap="round" />
      </svg>
      <div className="lung-pct">{pct}% recovered</div>
      <div className="lung-lbl">
        {pct < 15 ? "Healing has begun 🌱" : pct < 40 ? "Lungs clearing — keep going 💪" : pct < 80 ? "Airways reopening — strong progress 🫁" : "Near full recovery 🎉"}
      </div>
    </div>
  );
}

function CravingTimer() {
  const [active, setActive] = useState(false);
  const [secs, setSecs] = useState(600);
  const [msgIdx, setMsgIdx] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (active) {
      ref.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) { clearInterval(ref.current); setActive(false); setDone(true); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(ref.current);
  }, [active]);

  const start = () => { setSecs(600); setDone(false); setMsgIdx(Math.floor(Math.random() * MSGS.length)); setActive(true); };
  const cancel = () => { clearInterval(ref.current); setActive(false); setSecs(600); };
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <div className="craving-box">
      <div className="craving-title">🚨 Craving Alarm</div>
      {!active && !done && (
        <><div className="craving-msg">Feeling a craving? Start the timer. Most cravings pass in under 10 minutes.</div>
        <button className="btn btn-amber" onClick={start}>I Have a Craving</button></>
      )}
      {active && (
        <><div className="craving-cd">{mm}:{ss}</div>
        <div className="craving-bar"><div className="craving-fill" style={{ width: `${((600 - secs) / 600) * 100}%` }} /></div>
        <div className="craving-msg">{MSGS[msgIdx]}</div>
        <button className="btn btn-outline" style={{ padding: "7px 14px", fontSize: "0.78rem" }} onClick={cancel}>Cancel</button></>
      )}
      {done && (
        <><div className="craving-cd" style={{ fontSize: "2rem" }}>✓ Done</div>
        <div className="craving-msg" style={{ fontWeight: 600, color: "var(--green)" }}>You made it through. That craving is gone. 🫁</div>
        <button className="btn" onClick={start}>Another One?</button></>
      )}
    </div>
  );
}

function StreakCalendar({ checkins, onCheck }) {
  const today = toDay();
  const checked = checkins.includes(today);
  const streak = (() => {
    let c = 0; const d = new Date();
    while (true) {
      if (checkins.includes(d.toISOString().slice(0, 10))) { c++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return c;
  })();
  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (34 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div>
      <div className="streak-hdr">
        <div>
          <div className="streak-num">🔥 {streak}-day streak</div>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Check in daily to keep it going</div>
        </div>
        {checked
          ? <span style={{ fontSize: "0.82rem", color: "var(--green)", fontWeight: 600 }}>✓ Checked in today</span>
          : <button className="btn" style={{ padding: "8px 14px", fontSize: "0.82rem" }} onClick={onCheck}>Check In Today</button>
        }
      </div>
      <div className="streak-grid">
        {days.map(d => <div key={d} className={`s-day${checkins.includes(d) ? " on" : ""}${d === today ? " today" : ""}`} title={d} />)}
      </div>
      <div className="streak-legend">
        <span><span className="legend-dot" style={{ background: "var(--green)" }} />Smoke-free</span>
        <span><span className="legend-dot" style={{ background: "var(--border)" }} />Not checked in</span>
        <span style={{ color: "var(--amber)" }}>◻ Today</span>
      </div>
    </div>
  );
}

function ShareCard({ days, cigs, money, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
        <div className="share-card">
          <button className="share-close" onClick={onClose}>✕</button>
          <div className="share-logo">BreatheFree</div>
          <div className="share-days">{days}</div>
          <div className="share-days-lbl">days smoke-free 🫁</div>
          <div className="share-stats">
            <div><div className="share-stat-n">{cigs}</div><div className="share-stat-l">cigarettes avoided</div></div>
            <div><div className="share-stat-n">KES {money}</div><div className="share-stat-l">money saved</div></div>
          </div>
          <div className="share-tag">breathefree.app · Join the movement</div>
        </div>
        <div className="share-hint">📸 Screenshot and share on WhatsApp or Instagram</div>
      </div>
    </div>
  );
}

function Onboarding({ onDone }) {
  const qs = [
    { q: "How many cigarettes were you smoking per day?", opts: ["1–5 (light smoker)", "6–10", "11–20 (a pack)", "More than 20"] },
    { q: "What's your main reason for quitting?", opts: ["My health", "My family / loved ones", "The cost", "I just want to be free"] },
    { q: "What's been your biggest challenge?", opts: ["Cravings after meals", "Stress at work", "Social situations", "Boredom"] },
  ];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sel, setSel] = useState(null);

  const next = () => {
    if (sel === null) return;
    const upd = [...answers, sel];
    if (step < qs.length - 1) { setAnswers(upd); setSel(null); setStep(step + 1); }
    else { localStorage.setItem("bf_onboard", JSON.stringify(upd)); onDone(); }
  };

  return (
    <div className="onboard-wrap">
      <div className="onboard-card">
        <div className="onboard-prog">{qs.map((_, i) => <div key={i} className={`onboard-dot${i <= step ? " done" : ""}`} />)}</div>
        <div className="onboard-step">Step {step + 1} of {qs.length}</div>
        <div className="onboard-q">{qs[step].q}</div>
        <div className="onboard-opts">
          {qs[step].opts.map((o, i) => (
            <button key={i} className={`onboard-opt${sel === i ? " sel" : ""}`} onClick={() => setSel(i)}>{o}</button>
          ))}
        </div>
        <button className="btn" style={{ marginTop: 20, width: "100%", opacity: sel === null ? 0.45 : 1 }} onClick={next} disabled={sel === null}>
          {step < qs.length - 1 ? "Continue →" : "Start My Journey"}
        </button>
      </div>
    </div>
  );
}

function SavingsTab({ moneySaved, days }) {
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem("bf_goals") || "[]"));
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");

  const addGoal = () => {
    if (!newName || !newTarget || isNaN(+newTarget)) return;
    const g = { id: Date.now(), name: newName, target: +newTarget, saved: 0 };
    const upd = [...goals, g];
    setGoals(upd);
    localStorage.setItem("bf_goals", JSON.stringify(upd));
    setNewName(""); setNewTarget("");
  };

  const deposit = (id) => {
    const amt = +moneySaved;
    const upd = goals.map(g => g.id === id ? { ...g, saved: Math.min(g.target, g.saved + amt) } : g);
    setGoals(upd);
    localStorage.setItem("bf_goals", JSON.stringify(upd));
  };

  const removeGoal = (id) => {
    const upd = goals.filter(g => g.id !== id);
    setGoals(upd);
    localStorage.setItem("bf_goals", JSON.stringify(upd));
  };

  return (
    <>
      <div className="save-hero">
        <div className="save-hero-title">Your Cigarette Savings</div>
        <div className="save-hero-sub">Every day you don't smoke, you save money. Here's what you've earned back — and where to put it.</div>
        <div className="save-amount">KES {moneySaved}</div>
        <div className="save-amount-lbl">saved over {days} days (based on ~10 cigarettes/day)</div>
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <a href="https://chumz.io" target="_blank" rel="noreferrer" className="btn btn-amber">Save on Chumz →</a>
          <a href="https://www.kcbgroup.com/personal/save-and-invest/kcb-mpesa" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}>KCB M-Pesa →</a>
        </div>
      </div>

      <div className="card">
        <div className="card-title">My Savings Goals</div>
        <div className="card-sub">Set a goal for your cigarette money — holiday, phone, chama contribution, anything</div>

        <div className="input-row">
          <input className="input" placeholder="Goal name (e.g. New phone)" value={newName} onChange={e => setNewName(e.target.value)} />
          <input className="input" placeholder="Target (KES)" value={newTarget} onChange={e => setNewTarget(e.target.value)} style={{ maxWidth: 150 }} type="number" />
          <button className="btn" onClick={addGoal} style={{ flexShrink: 0 }}>Add</button>
        </div>

        {goals.length === 0 && (
          <div style={{ fontSize: "0.84rem", color: "var(--muted)", padding: "12px 0" }}>No goals yet. Add one above to start tracking your savings.</div>
        )}

        {goals.map(g => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          return (
            <div className="goal-card" key={g.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="goal-name">{g.name}</div>
                  <div className="goal-meta">KES {g.saved.toLocaleString()} of KES {g.target.toLocaleString()}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn" style={{ padding: "5px 10px", fontSize: "0.75rem" }} onClick={() => deposit(g.id)} disabled={+moneySaved <= 0}>
                    + Add savings
                  </button>
                  <button className="btn btn-outline" style={{ padding: "5px 10px", fontSize: "0.75rem" }} onClick={() => removeGoal(g.id)}>✕</button>
                </div>
              </div>
              <div className="goal-bar-wrap"><div className="goal-bar" style={{ width: `${pct}%` }} /></div>
              <div className="goal-pct">{pct}% funded {pct >= 100 ? "🎉 Goal reached!" : ""}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-title">Save with Chumz</div>
        <div className="card-sub">Kenya's top savings app — CMA regulated, M-Pesa linked</div>
        <div className="chumz-card">
          <div className="chumz-logo">Chumz 💰</div>
          <div className="chumz-desc">
            Chumz is Kenya's award-winning savings app backed by Nabo Capital (CMA regulated). Save your cigarette money directly from M-Pesa, earn up to 8% interest per year on locked goals, and join savings challenges like the Mia Kwa Mia 100-day challenge.
          </div>
          <div className="chumz-features">
            <span className="chumz-feat">Save from KES 5</span>
            <span className="chumz-feat">M-Pesa linked</span>
            <span className="chumz-feat">Up to 8% p.a.</span>
            <span className="chumz-feat">Group savings</span>
            <span className="chumz-feat">CMA regulated</span>
          </div>
          <a href="https://chumz.io" target="_blank" rel="noreferrer" className="btn btn-amber">Open Chumz App →</a>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)", marginBottom: 10 }}>Other options</div>
          <div className="alt-savers">
            <div className="alt-card">
              <div className="alt-name">KCB M-Pesa</div>
              <div className="alt-info">Target Savings Account — up to 6.3% p.a. Save directly from M-Pesa.</div>
              <a href="https://www.kcbgroup.com/personal/save-and-invest/kcb-mpesa" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ marginTop: 8, padding: "5px 12px", fontSize: "0.75rem" }}>Open →</a>
            </div>
            <div className="alt-card">
              <div className="alt-name">M-Shwari</div>
              <div className="alt-info">Safaricom + CBA — lock savings, earn interest, access credit.</div>
              <a href="https://www.safaricom.co.ke/personal/m-pesa/do-more-with-m-pesa/m-shwari" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ marginTop: 8, padding: "5px 12px", fontSize: "0.75rem" }}>Open →</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────────────────────── */
export default function BreatheFree() {
  const [dark, setDark] = useState(() => localStorage.getItem("bf_dark") === "1");
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem("bf_onboard"));
  const [tab, setTab] = useState("tracker");
  const [filter, setFilter] = useState("all");
  const [quitDate, setQuitDate] = useState(() => localStorage.getItem("bf_quit") || "");
  const [inputDate, setInputDate] = useState("");
  const [now, setNow] = useState(Date.now());
  const [checkins, setCheckins] = useState(() => JSON.parse(localStorage.getItem("bf_checkins") || "[]"));
  const [showShare, setShowShare] = useState(false);
  const [notif, setNotif] = useState("idle");
  const [wlEmail, setWlEmail] = useState("");
  const [wlDone, setWlDone] = useState(() => !!localStorage.getItem("bf_wl"));

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t); }, []);
  useEffect(() => { document.documentElement.setAttribute("data-theme", dark ? "dark" : "light"); localStorage.setItem("bf_dark", dark ? "1" : "0"); }, [dark]);

  const hoursClean = quitDate ? Math.max(0, (now - new Date(quitDate).getTime()) / 3600000) : 0;
  const daysClean = Math.floor(hoursClean / 24);
  const cigs = daysClean * 10;
  const money = (daysClean * 10 * 0.5).toFixed(0);

  const saveQuit = () => { if (!inputDate) return; localStorage.setItem("bf_quit", inputDate); setQuitDate(inputDate); };
  const checkIn = () => {
    const t = toDay();
    if (!checkins.includes(t)) { const u = [...checkins, t]; setCheckins(u); localStorage.setItem("bf_checkins", JSON.stringify(u)); }
  };
  const reqNotif = async () => {
    if (!("Notification" in window)) { setNotif("denied"); return; }
    const p = await Notification.requestPermission();
    setNotif(p === "granted" ? "granted" : "denied");
    if (p === "granted") new Notification("BreatheFree 🫁", { body: "Daily reminder set. You've got this!" });
  };
  const submitWl = () => { if (!wlEmail.includes("@")) return; localStorage.setItem("bf_wl", wlEmail); setWlDone(true); };

  const filtered = filter === "all" ? BRANDS : BRANDS.filter(b =>
    filter === "flavoured" ? b.type.toLowerCase().includes("flavour") || b.type.toLowerCase().includes("menthol") : b.type.toLowerCase() === "regular"
  );

  const TABS = [
    { key: "tracker", label: "Tracker" },
    { key: "savings", label: "💰 Savings" },
    { key: "informed", label: "Stay Informed" },
    { key: "community", label: "Community" },
    { key: "resources", label: "Resources" },
    { key: "about", label: "About" },
  ];

  if (!onboarded) return <><style>{STYLES}</style><Onboarding onDone={() => setOnboarded(true)} /></>;

  return (
    <>
      <style>{STYLES}</style>
      {showShare && <ShareCard days={daysClean} cigs={cigs} money={money} onClose={() => setShowShare(false)} />}

      <div className="app">
        <nav className="nav">
          <div className="logo">Breathe<em>Free</em></div>
          <button className="dark-toggle" onClick={() => setDark(d => !d)}>{dark ? "☀️ Light" : "🌙 Dark"}</button>
          <div className="tabs">
            {TABS.map(t => (
              <button key={t.key} className={`tab${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>{t.label}</button>
            ))}
          </div>
        </nav>

        {/* ── TRACKER ── */}
        {tab === "tracker" && (<>
          {notif === "idle" && (
            <div className="notif-bar">
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>🔔 Enable daily reminders</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Morning nudges to keep you on track</div>
              </div>
              <button className="btn" style={{ padding: "8px 14px", fontSize: "0.8rem" }} onClick={reqNotif}>Enable</button>
            </div>
          )}
          {notif === "granted" && <div className="notif-bar"><div style={{ fontWeight: 600, fontSize: "0.85rem" }}>✅ Daily reminders are on — we've got your back</div></div>}
          {notif === "denied" && <div className="notif-bar"><div style={{ fontSize: "0.84rem", color: "var(--muted)" }}>Notifications blocked — you can enable them in browser settings.</div></div>}

          <div className="card">
            <div className="card-title">Your Quit Journey</div>
            <div className="card-sub">Track your progress since you stopped smoking</div>
            {!quitDate ? (
              <><div style={{ fontSize: "0.83rem", color: "var(--muted)", marginBottom: 8 }}>When did you last smoke? Set your quit date to start tracking.</div>
              <input type="datetime-local" className="input" value={inputDate} onChange={e => setInputDate(e.target.value)} style={{ marginBottom: 10 }} />
              <button className="btn" onClick={saveQuit} disabled={!inputDate}>Set My Quit Date</button></>
            ) : (<>
              <div className="stat-grid">
                <div className="stat-box"><div className="stat-num">{daysClean}</div><div className="stat-lbl">Days Smoke-Free</div></div>
                <div className="stat-box"><div className="stat-num">{Math.round(hoursClean)}</div><div className="stat-lbl">Total Hours</div></div>
                <div className="stat-box"><div className="stat-num">{cigs}</div><div className="stat-lbl">Cigarettes Avoided</div></div>
                <div className="stat-box"><div className="stat-num">KES {money}</div><div className="stat-lbl">Money Saved</div></div>
              </div>
              <div className="btn-row">
                <button className="btn" onClick={() => setShowShare(true)}>📤 Share Progress</button>
                <button className="btn btn-amber" onClick={() => setTab("savings")}>💰 Save My Money</button>
                <button className="btn btn-outline" style={{ fontSize: "0.78rem" }} onClick={() => { localStorage.removeItem("bf_quit"); setQuitDate(""); }}>Reset</button>
              </div>
            </>)}
          </div>

          {quitDate && (
            <div className="card">
              <div className="card-title">Lung Recovery</div>
              <div className="card-sub">Visual estimate based on days smoke-free</div>
              <LungViz days={daysClean} />
            </div>
          )}

          <CravingTimer />

          <div className="card">
            <div className="card-title">Daily Check-In Streak</div>
            <div className="card-sub">Mark every smoke-free day — build your habit</div>
            <StreakCalendar checkins={checkins} onCheck={checkIn} />
          </div>

          <div className="card">
            <div className="card-title">Health Milestones</div>
            <div className="card-sub">What's happening in your body after quitting</div>
            {MILESTONES.map((m, i) => (
              <div className="milestone" key={i}>
                <div className={`ms-dot${hoursClean >= m.h ? " done" : ""}`} />
                <div><div className="ms-time">{m.time}</div><div className="ms-text">{m.body}</div></div>
              </div>
            ))}
          </div>
        </>)}

        {/* ── SAVINGS ── */}
        {tab === "savings" && <SavingsTab moneySaved={money} days={daysClean} />}

        {/* ── STAY INFORMED ── */}
        {tab === "informed" && (<>
          <div className="card">
            <div className="card-title">Tobacco Brand Ingredients</div>
            <div className="card-sub">Nicotine, tar & flavouring agents — brands available in Kenya</div>
            <div className="filter-row">
              {["all","regular","flavoured"].map(f => (
                <button key={f} className={`f-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
            </div>
            <div className="brand-grid">
              {filtered.map((b, i) => (
                <div className="brand-card" key={i}>
                  <div className="brand-hdr"><div className="brand-name">{b.name}</div><div className="brand-type">{b.type}</div></div>
                  <div className="brand-body">
                    <div className="ing-row"><span className="ing-lbl">Nicotine</span><span className="ing-val">{b.nicotine}</span></div>
                    <div className="ing-row"><span className="ing-lbl">Tar</span><span className="ing-val">{b.tar}</span></div>
                    <div className="ing-row"><span className="ing-lbl">Carbon Monoxide</span><span className="ing-val">{b.co}</span></div>
                    <div className="ing-row"><span className="ing-lbl">Flavour agents</span><span className="ing-val">{b.flavor}</span></div>
                    <div className="ing-row"><span className="ing-lbl">Origin</span><span className="ing-val" style={{ fontSize: "0.76rem" }}>{b.origin}</span></div>
                    <span className={`risk-badge ${b.risk === "h" ? "risk-h" : "risk-m"}`}>{b.risk === "h" ? "High Risk" : "Moderate Risk"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Key Chemicals in Tobacco Smoke</div>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: 14 }}>Cigarette smoke contains over 7,000 chemicals. Key compounds identified in standard and flavoured products — compiled to support cessation programme design.</p>
            <table className="chem-table">
              <thead><tr><th>Compound</th><th>Category</th><th>Effect</th></tr></thead>
              <tbody>{CHEMICALS.map((c, i) => (
                <tr key={i}><td><strong>{c.name}</strong></td><td><span className="chem-cat">{c.cat}</span></td><td>{c.effect}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </>)}

        {/* ── COMMUNITY ── */}
        {tab === "community" && (<>
          <div className="comm-banner">
            <div className="comm-tag">Fitness Community</div>
            <div className="comm-title">The Vitora Collective</div>
            <div className="comm-sub">A movement for people reclaiming their bodies after smoking. Runs, rides, breathwork, strength — because quitting is only the beginning.</div>
            <button className="community-join" style={{ display:"inline-block",marginTop:18,background:"var(--amber)",color:"white",padding:"10px 22px",borderRadius:10,fontSize:"0.85rem",fontWeight:600,border:"none" }}>Join the Collective →</button>
          </div>

          <div className="card">
            <div className="card-title">Active Groups</div>
            <div className="card-sub">Find your discipline. Every group welcomes beginners.</div>
            <div className="act-grid">
              {ACTIVITIES.map((a, i) => (
                <div className="act-card" key={i}>
                  <div className="act-icon">{a.icon}</div>
                  <div className="act-name">{a.name}</div>
                  <div className="act-desc">{a.desc}</div>
                  <div className="act-n">↑ {a.n}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Join Real Online Communities</div>
            <div className="card-sub">Active quit-smoking groups across the web — join any of these today</div>
            {COMMUNITIES.map((c, i) => (
              <div className="comm-row" key={i}>
                <div className="comm-platform" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
                <div className="comm-info">
                  <div className="comm-name">{c.name}</div>
                  <div className="comm-meta">{c.meta}</div>
                  <div className="comm-members">{c.members}</div>
                </div>
                <a href={c.url} target="_blank" rel="noreferrer" className="ext-link">Join →</a>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">Why Move After Quitting?</div>
            <div className="card-sub">The science behind pairing exercise with cessation</div>
            <p style={{ fontSize: "0.87rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: 12 }}>Exercise reduces withdrawal symptoms by stimulating the same dopamine pathways that nicotine hijacks. A brisk 5-minute walk can cut craving intensity by up to 50%.</p>
            <p style={{ fontSize: "0.87rem", color: "var(--muted)", lineHeight: 1.7 }}>The Vitora Collective was built on this evidence — structured physical activity is not just health maintenance, it's a clinical cessation tool.</p>
          </div>
        </>)}

        {/* ── RESOURCES ── */}
        {tab === "resources" && (
          <div className="card">
            <div className="card-title">BreatheFree Journal</div>
            <div className="card-sub">Evidence-based reads on quitting, recovery, and healthy living in Kenya</div>
            {BLOG_POSTS.map((p, i) => (
              <div className="blog-row" key={i}>
                <div className="blog-n">0{i + 1}</div>
                <div>
                  <div className="blog-tag">{p.tag}</div>
                  <div className="blog-title">{p.title}</div>
                  <div className="blog-ex">{p.ex}</div>
                  <div className="blog-meta">{p.date} · {p.rt} read</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ABOUT ── */}
        {tab === "about" && (<>
          <div className="waitlist-box">
            <div style={{ fontSize: "0.7rem", background: "rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: 20, display: "inline-block", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Early Access</div>
            <div className="wl-title">Join the BreatheFree Waitlist</div>
            <div className="wl-sub">Be first to get premium features — personalised plans, coach check-ins, community leaderboards.</div>
            <div className="wl-count"><strong>{liveCount()}</strong> people signed up this month</div>
            {!wlDone
              ? <div className="wl-form"><input className="wl-input" placeholder="your@email.com" value={wlEmail} onChange={e => setWlEmail(e.target.value)} /><button className="wl-btn" onClick={submitWl}>Join →</button></div>
              : <div className="wl-done">✓ You're on the list. We'll be in touch soon.</div>}
          </div>

          <div className="card">
            <div className="a-section">
              <h3>About BreatheFree</h3>
              <p>BreatheFree is a smoking cessation and tobacco research platform helping Kenyan healthcare workers and individuals understand tobacco products — and supporting users on their journey to quit for good.</p>
            </div>
            <div className="a-section">
              <h3>Why We Built This</h3>
              <p>Kenya has one of the fastest-growing rates of flavoured tobacco use among young adults. Many users drawn to products like Double O and Café Crème are unaware of the chemical additives designed to deepen addiction. BreatheFree closes that information gap and gives quitters a community to recover in.</p>
            </div>
            <div className="a-section">
              <h3>Our Team</h3>
              <div className="team-card"><div className="team-av">P</div><div><div className="team-name">Peter — Founder</div><div className="team-role">Healthcare worker & developer. Building tools to reduce tobacco harm in Kenya.</div></div></div>
              <div className="team-card"><div className="team-av">V</div><div><div className="team-name">Victor Gidi — Co-Founder</div><div className="team-role">Product & growth strategist. Community-led health behaviour change across East Africa.</div></div></div>
            </div>
            <div className="a-section">
              <h3>Backed by Vision</h3>
              <div className="fund-card">
                <div className="fund-lbl">Investor Relations</div>
                <div className="fund-title">Seeking Pre-Seed Funding</div>
                <div className="fund-text">BreatheFree is targeting Y Combinator's next cohort and engaging healthcare-focused VCs across East Africa. The Sub-Saharan tobacco cessation market covers an estimated 80 million underserved smokers — a largely untapped digital health opportunity.</div>
                <div className="inv-badges">
                  <span className="inv-badge">Y Combinator — Applicant</span>
                  <span className="inv-badge">Pre-Seed Round Open</span>
                  <span className="inv-badge">East Africa · HealthTech</span>
                </div>
              </div>
            </div>
          </div>
        </>)}
      </div>
    </>
  );
}
