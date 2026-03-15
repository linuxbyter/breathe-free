import { useState, useEffect } from "react";

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
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  .app { min-height: 100vh; max-width: 900px; margin: 0 auto; padding: 0 16px 80px; }

  /* NAV */
  .nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 0 16px; border-bottom: 1px solid var(--border); margin-bottom: 32px; flex-wrap: wrap; gap: 10px; }
  .logo { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: var(--green); letter-spacing: -0.5px; }
  .logo span { color: var(--amber); font-style: italic; }
  .tabs { display: flex; gap: 4px; background: var(--border); border-radius: 10px; padding: 4px; }
  .tab { padding: 7px 14px; border-radius: 7px; border: none; background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; color: var(--muted); transition: all 0.2s; white-space: nowrap; }
  .tab.active { background: var(--surface); color: var(--green); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

  /* CARDS */
  .card { background: var(--surface); border-radius: 16px; padding: 24px; border: 1px solid var(--border); margin-bottom: 16px; }
  .card-title { font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: var(--green); margin-bottom: 4px; }
  .card-sub { font-size: 0.82rem; color: var(--muted); margin-bottom: 18px; }

  /* TRACKER */
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

  .quit-input { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; margin-bottom: 10px; background: var(--bg); }
  .btn { background: var(--green); color: white; border: none; padding: 11px 22px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500; cursor: pointer; transition: background 0.2s; }
  .btn:hover { background: var(--green-light); }
  .btn-outline { background: none; border: 1px solid var(--border); color: var(--muted); }
  .btn-outline:hover { background: var(--bg); }

  /* RESEARCH PAGE */
  .brand-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
  .brand-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .brand-header { padding: 14px 16px; background: var(--green-pale); display: flex; align-items: center; justify-content: space-between; }
  .brand-name { font-weight: 600; font-size: 0.95rem; color: var(--green); }
  .brand-type { font-size: 0.72rem; background: var(--green); color: white; padding: 3px 8px; border-radius: 20px; }
  .brand-body { padding: 14px 16px; }
  .ing-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px dashed var(--border); font-size: 0.82rem; }
  .ing-row:last-child { border-bottom: none; }
  .ing-label { color: var(--muted); }
  .ing-val { font-weight: 600; color: var(--text); }
  .risk-badge { display: inline-block; font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; font-weight: 600; margin-top: 10px; }
  .risk-high { background: #fdecea; color: var(--red); }
  .risk-med { background: #fef3e2; color: var(--amber); }

  .ing-explainer { margin-top: 20px; }
  .ing-section-title { font-family: 'DM Serif Display', serif; font-size: 1.05rem; color: var(--green); margin-bottom: 12px; }
  .chem-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .chem-table th { background: var(--green); color: white; padding: 9px 12px; text-align: left; }
  .chem-table td { padding: 8px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
  .chem-table tr:nth-child(even) td { background: var(--bg); }
  .chem-cat { font-size: 0.7rem; background: var(--green-pale); color: var(--green); padding: 2px 7px; border-radius: 10px; font-weight: 600; }

  .filter-row { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); font-size: 0.8rem; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .filter-btn.active { background: var(--green); color: white; border-color: var(--green); }

  /* COMMUNITY */
  .community-banner { background: linear-gradient(135deg, #1a5c3a 0%, #0d3d26 100%); border-radius: 16px; padding: 28px 24px; margin-bottom: 16px; color: white; position: relative; overflow: hidden; }
  .community-banner::after { content: '◉'; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 6rem; opacity: 0.07; }
  .community-tag { font-size: 0.7rem; background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); padding: 3px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px; letter-spacing: 1px; text-transform: uppercase; }
  .community-title { font-family: 'DM Serif Display', serif; font-size: 1.8rem; margin-bottom: 8px; line-height: 1.2; }
  .community-sub { font-size: 0.85rem; opacity: 0.75; line-height: 1.6; max-width: 480px; }
  .community-join { display: inline-block; margin-top: 18px; background: var(--amber); color: white; padding: 10px 22px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }

  .activity-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .activity-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
  .activity-icon { font-size: 1.5rem; margin-bottom: 8px; }
  .activity-name { font-weight: 600; font-size: 0.88rem; margin-bottom: 4px; }
  .activity-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.5; }
  .activity-members { font-size: 0.72rem; color: var(--green); font-weight: 600; margin-top: 8px; }

  /* ABOUT */
  .about-section { margin-bottom: 24px; }
  .about-section h3 { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--green); margin-bottom: 8px; }
  .about-section p { font-size: 0.88rem; color: var(--muted); line-height: 1.65; }
  .team-card { display: flex; align-items: center; gap: 14px; padding: 16px; background: var(--green-pale); border-radius: 12px; margin-bottom: 10px; }
  .team-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--green); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1rem; flex-shrink: 0; }
  .team-name { font-weight: 600; font-size: 0.9rem; }
  .team-role { font-size: 0.78rem; color: var(--muted); }

  .funding-card { border: 1px solid var(--amber); border-radius: 14px; padding: 20px; background: #fffaf4; margin-top: 4px; }
  .funding-label { font-size: 0.72rem; color: var(--amber); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .funding-title { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--text); margin-bottom: 8px; }
  .funding-text { font-size: 0.85rem; color: var(--muted); line-height: 1.65; }
  .investor-badges { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
  .inv-badge { font-size: 0.75rem; border: 1px solid var(--border); border-radius: 8px; padding: 5px 12px; color: var(--muted); font-weight: 500; }

  @media (max-width: 600px) {
    .tabs { gap: 2px; }
    .tab { padding: 6px 9px; font-size: 0.72rem; }
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
    .stat-num { font-size: 1.8rem; }
    .community-title { font-size: 1.4rem; }
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
  { name: "Ammonia", cat: "Additive", effect: "Added to increase nicotine absorption speed and 'hit'." },
  { name: "L-Menthol", cat: "Flavourant", effect: "Creates cooling sensation. May mask harshness and increase inhalation depth." },
  { name: "Propylene Glycol", cat: "Humectant", effect: "Keeps tobacco moist. Also used in e-cigarettes." },
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

export default function BreatheFree() {
  const [tab, setTab] = useState("tracker");
  const [filter, setFilter] = useState("all");
  const [quitDate, setQuitDate] = useState(() => localStorage.getItem("bf_quit") || "");
  const [inputDate, setInputDate] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const hoursClean = quitDate ? Math.max(0, (now - new Date(quitDate).getTime()) / 3600000) : 0;
  const daysClean = Math.floor(hoursClean / 24);
  const moneySaved = (daysClean * 10 * 0.5).toFixed(0);

  const saveDate = () => {
    if (!inputDate) return;
    localStorage.setItem("bf_quit", inputDate);
    setQuitDate(inputDate);
  };

  const filtered = filter === "all" ? BRANDS : BRANDS.filter(b =>
    filter === "flavoured"
      ? b.type.toLowerCase().includes("flavour") || b.type.toLowerCase().includes("menthol")
      : b.type.toLowerCase() === "regular"
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <nav className="nav">
          <div className="logo">Breathe<span>Free</span></div>
          <div className="tabs">
            {[
              { key: "tracker", label: "Tracker" },
              { key: "informed", label: "Stay Informed" },
              { key: "community", label: "Community" },
              { key: "about", label: "About" },
            ].map(t => (
              <button key={t.key} className={`tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </nav>

        {/* TRACKER */}
        {tab === "tracker" && (
          <>
            <div className="card">
              <div className="card-title">Your Quit Journey</div>
              <div className="card-sub">Track your progress since you stopped smoking</div>
              {!quitDate ? (
                <>
                  <input type="datetime-local" className="quit-input" value={inputDate} onChange={e => setInputDate(e.target.value)} />
                  <button className="btn" onClick={saveDate}>Set My Quit Date</button>
                </>
              ) : (
                <>
                  <div className="stat-grid">
                    <div className="stat-box"><div className="stat-num">{daysClean}</div><div className="stat-label">Days Smoke-Free</div></div>
                    <div className="stat-box"><div className="stat-num">{Math.round(hoursClean)}</div><div className="stat-label">Total Hours</div></div>
                    <div className="stat-box"><div className="stat-num">{daysClean * 10}</div><div className="stat-label">Cigarettes Avoided</div></div>
                    <div className="stat-box"><div className="stat-num">KES {moneySaved}</div><div className="stat-label">Money Saved</div></div>
                  </div>
                  <button className="btn btn-outline" style={{ fontSize: "0.78rem", padding: "6px 14px" }} onClick={() => { localStorage.removeItem("bf_quit"); setQuitDate(""); }}>Reset</button>
                </>
              )}
            </div>
            <div className="card">
              <div className="card-title">Health Milestones</div>
              <div className="card-sub">What happens in your body after quitting</div>
              {MILESTONES.map((m, i) => (
                <div className="milestone" key={i}>
                  <div className={`milestone-dot ${hoursClean >= m.hours ? "done" : ""}`} />
                  <div>
                    <div className="milestone-time">{m.time}</div>
                    <div className="milestone-text">{m.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* STAY INFORMED */}
        {tab === "informed" && (
          <>
            <div className="card">
              <div className="card-title">Tobacco Brand Ingredient Research</div>
              <div className="card-sub">Comparative analysis of nicotine, tar, and flavouring agents across common brands sold in Kenya</div>
              <div className="filter-row">
                {["all", "regular", "flavoured"].map(f => (
                  <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="brand-grid">
                {filtered.map((b, i) => (
                  <div className="brand-card" key={i}>
                    <div className="brand-header">
                      <div className="brand-name">{b.name}</div>
                      <div className="brand-type">{b.type}</div>
                    </div>
                    <div className="brand-body">
                      <div className="ing-row"><span className="ing-label">Nicotine</span><span className="ing-val">{b.nicotine}</span></div>
                      <div className="ing-row"><span className="ing-label">Tar</span><span className="ing-val">{b.tar}</span></div>
                      <div className="ing-row"><span className="ing-label">Carbon Monoxide</span><span className="ing-val">{b.co}</span></div>
                      <div className="ing-row"><span className="ing-label">Flavour agents</span><span className="ing-val" style={{ textAlign: "right", maxWidth: "55%" }}>{b.flavor}</span></div>
                      <div className="ing-row"><span className="ing-label">Origin</span><span className="ing-val" style={{ textAlign: "right", maxWidth: "55%", fontSize: "0.78rem" }}>{b.origin}</span></div>
                      <span className={`risk-badge ${b.risk === "high" ? "risk-high" : "risk-med"}`}>{b.risk === "high" ? "High Risk" : "Moderate Risk"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ing-section-title">Key Chemicals in Tobacco Smoke</div>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "14px" }}>
                Cigarette smoke contains over 7,000 chemicals. Below are key compounds identified in standard and flavoured tobacco products — compiled to support cessation programme design.
              </p>
              <table className="chem-table">
                <thead><tr><th>Compound</th><th>Category</th><th>Effect / Concern</th></tr></thead>
                <tbody>
                  {CHEMICALS.map((c, i) => (
                    <tr key={i}>
                      <td><strong>{c.name}</strong></td>
                      <td><span className="chem-cat">{c.cat}</span></td>
                      <td style={{ color: "var(--muted)" }}>{c.effect}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* COMMUNITY */}
        {tab === "community" && (
          <>
            <div className="community-banner">
              <div className="community-tag">Fitness Community</div>
              <div className="community-title">The Vitora Collective</div>
              <div className="community-sub">A movement for people reclaiming their bodies after smoking. We move together — runs, rides, breathwork, and strength — because quitting is only the beginning.</div>
              <button className="community-join">Join the Collective →</button>
            </div>

            <div className="card">
              <div className="card-title">Active Groups</div>
              <div className="card-sub">Find your discipline. Every group is welcoming to beginners.</div>
              <div className="activity-grid">
                {ACTIVITIES.map((a, i) => (
                  <div className="activity-card" key={i}>
                    <div className="activity-icon">{a.icon}</div>
                    <div className="activity-name">{a.name}</div>
                    <div className="activity-desc">{a.desc}</div>
                    <div className="activity-members">↑ {a.members}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Why Move After Quitting?</div>
              <div className="card-sub">The science behind pairing exercise with cessation</div>
              <div style={{ fontSize: "0.87rem", color: "var(--muted)", lineHeight: "1.7" }}>
                <p style={{ marginBottom: "12px" }}>Exercise reduces withdrawal symptoms and cravings by stimulating the same dopamine pathways that nicotine hijacks. Studies show that even a 5-minute brisk walk can cut cigarette cravings by up to 50%.</p>
                <p>The Vitora Collective was built on this evidence — structured physical activity isn't just health maintenance, it's a clinical cessation tool.</p>
              </div>
            </div>
          </>
        )}

        {/* ABOUT */}
        {tab === "about" && (
          <>
            <div className="card">
              <div className="about-section">
                <h3>About BreatheFree</h3>
                <p>BreatheFree is a smoking cessation and tobacco research platform built to help Kenyan healthcare workers and individuals understand the chemical composition of tobacco products — and support users on their journey to quit smoking for good.</p>
              </div>
              <div className="about-section">
                <h3>Why We Built This</h3>
                <p>Kenya has one of the fastest-growing rates of flavoured tobacco use among young adults. Many users — particularly those drawn to products like <em>Double O</em> and <em>Café Crème</em> — are unaware of the chemical additives designed to mask the harshness of nicotine and deepen addiction. BreatheFree was built to close that information gap, and to give quitters a community to recover in.</p>
              </div>
              <div className="about-section">
                <h3>Our Team</h3>
                <div className="team-card">
                  <div className="team-avatar">P</div>
                  <div>
                    <div className="team-name">Peter — Founder</div>
                    <div className="team-role">Healthcare worker & developer. Building tools to reduce tobacco harm in Kenya.</div>
                  </div>
                </div>
                <div className="team-card">
                  <div className="team-avatar">V</div>
                  <div>
                    <div className="team-name">Victor Gidi — Co-Founder</div>
                    <div className="team-role">Product & growth strategist. Focused on community-led health behaviour change across East Africa.</div>
                  </div>
                </div>
              </div>

              <div className="about-section">
                <h3>Backed by Vision</h3>
                <div className="funding-card">
                  <div className="funding-label">Investor Relations</div>
                  <div className="funding-title">Seeking Pre-Seed Funding</div>
                  <div className="funding-text">
                    BreatheFree is actively pursuing pre-seed investment from mission-aligned venture capital firms and accelerators. We are targeting Y Combinator's next cohort and engaging a select group of healthcare-focused VCs who understand the scale of the tobacco cessation opportunity across Sub-Saharan Africa — an estimated 80 million smokers, largely underserved by digital health tools.
                  </div>
                  <div className="investor-badges">
                    <span className="inv-badge">Y Combinator — Applicant</span>
                    <span className="inv-badge">Pre-Seed Round Open</span>
                    <span className="inv-badge">East Africa · HealthTech</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
