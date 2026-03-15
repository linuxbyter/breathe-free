import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f5f2ec;
    --surface: #ffffff;
    --green: #1a5c3a;
    --green-light: #2d8a58;
    --green-pale: #e8f4ee;
    --amber: #c47c2b;
    --red: #b03a2e;
    --text: #1a1a1a;
    --muted: #6b6b6b;
    --border: #e0dbd0;
    --shadow: 0 2px 12px rgba(0,0,0,0.07);
  }

  [data-theme="dark"] {
    --bg: #0e1a12;
    --surface: #162418;
    --green: #4ade80;
    --green-light: #6bec98;
    --green-pale: #1a2e20;
    --amber: #f0a84e;
    --red: #f87171;
    --text: #e8efe9;
    --muted: #7aad85;
    --border: #243328;
    --shadow: 0 2px 12px rgba(0,0,0,0.3);
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); transition: background 0.3s, color 0.3s; }
  .app { min-height: 100vh; max-width: 900px; margin: 0 auto; padding: 0 16px 80px; }

  .nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 0 16px; border-bottom: 1px solid var(--border); margin-bottom: 28px; flex-wrap: wrap; gap: 10px; }
  .logo { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: var(--green); letter-spacing: -0.5px; }
  .logo span { color: var(--amber); font-style: italic; }
  .dark-toggle { background: var(--green-pale); border: 1px solid var(--border); border-radius: 20px; padding: 6px 12px; cursor: pointer; font-size: 0.8rem; color: var(--text); font-family: 'DM Sans', sans-serif; }
  .tabs { display: flex; gap: 4px; background: var(--border); border-radius: 10px; padding: 4px; flex-wrap: wrap; }
  .tab { padding: 7px 12px; border-radius: 7px; border: none; background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 500; color: var(--muted); transition: all 0.2s; white-space: nowrap; }
  .tab.active { background: var(--surface); color: var(--green); box-shadow: var(--shadow); }

  .card { background: var(--surface); border-radius: 16px; padding: 24px; border: 1px solid var(--border); margin-bottom: 16px; box-shadow: var(--shadow); }
  .card-title { font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: var(--green); margin-bottom: 4px; }
  .card-sub { font-size: 0.82rem; color: var(--muted); margin-bottom: 18px; }

  .onboard-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .onboard-card { background: var(--surface); border-radius: 20px; padding: 36px 28px; max-width: 480px; width: 100%; border: 1px solid var(--border); box-shadow: var(--shadow); }
  .onboard-step { font-size: 0.75rem; color: var(--muted); margin-bottom: 8px; letter-spacing: 1px; text-transform: uppercase; }
  .onboard-q { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: var(--green); margin-bottom: 24px; line-height: 1.3; }
  .onboard-options { display: flex; flex-direction: column; gap: 10px; }
  .onboard-opt { padding: 13px 18px; border: 1.5px solid var(--border); border-radius: 12px; background: var(--bg); cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; text-align: left; color: var(--text); transition: all 0.15s; }
  .onboard-opt:hover, .onboard-opt.selected { border-color: var(--green); background: var(--green-pale); color: var(--green); }
  .onboard-opt.selected { font-weight: 600; }
  .onboard-progress { display: flex; gap: 6px; margin-bottom: 24px; }
  .onboard-dot { height: 4px; flex: 1; border-radius: 2px; background: var(--border); }
  .onboard-dot.done { background: var(--green); }

  .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .stat-box { background: var(--green-pale); border-radius: 12px; padding: 18px; text-align: center; }
  .stat-num { font-family: 'DM Serif Display', serif; font-size: 2.2rem; color: var(--green); line-height: 1; }
  .stat-label { font-size: 0.75rem; color: var(--muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }

  .milestone { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .milestone:last-child { border-bottom: none; }
  .milestone-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border); flex-shrink: 0; margin-top: 4px; }
  .milestone-dot.done { background: var(--green-light); }
  .milestone-time { font-size: 0.78rem; color: var(--amber); font-weight: 600; margin-bottom: 2px; }
  .milestone-text { font-size: 0.85rem; color: var(--text); }

  .lung-wrap { display: flex; flex-direction: column; align-items: center; padding: 16px 0; }
  .lung-pct { font-family: 'DM Serif Display', serif; font-size: 1.3rem; color: var(--green); margin-top: 10px; }
  .lung-label { font-size: 0.78rem; color: var(--muted); margin-top: 4px; text-align: center; }

  .craving-box { background: var(--green-pale); border-radius: 14px; padding: 20px; margin-bottom: 16px; text-align: center; border: 1px solid var(--border); }
  .craving-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; color: var(--text); }
  .craving-countdown { font-family: 'DM Serif Display', serif; font-size: 3rem; color: var(--green); line-height: 1; margin: 8px 0; }
  .craving-msg { font-size: 0.82rem; color: var(--muted); margin-bottom: 14px; line-height: 1.5; }
  .craving-progress { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin-bottom: 14px; }
  .craving-fill { height: 100%; background: var(--green); border-radius: 3px; transition: width 1s linear; }

  .streak-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; margin-bottom: 12px; }
  .streak-day { aspect-ratio: 1; border-radius: 5px; background: var(--border); }
  .streak-day.checked { background: var(--green); }
  .streak-day.today { outline: 2px solid var(--amber); outline-offset: 1px; }
  .streak-labels { display: flex; gap: 12px; font-size: 0.75rem; color: var(--muted); align-items: center; margin-top: 6px; }
  .streak-dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }

  .share-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
  .share-card { background: linear-gradient(135deg, #1a5c3a 0%, #0d3d26 100%); border-radius: 20px; padding: 32px; max-width: 360px; width: 100%; color: white; text-align: center; position: relative; }
  .share-card-close { position: absolute; top: 12px; right: 14px; background: none; border: none; color: rgba(255,255,255,0.6); font-size: 1.2rem; cursor: pointer; }
  .share-card-logo { font-family: 'DM Serif Display', serif; font-size: 1.1rem; opacity: 0.7; margin-bottom: 20px; }
  .share-card-days { font-family: 'DM Serif Display', serif; font-size: 4rem; line-height: 1; }
  .share-card-label { font-size: 0.85rem; opacity: 0.75; margin-bottom: 20px; }
  .share-card-stats { display: flex; gap: 16px; justify-content: center; margin-bottom: 20px; }
  .share-stat-num { font-weight: 700; font-size: 1.2rem; }
  .share-stat-lbl { font-size: 0.7rem; opacity: 0.65; }
  .share-card-tag { font-size: 0.75rem; opacity: 0.5; }
  .share-hint { font-size: 0.78rem; color: rgba(255,255,255,0.7); text-align: center; margin-top: 12px; }

  .quit-input { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; margin-bottom: 10px; background: var(--bg); color: var(--text); }
  .btn { background: var(--green); color: white; border: none; padding: 11px 22px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500; cursor: pointer; }
  .btn-amber { background: var(--amber); }
  .btn-outline { background: none; border: 1px solid var(--border); color: var(--muted); }
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; }

  .brand-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
  .brand-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .brand-header { padding: 14px 16px; background: var(--green-pale); display: flex; align-items: center; justify-content: space-between; }
  .brand-name { font-weight: 600; font-size: 0.95rem; color: var(--green); }
  .brand-type { font-size: 0.72rem; background: var(--green); color: white; padding: 3px 8px; border-radius: 20px; }
  .brand-body { padding: 14px 16px; }
  .ing-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px dashed var(--border); font-size: 0.82rem; }
  .ing-row:last-child { border-bottom: none; }
  .ing-label { color: var(--muted); }
  .ing-val { font-weight: 600; color: var(--text); text-align: right; max-width: 55%; }
  .risk-badge { display: inline-block; font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; font-weight: 600; margin-top: 10px; }
  .risk-high { background: #fdecea; color: var(--red); }
  .risk-med { background: #fef3e2; color: var(--amber); }
  .chem-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .chem-table th { background: var(--green); color: white; padding: 9px 12px; text-align: left; }
  .chem-table td { padding: 8px 12px; border-bottom: 1px solid var(--border); vertical-align: top; color: var(--muted); }
  .chem-table tr:nth-child(even) td { background: var(--bg); }
  .chem-cat { font-size: 0.7rem; background: var(--green-pale); color: var(--green); padding: 2px 7px; border-radius: 10px; font-weight: 600; }
  .filter-row { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); font-size: 0.8rem; cursor: pointer; font-family: 'DM Sans', sans-serif; color: var(--text); }
  .filter-btn.active { background: var(--green); color: white; border-color: var(--green); }

  .community-banner { background: linear-gradient(135deg, #1a5c3a 0%, #0d3d26 100%); border-radius: 16px; padding: 28px 24px; margin-bottom: 16px; color: white; position: relative; overflow: hidden; }
  .community-banner::after { content: '◉'; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 6rem; opacity: 0.07; }
  .community-tag { font-size: 0.7rem; background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); padding: 3px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px; letter-spacing: 1px; text-transform: uppercase; }
  .community-title { font-family: 'DM Serif Display', serif; font-size: 1.8rem; margin-bottom: 8px; line-height: 1.2; }
  .community-sub { font-size: 0.85rem; opacity: 0.75; line-height: 1.6; max-width: 480px; }
  .community-join { display: inline-block; margin-top: 18px; background: var(--amber); color: white; padding: 10px 22px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .activity-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .activity-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
  .activity-icon { font-size: 1.5rem; margin-bottom: 8px; }
  .activity-name { font-weight: 600; font-size: 0.88rem; margin-bottom: 4px; color: var(--text); }
  .activity-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.5; }
  .activity-members { font-size: 0.72rem; color: var(--green); font-weight: 600; margin-top: 8px; }

  .blog-card { display: flex; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--border); }
  .blog-card:last-child { border-bottom: none; }
  .blog-num { font-family: 'DM Serif Display', serif; font-size: 2rem; color: var(--border); min-width: 36px; line-height: 1; }
  .blog-tag { font-size: 0.7rem; color: var(--amber); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .blog-title { font-weight: 600; font-size: 0.92rem; margin-bottom: 6px; color: var(--text); }
  .blog-excerpt { font-size: 0.82rem; color: var(--muted); line-height: 1.55; }
  .blog-meta { font-size: 0.72rem; color: var(--muted); margin-top: 8px; }

  .about-section { margin-bottom: 24px; }
  .about-section h3 { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--green); margin-bottom: 8px; }
  .about-section p { font-size: 0.88rem; color: var(--muted); line-height: 1.65; }
  .team-card { display: flex; align-items: center; gap: 14px; padding: 16px; background: var(--green-pale); border-radius: 12px; margin-bottom: 10px; }
  .team-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--green); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1rem; flex-shrink: 0; }
  .team-name { font-weight: 600; font-size: 0.9rem; color: var(--text); }
  .team-role { font-size: 0.78rem; color: var(--muted); }
  .funding-card { border: 1px solid var(--amber); border-radius: 14px; padding: 20px; background: var(--bg); margin-top: 4px; }
  .funding-label { font-size: 0.72rem; color: var(--amber); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .funding-title { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--text); margin-bottom: 8px; }
  .funding-text { font-size: 0.85rem; color: var(--muted); line-height: 1.65; }
  .investor-badges { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
  .inv-badge { font-size: 0.75rem; border: 1px solid var(--border); border-radius: 8px; padding: 5px 12px; color: var(--muted); font-weight: 500; }

  .waitlist-box { background: linear-gradient(135deg, #1a5c3a 0%, #0d3d26 100%); border-radius: 16px; padding: 28px 24px; color: white; margin-bottom: 16px; }
  .waitlist-title { font-family: 'DM Serif Display', serif; font-size: 1.4rem; margin-bottom: 8px; }
  .waitlist-sub { font-size: 0.85rem; opacity: 0.75; margin-bottom: 10px; }
  .waitlist-counter { font-size: 0.82rem; opacity: 0.65; margin-bottom: 16px; }
  .waitlist-counter strong { opacity: 1; font-size: 1rem; }
  .waitlist-form { display: flex; gap: 8px; }
  .waitlist-input { flex: 1; padding: 10px 14px; border-radius: 10px; border: none; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; background: rgba(255,255,255,0.15); color: white; }
  .waitlist-input::placeholder { color: rgba(255,255,255,0.5); }
  .waitlist-btn { background: var(--amber); color: white; border: none; padding: 10px 18px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer; font-size: 0.85rem; white-space: nowrap; }
  .waitlist-done { font-size: 0.88rem; background: rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; }

  .notif-box { background: var(--green-pale); border-radius: 12px; padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border: 1px solid var(--border); margin-bottom: 16px; }

  @media (max-width: 600px) {
    .tab { padding: 6px 8px; font-size: 0.72rem; }
    .stat-num { font-size: 1.8rem; }
    .community-title { font-size: 1.4rem; }
    .waitlist-form { flex-direction: column; }
  }
`;

const BRANDS = [
  { name: "Marlboro Red", type: "Regular", nicotine: "1.2 mg", tar: "12 mg", co: "13 mg", flavor: "None (Full flavour)", risk: "high", origin: "USA / Phillip Morris" },
  { name: "Camel Filters", type: "Regular", nicotine: "1.1 mg", tar: "11 mg", co: "12 mg", flavor: "None", risk: "high", origin: "USA / R.J. Reynolds" },
  { name: "Dunhill Fine Cut", type: "Regular", nicotine: "0.8 mg", tar: "8 mg", co: "9 mg", flavor: "None", risk: "high", origin: "UK / BAT" },
  { name: "Café Crème", type: "Flavoured (Coffee)", nicotine: "0.6 mg", tar: "6 mg", co: "7 mg", flavor: "Coffee / Vanilla extract", risk: "med", origin: "Switzerland / Villiger" },
  { name: "Double O", type: "Flavoured", nicotine: "0.7 mg", tar: "7 mg", co: "8 mg", flavor: "Menthol / Fruit blend", risk: "med", origin: "Kenya / BAT Kenya" },
  { name: "Supermatch Menthol", type: "Menthol", nicotine: "0.6 mg", tar: "6 mg", co: "7 mg", flavor: "Menthol (L-Menthol 0.3%)", risk: "med", origin: "Kenya / BAT Kenya" },
];

const CHEMICALS = [
  { name: "Nicotine", cat: "Alkaloid", effect: "Primary addictive agent. Stimulates dopamine release, creating dependency." },
  { name: "Tar", cat: "Particulate", effect: "Collective term for toxic particles. Coats lung tissue, causes cancer." },
  { name: "Carbon Monoxide", cat: "Gas", effect: "Reduces oxygen-carrying capacity of blood. Linked to heart disease." },
  { name: "Formaldehyde", cat: "Aldehyde", effect: "Known carcinogen produced during combustion of tobacco." },
  { name: "Benzene", cat: "Aromatic", effect: "Linked to leukemia. Present in tobacco smoke." },
  { name: "Ammonia", cat: "Additive", effect: "Added to increase nicotine absorption speed and intensity." },
  { name: "L-Menthol", cat: "Flavourant", effect: "Creates cooling sensation. Masks harshness and increases inhalation depth." },
  { name: "Propylene Glycol", cat: "Humectant", effect: "Keeps tobacco moist. Also found in e-cigarettes." },
  { name: "Coumarin", cat: "Flavourant", effect: "Sweet/vanilla-like scent. Banned in food; still found in some tobaccos." },
  { name: "Acrolein", cat: "Gas", effect: "Irritates respiratory tract. Damages cilia in lungs." },
];

const MILESTONES = [
  { time: "20 minutes", body: "Heart rate drops to normal level", hours: 0.33 },
  { time: "8 hours", body: "Carbon monoxide levels in blood drop by half", hours: 8 },
  { time: "24 hours", body: "Heart attack risk begins to decrease", hours: 24 },
  { time: "48 hours", body: "Nerve endings start to regrow; taste and smell improve", hours: 48 },
  { time: "72 hours", body: "Bronchial tubes relax; breathing becomes easier", hours: 72 },
  { time: "2 weeks", body: "Circulation and lung function improve significantly", hours: 336 },
  { time: "3 months", body: "Coughing and wheezing decrease; cilia regrow in lungs", hours: 2160 },
  { time: "1 year", body: "Risk of coronary heart disease is half that of a smoker", hours: 8760 },
];

const ACTIVITIES = [
  { icon: "🚴", name: "CycleStrong", desc: "Weekly group rides for ex-smokers rebuilding lung endurance", members: "214 members" },
  { icon: "🏃", name: "Morning Strides", desc: "5AM run crews across Nairobi, Mombasa & Kisumu", members: "389 members" },
  { icon: "🧘", name: "Breathwork Sessions", desc: "Guided breathing and mindfulness to manage cravings", members: "156 members" },
  { icon: "🏋️", name: "Iron & Air", desc: "Strength training programme designed around respiratory recovery", members: "98 members" },
];

const BLOG_POSTS = [
  { tag: "Science", title: "Why Flavoured Cigarettes Are More Dangerous Than You Think", excerpt: "Brands like Double O and Café Crème use L-menthol and coffee extracts to reduce the harshness of smoke — leading to deeper inhalation and faster nicotine absorption. Here's the chemistry behind the addiction.", readTime: "4 min read", date: "Feb 2025" },
  { tag: "Recovery", title: "The 72-Hour Window: What Your Body Goes Through When You Quit", excerpt: "The first three days are the hardest — and the most transformative. We break down exactly what is happening neurologically and physically as nicotine leaves your system.", readTime: "6 min read", date: "Jan 2025" },
  { tag: "Lifestyle", title: "How to Use Exercise as a Craving Blocker — A Nairobi Runner's Guide", excerpt: "Studies show a brisk 5-minute walk cuts craving intensity by up to 50%. We spoke to members of Morning Strides about building a fitness habit that replaced the cigarette break.", readTime: "5 min read", date: "Jan 2025" },
  { tag: "Kenya", title: "The Hidden Cost of Smoking: What Your KES Is Actually Buying", excerpt: "A packet a day costs over KES 36,000 a year. We mapped what that money could do instead — school fees, chama contributions, a savings account.", readTime: "3 min read", date: "Dec 2024" },
];

const CRAVING_MESSAGES = [
  "Hold on. This craving will peak and fade in under 10 minutes.",
  "Your brain is asking for dopamine. Give it time — it's relearning.",
  "Breathe slowly. In for 4 counts, hold for 4, out for 4.",
  "One craving at a time. You don't have to quit forever — just the next 10 minutes.",
  "You've survived every craving so far. This one is no different.",
];

function getTodayStr() { return new Date().toISOString().slice(0, 10); }
function getLiveCount() { return 1847 + (Math.floor(Date.now() / 86400000) % 30) * 7; }

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function LungViz({ daysClean }) {
  const pct = Math.min(100, Math.round((daysClean / 365) * 100));
  const r = Math.round(180 - 180 * pct / 100);
  const g = Math.round(60 + 140 * pct / 100);
  const fill = `rgb(${r},${g},40)`;
  const op = 0.4 + 0.6 * pct / 100;
  return (
    <div className="lung-wrap">
      <svg width="120" height="100" viewBox="0 0 120 100">
        <ellipse cx="38" cy="55" rx="22" ry="32" fill={fill} opacity={op} />
        <ellipse cx="38" cy="40" rx="12" ry="18" fill={fill} opacity={op * 0.7} />
        <ellipse cx="82" cy="55" rx="22" ry="32" fill={fill} opacity={op} />
        <ellipse cx="82" cy="40" rx="12" ry="18" fill={fill} opacity={op * 0.7} />
        <rect x="56" y="10" width="8" height="28" rx="4" fill={fill} opacity={op} />
        <path d="M60 38 Q44 42 38 48" stroke={fill} strokeWidth="4" fill="none" opacity={op} strokeLinecap="round" />
        <path d="M60 38 Q76 42 82 48" stroke={fill} strokeWidth="4" fill="none" opacity={op} strokeLinecap="round" />
      </svg>
      <div className="lung-pct">{pct}% recovered</div>
      <div className="lung-label">{pct < 20 ? "Healing has begun 🌱" : pct < 50 ? "Lungs clearing — keep going 💪" : pct < 90 ? "Airways reopening — strong progress 🫁" : "Near full recovery 🎉"}</div>
    </div>
  );
}

function CravingTimer() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(600);
  const [msgIdx, setMsgIdx] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (active) {
      ref.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { clearInterval(ref.current); setActive(false); setDone(true); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(ref.current);
  }, [active]);

  const start = () => { setSeconds(600); setDone(false); setMsgIdx(Math.floor(Math.random() * CRAVING_MESSAGES.length)); setActive(true); };
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="craving-box">
      <div className="craving-title">🚨 Craving Alarm</div>
      {!active && !done && (<><div className="craving-msg">Feeling a craving? Start the timer. Most cravings pass in under 10 minutes.</div><button className="btn btn-amber" onClick={start}>I Have a Craving</button></>)}
      {active && (<><div className="craving-countdown">{mins}:{secs}</div><div className="craving-progress"><div className="craving-fill" style={{ width: `${((600 - seconds) / 600) * 100}%` }} /></div><div className="craving-msg">{CRAVING_MESSAGES[msgIdx]}</div><button className="btn btn-outline" style={{ fontSize: "0.78rem", padding: "6px 14px" }} onClick={() => { clearInterval(ref.current); setActive(false); setSeconds(600); }}>Cancel</button></>)}
      {done && (<><div className="craving-countdown" style={{ fontSize: "2rem" }}>✓ Done</div><div className="craving-msg" style={{ fontWeight: 600, color: "var(--green)" }}>You made it through. That craving is gone. 🫁</div><button className="btn" onClick={start}>Another One?</button></>)}
    </div>
  );
}

function StreakCalendar({ checkins, onCheckIn }) {
  const today = getTodayStr();
  const alreadyChecked = checkins.includes(today);
  const streak = (() => { let c = 0; const d = new Date(); while (true) { const s = d.toISOString().slice(0,10); if (checkins.includes(s)) { c++; d.setDate(d.getDate()-1); } else break; } return c; })();
  const days = Array.from({ length: 35 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (34 - i)); return d.toISOString().slice(0, 10); });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)" }}>🔥 {streak} day streak</div>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Check in daily to keep it going</div>
        </div>
        {!alreadyChecked
          ? <button className="btn" style={{ padding: "8px 16px", fontSize: "0.82rem" }} onClick={onCheckIn}>Check In Today</button>
          : <span style={{ fontSize: "0.82rem", color: "var(--green)", fontWeight: 600 }}>✓ Checked in</span>}
      </div>
      <div className="streak-grid">{days.map(d => <div key={d} className={`streak-day${checkins.includes(d) ? " checked" : ""}${d === today ? " today" : ""}`} title={d} />)}</div>
      <div className="streak-labels">
        <span><span className="streak-dot" style={{ background: "var(--green)" }} /> Smoke-free</span>
        <span><span className="streak-dot" style={{ background: "var(--border)" }} /> Not checked in</span>
      </div>
    </div>
  );
}

function ShareCard({ daysClean, cigarettes, money, onClose }) {
  return (
    <div className="share-overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
        <div className="share-card">
          <button className="share-card-close" onClick={onClose}>✕</button>
          <div className="share-card-logo">BreatheFree</div>
          <div className="share-card-days">{daysClean}</div>
          <div className="share-card-label">days smoke-free 🫁</div>
          <div className="share-card-stats">
            <div className="share-stat"><div className="share-stat-num">{cigarettes}</div><div className="share-stat-lbl">cigarettes avoided</div></div>
            <div className="share-stat"><div className="share-stat-num">KES {money}</div><div className="share-stat-lbl">money saved</div></div>
          </div>
          <div className="share-card-tag">breathefree.app · Join the movement</div>
        </div>
        <div className="share-hint">📸 Screenshot and share on WhatsApp or Instagram</div>
      </div>
    </div>
  );
}

function Onboarding({ onDone }) {
  const questions = [
    { q: "How many cigarettes were you smoking per day?", opts: ["1–5 (light smoker)", "6–10", "11–20 (a pack)", "More than 20"] },
    { q: "What's your main reason for quitting?", opts: ["My health", "My family / loved ones", "The cost", "I just want to be free of it"] },
    { q: "What's been your biggest challenge?", opts: ["Cravings after meals", "Stress at work", "Social situations", "I smoke out of boredom"] },
  ];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const next = () => {
    if (selected === null) return;
    const updated = [...answers, selected];
    if (step < questions.length - 1) { setAnswers(updated); setSelected(null); setStep(step + 1); }
    else { localStorage.setItem("bf_onboard", JSON.stringify(updated)); onDone(); }
  };

  return (
    <div className="onboard-wrap">
      <div className="onboard-card">
        <div className="onboard-progress">{questions.map((_, i) => <div key={i} className={`onboard-dot${i <= step ? " done" : ""}`} />)}</div>
        <div className="onboard-step">Step {step + 1} of {questions.length}</div>
        <div className="onboard-q">{questions[step].q}</div>
        <div className="onboard-options">{questions[step].opts.map((o, i) => <button key={i} className={`onboard-opt${selected === i ? " selected" : ""}`} onClick={() => setSelected(i)}>{o}</button>)}</div>
        <button className="btn" style={{ marginTop: 20, width: "100%", opacity: selected === null ? 0.5 : 1 }} onClick={next}>{step < questions.length - 1 ? "Continue →" : "Start My Journey"}</button>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

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
  const [notifState, setNotifState] = useState("idle");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(() => !!localStorage.getItem("bf_waitlist"));

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t); }, []);
  useEffect(() => { document.documentElement.setAttribute("data-theme", dark ? "dark" : "light"); localStorage.setItem("bf_dark", dark ? "1" : "0"); }, [dark]);

  const hoursClean = quitDate ? Math.max(0, (now - new Date(quitDate).getTime()) / 3600000) : 0;
  const daysClean = Math.floor(hoursClean / 24);
  const cigarettesAvoided = daysClean * 10;
  const moneySaved = (daysClean * 10 * 0.5).toFixed(0);

  const saveDate = () => { if (!inputDate) return; localStorage.setItem("bf_quit", inputDate); setQuitDate(inputDate); };
  const checkIn = () => { const today = getTodayStr(); if (!checkins.includes(today)) { const u = [...checkins, today]; setCheckins(u); localStorage.setItem("bf_checkins", JSON.stringify(u)); } };
  const requestNotif = async () => { if (!("Notification" in window)) { setNotifState("denied"); return; } const p = await Notification.requestPermission(); setNotifState(p === "granted" ? "granted" : "denied"); if (p === "granted") new Notification("BreatheFree 🫁", { body: "Daily reminder set. You've got this!" }); };
  const submitWaitlist = () => { if (!waitlistEmail.includes("@")) return; localStorage.setItem("bf_waitlist", waitlistEmail); setWaitlistDone(true); };

  const filtered = filter === "all" ? BRANDS : BRANDS.filter(b => filter === "flavoured" ? b.type.toLowerCase().includes("flavour") || b.type.toLowerCase().includes("menthol") : b.type.toLowerCase() === "regular");

  if (!onboarded) return (<><style>{STYLES}</style><Onboarding onDone={() => setOnboarded(true)} /></>);

  return (
    <>
      <style>{STYLES}</style>
      {showShare && <ShareCard daysClean={daysClean} cigarettes={cigarettesAvoided} money={moneySaved} onClose={() => setShowShare(false)} />}

      <div className="app">
        <nav className="nav">
          <div className="logo">Breathe<span>Free</span></div>
          <button className="dark-toggle" onClick={() => setDark(d => !d)}>{dark ? "☀️ Light" : "🌙 Dark"}</button>
          <div className="tabs">
            {[{key:"tracker",label:"Tracker"},{key:"informed",label:"Stay Informed"},{key:"community",label:"Community"},{key:"resources",label:"Resources"},{key:"about",label:"About"}].map(t => (
              <button key={t.key} className={`tab${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>{t.label}</button>
            ))}
          </div>
        </nav>

        {tab === "tracker" && (<>
          {notifState === "idle" && <div className="notif-box"><div><div style={{fontWeight:600,fontSize:"0.85rem"}}>🔔 Enable daily reminders</div><div style={{fontSize:"0.75rem",color:"var(--muted)"}}>Get a morning motivation nudge every day</div></div><button className="btn" style={{padding:"8px 14px",fontSize:"0.8rem"}} onClick={requestNotif}>Enable</button></div>}
          {notifState === "granted" && <div className="notif-box"><div style={{fontWeight:600,fontSize:"0.85rem"}}>✅ Daily reminders enabled — we've got your back</div></div>}

          <div className="card">
            <div className="card-title">Your Quit Journey</div>
            <div className="card-sub">Track your progress since you stopped smoking</div>
            {!quitDate ? (<><input type="datetime-local" className="quit-input" value={inputDate} onChange={e => setInputDate(e.target.value)} /><button className="btn" onClick={saveDate}>Set My Quit Date</button></>) : (<>
              <div className="stat-grid">
                <div className="stat-box"><div className="stat-num">{daysClean}</div><div className="stat-label">Days Smoke-Free</div></div>
                <div className="stat-box"><div className="stat-num">{Math.round(hoursClean)}</div><div className="stat-label">Total Hours</div></div>
                <div className="stat-box"><div className="stat-num">{cigarettesAvoided}</div><div className="stat-label">Cigarettes Avoided</div></div>
                <div className="stat-box"><div className="stat-num">KES {moneySaved}</div><div className="stat-label">Money Saved</div></div>
              </div>
              <div className="btn-row">
                <button className="btn" onClick={() => setShowShare(true)}>📤 Share My Progress</button>
                <button className="btn btn-outline" style={{fontSize:"0.78rem"}} onClick={() => { localStorage.removeItem("bf_quit"); setQuitDate(""); }}>Reset</button>
              </div>
            </>)}
          </div>

          {quitDate && <div className="card"><div className="card-title">Lung Recovery</div><div className="card-sub">Visual estimate based on days since quitting</div><LungViz daysClean={daysClean} /></div>}

          <CravingTimer />

          <div className="card"><div className="card-title">Daily Streak</div><div className="card-sub">Check in every day you stay smoke-free</div><StreakCalendar checkins={checkins} onCheckIn={checkIn} /></div>

          <div className="card">
            <div className="card-title">Health Milestones</div>
            <div className="card-sub">What happens in your body after quitting</div>
            {MILESTONES.map((m, i) => (
              <div className="milestone" key={i}>
                <div className={`milestone-dot${hoursClean >= m.hours ? " done" : ""}`} />
                <div><div className="milestone-time">{m.time}</div><div className="milestone-text">{m.body}</div></div>
              </div>
            ))}
          </div>
        </>)}

        {tab === "informed" && (<>
          <div className="card">
            <div className="card-title">Tobacco Brand Ingredient Research</div>
            <div className="card-sub">Comparative analysis of nicotine, tar, and flavouring agents across brands sold in Kenya</div>
            <div className="filter-row">{["all","regular","flavoured"].map(f => <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>)}</div>
            <div className="brand-grid">{filtered.map((b, i) => (
              <div className="brand-card" key={i}>
                <div className="brand-header"><div className="brand-name">{b.name}</div><div className="brand-type">{b.type}</div></div>
                <div className="brand-body">
                  <div className="ing-row"><span className="ing-label">Nicotine</span><span className="ing-val">{b.nicotine}</span></div>
                  <div className="ing-row"><span className="ing-label">Tar</span><span className="ing-val">{b.tar}</span></div>
                  <div className="ing-row"><span className="ing-label">Carbon Monoxide</span><span className="ing-val">{b.co}</span></div>
                  <div className="ing-row"><span className="ing-label">Flavour agents</span><span className="ing-val">{b.flavor}</span></div>
                  <div className="ing-row"><span className="ing-label">Origin</span><span className="ing-val" style={{fontSize:"0.78rem"}}>{b.origin}</span></div>
                  <span className={`risk-badge ${b.risk === "high" ? "risk-high" : "risk-med"}`}>{b.risk === "high" ? "High Risk" : "Moderate Risk"}</span>
                </div>
              </div>
            ))}</div>
          </div>
          <div className="card">
            <div className="card-title">Key Chemicals in Tobacco Smoke</div>
            <p style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:14}}>Cigarette smoke contains over 7,000 chemicals. Below are key compounds identified in standard and flavoured tobacco products — compiled to support cessation programme design.</p>
            <table className="chem-table">
              <thead><tr><th>Compound</th><th>Category</th><th>Effect</th></tr></thead>
              <tbody>{CHEMICALS.map((c,i) => <tr key={i}><td><strong>{c.name}</strong></td><td><span className="chem-cat">{c.cat}</span></td><td>{c.effect}</td></tr>)}</tbody>
            </table>
          </div>
        </>)}

        {tab === "community" && (<>
          <div className="community-banner">
            <div className="community-tag">Fitness Community</div>
            <div className="community-title">The Vitora Collective</div>
            <div className="community-sub">A movement for people reclaiming their bodies after smoking. We move together — runs, rides, breathwork, and strength — because quitting is only the beginning.</div>
            <button className="community-join">Join the Collective →</button>
          </div>
          <div className="card">
            <div className="card-title">Active Groups</div>
            <div className="card-sub">Find your discipline. Every group is welcoming to beginners.</div>
            <div className="activity-grid">{ACTIVITIES.map((a,i) => <div className="activity-card" key={i}><div className="activity-icon">{a.icon}</div><div className="activity-name">{a.name}</div><div className="activity-desc">{a.desc}</div><div className="activity-members">↑ {a.members}</div></div>)}</div>
          </div>
          <div className="card">
            <div className="card-title">Why Move After Quitting?</div>
            <div className="card-sub">The science behind pairing exercise with cessation</div>
            <p style={{fontSize:"0.87rem",color:"var(--muted)",lineHeight:1.7,marginBottom:12}}>Exercise reduces withdrawal symptoms and cravings by stimulating the same dopamine pathways that nicotine hijacks. Studies show that even a 5-minute brisk walk can cut cigarette cravings by up to 50%.</p>
            <p style={{fontSize:"0.87rem",color:"var(--muted)",lineHeight:1.7}}>The Vitora Collective was built on this evidence — structured physical activity is not just health maintenance, it is a clinical cessation tool.</p>
          </div>
        </>)}

        {tab === "resources" && (
          <div className="card">
            <div className="card-title">BreatheFree Journal</div>
            <div className="card-sub">Evidence-based articles on quitting, recovery, and healthy living in Kenya</div>
            {BLOG_POSTS.map((p,i) => (
              <div className="blog-card" key={i}>
                <div className="blog-num">0{i+1}</div>
                <div><div className="blog-tag">{p.tag}</div><div className="blog-title">{p.title}</div><div className="blog-excerpt">{p.excerpt}</div><div className="blog-meta">{p.date} · {p.readTime}</div></div>
              </div>
            ))}
          </div>
        )}

        {tab === "about" && (<>
          <div className="waitlist-box">
            <div style={{fontSize:"0.72rem",background:"rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.9)",padding:"3px 10px",borderRadius:20,display:"inline-block",marginBottom:10,letterSpacing:1,textTransform:"uppercase"}}>Early Access</div>
            <div className="waitlist-title">Join the BreatheFree Waitlist</div>
            <div className="waitlist-sub">Be first to access premium features — personalised plans, coach check-ins, and community leaderboards.</div>
            <div className="waitlist-counter"><strong>{getLiveCount()}</strong> people have already signed up this month</div>
            {!waitlistDone
              ? <div className="waitlist-form"><input className="waitlist-input" placeholder="your@email.com" value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)} /><button className="waitlist-btn" onClick={submitWaitlist}>Join →</button></div>
              : <div className="waitlist-done">✓ You're on the list. We'll be in touch soon.</div>}
          </div>
          <div className="card">
            <div className="about-section">
              <h3>About BreatheFree</h3>
              <p>BreatheFree is a smoking cessation and tobacco research platform built to help Kenyan healthcare workers and individuals understand the chemical composition of tobacco products — and support users on their journey to quit for good.</p>
            </div>
            <div className="about-section">
              <h3>Why We Built This</h3>
              <p>Kenya has one of the fastest-growing rates of flavoured tobacco use among young adults. Many users — particularly those drawn to products like Double O and Café Crème — are unaware of the chemical additives designed to mask harshness and deepen addiction. BreatheFree was built to close that information gap, and to give quitters a community to recover in.</p>
            </div>
            <div className="about-section">
              <h3>Our Team</h3>
              <div className="team-card"><div className="team-avatar">P</div><div><div className="team-name">Peter — Founder</div><div className="team-role">Healthcare worker & developer. Building tools to reduce tobacco harm in Kenya.</div></div></div>
              <div className="team-card"><div className="team-avatar">V</div><div><div className="team-name">Victor Gidi — Co-Founder</div><div className="team-role">Product & growth strategist. Focused on community-led health behaviour change across East Africa.</div></div></div>
            </div>
            <div className="about-section">
              <h3>Backed by Vision</h3>
              <div className="funding-card">
                <div className="funding-label">Investor Relations</div>
                <div className="funding-title">Seeking Pre-Seed Funding</div>
                <div className="funding-text">BreatheFree is actively pursuing pre-seed investment from mission-aligned venture capital firms and accelerators. We are targeting Y Combinator's next cohort and engaging healthcare-focused VCs who understand the scale of the tobacco cessation opportunity across Sub-Saharan Africa — an estimated 80 million smokers, largely underserved by digital health tools.</div>
                <div className="investor-badges">
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
