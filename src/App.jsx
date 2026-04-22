import { useState, useMemo, useRef, useEffect } from "react";

// ─── Ambit Design Tokens ─────────────────────────────
const T = {
  primary:    "#AAA0FF",
  secondary:  "#D4CFFF",
  tertiary:   "#EAE7FF",
  ink:        "#191919",
  night:      "#0A0A0A",
  paper:      "#FFFFFF",
  paper2:     "#FAFAFF",
  inkSoft:    "#2E2E2E",
  inkMute:    "rgba(25,25,25,0.62)",
  inkFaint:   "rgba(25,25,25,0.10)",
  inkHair:    "rgba(25,25,25,0.06)",
  deepLav:    "#4A40A0",
  // Semantic
  green:      "#2D6A4F",
  greenSoft:  "#E8F3EE",
  amber:      "#B45309",
  amberSoft:  "#FFF4E0",
  red:        "#9A1E2C",
  redSoft:    "#FBE6E9",
  blue:       "#1E3A8A",
  blueSoft:   "#E4E8F7",
  // Type stacks
  serif:  "'Fraunces', Georgia, 'Times New Roman', serif",
  sans:   "'Geist', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono:   "'Geist Mono', 'Courier New', monospace",
};

const MUST_WINS = [
  { key: "1", label: "Accelerate Market Adoption",
    full: "Accelerate Market Adoption Through Seamless Integration into Existing Workflows",
    color: "#4A40A0", soft: "#EAE7FF" },
  { key: "2", label: "Build Practitioner Confidence",
    full: "Build Strong Practitioner Confidence with Clear Guidance, Trusted Voices & Reproducible Results",
    color: "#1E2A56", soft: "#E4E8F7" },
  { key: "3", label: "Differentiate the Offering",
    full: "Differentiate the Offering as the Category Leader for Quality of Outcomes",
    color: "#0D4A54", soft: "#DCEEEF" },
  { key: "4", label: "Ensure Launch Readiness",
    full: "Ensure Full Launch Readiness Through Strong Field Preparedness and Execution",
    color: "#8A3B2E", soft: "#F7E2DC" },
  { key: "5", label: "Own the Launch Moment",
    full: "Own the Launch Moment With Unmatched Buzz and Convert Consumer Interest into Trial",
    color: "#2D5A3C", soft: "#DFEBDF" },
];

const STATUS_OPTIONS = ["Not Started", "On Track", "At Risk", "Delayed", "Completed", "TBC"];
const PRIORITY_OPTIONS = ["High", "Med", "Low", "TBC"];

const STATUS_COLORS = {
  "Not Started": { bg: T.paper2,   text: T.inkSoft, dot: "#9E9AB8", ring: T.inkFaint },
  "On Track":    { bg: T.greenSoft,text: T.green,   dot: T.green,   ring: "rgba(45,106,79,0.24)" },
  "At Risk":     { bg: T.amberSoft,text: T.amber,   dot: T.amber,   ring: "rgba(180,83,9,0.24)" },
  "Delayed":     { bg: T.redSoft,  text: T.red,     dot: T.red,     ring: "rgba(154,30,44,0.24)" },
  "Completed":   { bg: T.tertiary, text: T.deepLav, dot: T.deepLav, ring: "rgba(74,64,160,0.24)" },
  "TBC":         { bg: T.paper2,   text: T.inkMute, dot: "#C8C3E6", ring: T.inkFaint },
};

const PRIORITY_COLORS = {
  High: { c: T.red,     bg: T.redSoft },
  Med:  { c: T.amber,   bg: T.amberSoft },
  Low:  { c: T.green,   bg: T.greenSoft },
  TBC:  { c: T.deepLav, bg: T.tertiary },
};

// ─── Generic Demo Dataset ────────────────────────────
const INITIAL_TACTICS = [
  { id:1,  mustWinKey:"1", initiative:"Commercial Economics & Profitability", activity:"Business Growth Webinar", details:"Scope dependent on field strategy decisions.", deliverables:"Webinar", dependencies:"Pending funding", responsibleFunction:"Field Enablement", responsibleMember:"M.W.", consultedFunction:"Marketing", consultedMember:"A.M., C.D.", fundedBy:"Field Enablement", agencyPartner:"TBC", startDate:"2026-04-01", endDate:"2026-05-01", priority:"Med", status:"Not Started", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:2,  mustWinKey:"1", initiative:"Portfolio Integration & Positioning", activity:"Portfolio Practitioner Sales Aid", details:"Funded; print refresh planned at launch window.", deliverables:"Digital & printed practitioner sales aid", dependencies:"Launch assets; before-and-after shoot", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Accounts, Training, Sales", consultedMember:"V.L., K.O., J.P.", fundedBy:"Marketing", agencyPartner:"Creative Studio", startDate:"2025-12-19", endDate:"2026-03-16", priority:"High", status:"On Track", milestones:"", recentAccomplishments:"Round 1 delivered week of Dec 15", riskMitigation:"" },
  { id:3,  mustWinKey:"1", initiative:"Commercial Economics & Profitability", activity:"Practice Support Checklist", details:"Leave-behind brochure to support adoption.", deliverables:"Printed leave-behind", dependencies:"Advisory board insights", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Field Enablement, Sales", consultedMember:"M.W., J.P.", fundedBy:"Marketing", agencyPartner:"Creative Studio", startDate:"2026-02-01", endDate:"2026-04-01", priority:"Low", status:"Not Started", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:4,  mustWinKey:"1", initiative:"Commercial Economics & Profitability", activity:"Profitability Talk-Track & Leave-Behind", details:"Support field with profitability messaging.", deliverables:"Printed leave-behind", dependencies:"", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Sales, Training", consultedMember:"J.P., K.O.", fundedBy:"Marketing", agencyPartner:"Creative Studio", startDate:"2026-02-01", endDate:"2026-04-01", priority:"Med", status:"Not Started", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:5,  mustWinKey:"1", initiative:"In-Practice Activation", activity:"In-Office Pull-Through Kit", details:"Prioritize assets available for Q1 pull-through.", deliverables:"Patient brochure, before-and-afters, social assets", dependencies:"Funding; patient brochure aligned with sample drop", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Accounts, Training, Sales", consultedMember:"V.L., K.O., J.P.", fundedBy:"Marketing", agencyPartner:"Creative Studio", startDate:"2026-01-05", endDate:"2026-03-08", priority:"Med", status:"Not Started", milestones:"Kickoff early January", recentAccomplishments:"", riskMitigation:"" },
  { id:6,  mustWinKey:"1", initiative:"Portfolio Integration & Positioning", activity:"Portfolio Awareness In-Office Pull-Through", details:"Prioritize Q1 in-office assets for portfolio awareness.", deliverables:"Launch-aligned portfolio assets", dependencies:"Pending funding", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Accounts, Training, Sales", consultedMember:"V.L., K.O., J.P.", fundedBy:"Marketing", agencyPartner:"Creative Studio", startDate:"2026-01-05", endDate:"2026-05-01", priority:"Med", status:"Not Started", milestones:"Kickoff early January", recentAccomplishments:"", riskMitigation:"" },
  { id:7,  mustWinKey:"2", initiative:"Practitioner Product Belief", activity:"In-Office Technique Training", details:"Field rollout after train-the-trainer.", deliverables:"Training module", dependencies:"Train-the-trainer", responsibleFunction:"Field Enablement", responsibleMember:"K.O.", consultedFunction:"Marketing", consultedMember:"A.M., C.D.", fundedBy:"Field Enablement", agencyPartner:"", startDate:"2026-01-01", endDate:"2026-05-01", priority:"High", status:"Not Started", milestones:"Train-the-trainer", recentAccomplishments:"", riskMitigation:"" },
  { id:8,  mustWinKey:"2", initiative:"Training, Mastery & Technique", activity:"Practitioner Training Content Development", details:"", deliverables:"", dependencies:"User personas feed into content development", responsibleFunction:"Field Enablement", responsibleMember:"", consultedFunction:"", consultedMember:"", fundedBy:"", agencyPartner:"", startDate:"", endDate:"", priority:"", status:"TBC", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:9,  mustWinKey:"2", initiative:"Practitioner Product Belief", activity:"Practitioner Webinar", details:"Scope dependent on field strategy decisions.", deliverables:"Webinar", dependencies:"", responsibleFunction:"Field Enablement", responsibleMember:"K.O.", consultedFunction:"Marketing", consultedMember:"A.M., C.D.", fundedBy:"Field Enablement", agencyPartner:"", startDate:"2026-04-01", endDate:"2026-06-01", priority:"Med", status:"Not Started", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:10, mustWinKey:"2", initiative:"Training, Mastery & Technique", activity:"Lunch & Learn Deck", details:"Presentation of the practitioner brochure.", deliverables:"Presentation deck", dependencies:"Practitioner brochure", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Field Enablement, Medical Affairs, Training", consultedMember:"K.O., B.S., J.P.", fundedBy:"Marketing", agencyPartner:"Creative Studio", startDate:"2026-01-05", endDate:"2026-02-09", priority:"High", status:"Not Started", milestones:"Kickoff in January", recentAccomplishments:"", riskMitigation:"" },
  { id:11, mustWinKey:"2", initiative:"Practitioner Product Belief", activity:"Q1 Execution Advisory Board", details:"In development.", deliverables:"Advisory board readout", dependencies:"", responsibleFunction:"Field Enablement", responsibleMember:"K.O.", consultedFunction:"Marketing", consultedMember:"A.M., C.D.", fundedBy:"Field Enablement", agencyPartner:"", startDate:"2025-12-19", endDate:"2026-01-09", priority:"High", status:"Completed", milestones:"", recentAccomplishments:"Readout circulated Jan 12", riskMitigation:"" },
  { id:12, mustWinKey:"2", initiative:"Training, Mastery & Technique", activity:"Practitioner Brochure", details:"Details product anatomy and clinical before-and-afters.", deliverables:"Digital & print brochure", dependencies:"Core claims and anatomical drawings", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Field Enablement, Medical Affairs, Training", consultedMember:"K.O., B.S., J.P.", fundedBy:"Marketing", agencyPartner:"Creative Studio", startDate:"2025-12-19", endDate:"2026-02-09", priority:"High", status:"Completed", milestones:"Show status at in-person meeting", recentAccomplishments:"Final print-ready files approved Feb 9", riskMitigation:"" },
  { id:13, mustWinKey:"2", initiative:"Clinical Education & Differentiation", activity:"Injection Technique Video", details:"Video assets planned for post-launch.", deliverables:"Video", dependencies:"Regulatory approval", responsibleFunction:"Field Enablement", responsibleMember:"K.O.", consultedFunction:"Marketing, Medical Affairs", consultedMember:"A.M., C.D., B.S., M.R.", fundedBy:"Field Enablement", agencyPartner:"TBC", startDate:"", endDate:"2026-05-01", priority:"TBC", status:"TBC", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:14, mustWinKey:"2", initiative:"Practitioner Product Belief", activity:"Launch Practitioner Promotion", details:"Q1 hero-SKU promotion and launch communications.", deliverables:"Launch promotion", dependencies:"Alignment on activation plan", responsibleFunction:"Commercial Ops", responsibleMember:"K.F., M.H.", consultedFunction:"Marketing, Training, Sales", consultedMember:"A.M., C.D., J.P.", fundedBy:"Commercial Ops", agencyPartner:"Activation Partner", startDate:"2025-12-19", endDate:"2026-03-08", priority:"TBC", status:"TBC", milestones:"Feb 9 in-person presentation", recentAccomplishments:"Scenario modeling complete", riskMitigation:"" },
  { id:15, mustWinKey:"2", initiative:"Training, Mastery & Technique", activity:"Delivery Device Demo Video", details:"Focused on device usage and best practice.", deliverables:"", dependencies:"", responsibleFunction:"", responsibleMember:"", consultedFunction:"", consultedMember:"", fundedBy:"", agencyPartner:"", startDate:"", endDate:"", priority:"", status:"", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:16, mustWinKey:"2", initiative:"Training, Mastery & Technique", activity:"Tactile Delivery Demo Kit", details:"Training pad, sample syringes, rep guide.", deliverables:"Physical kit", dependencies:"Pending funding", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Field Enablement, Medical Affairs, Training", consultedMember:"K.O., B.S., J.P.", fundedBy:"Marketing", agencyPartner:"Creative Studio", startDate:"2026-01-05", endDate:"2026-03-08", priority:"Med", status:"Not Started", milestones:"Kickoff in January", recentAccomplishments:"", riskMitigation:"" },
  { id:17, mustWinKey:"3", initiative:"Clinical Education & Differentiation", activity:"Dynamic Before-and-After Imagery", details:"Images funded in prior year budget.", deliverables:"Before-and-after imagery", dependencies:"Photoshoot schedule", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Medical Affairs", consultedMember:"M.R.", fundedBy:"Marketing", agencyPartner:"Production Partner", startDate:"2025-12-19", endDate:"2026-03-16", priority:"High", status:"Completed", milestones:"", recentAccomplishments:"Final image set delivered Mar 14", riskMitigation:"" },
  { id:18, mustWinKey:"3", initiative:"Practitioner Engagement", activity:"Early Experience Program", details:"Kit design, sample allocation, targeting.", deliverables:"Sample kit, target list", dependencies:"Box design; sample budget; product availability", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Thought-Leader Engagement, Accounts, Field Enablement, Supply, Sales, Training", consultedMember:"K.T., V.L., K.O., K.N., J.P.", fundedBy:"Marketing", agencyPartner:"TBD", startDate:"2025-12-01", endDate:"2026-03-08", priority:"High", status:"Completed", milestones:"", recentAccomplishments:"Kits shipped to target practices wk of Mar 8", riskMitigation:"" },
  { id:19, mustWinKey:"3", initiative:"Purchase Enablement", activity:"Purchase Enablement Module", details:"Launch requirement module; execution pending.", deliverables:"Module on field enablement platform", dependencies:"Development time", responsibleFunction:"Field Enablement", responsibleMember:"B.S., C.V.", consultedFunction:"Marketing, Comm. Excellence, Training", consultedMember:"A.M., J.P., C.D., K.G.", fundedBy:"Field Enablement", agencyPartner:"TBC", startDate:"2025-12-01", endDate:"2026-03-08", priority:"High", status:"TBC", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:20, mustWinKey:"3", initiative:"Clinical Education & Differentiation", activity:"Unmet Need Video", details:"Education on the underlying science and patient need.", deliverables:"Video", dependencies:"Review committee approval", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Product, Medical Affairs, Field Enablement", consultedMember:"C.R., M.R., B.S., K.O.", fundedBy:"Marketing", agencyPartner:"Digital Studio", startDate:"2026-01-05", endDate:"2026-03-08", priority:"Med", status:"Not Started", milestones:"Kickoff in January", recentAccomplishments:"", riskMitigation:"" },
  { id:21, mustWinKey:"4", initiative:"Field Activation & Execution", activity:"Account Targeting", details:"Sales targets.", deliverables:"", dependencies:"", responsibleFunction:"Sales", responsibleMember:"", consultedFunction:"TBC", consultedMember:"", fundedBy:"", agencyPartner:"", startDate:"2026-03-01", endDate:"", priority:"", status:"TBC", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:22, mustWinKey:"4", initiative:"Field Training & Readiness", activity:"Medical Affairs Routing Guide", details:"Guidance for routing inquiries and off-label questions.", deliverables:"Routing guide", dependencies:"", responsibleFunction:"Medical Affairs", responsibleMember:"M.R.", consultedFunction:"Field Enablement, Marketing, Sales, Training", consultedMember:"A.M., C.D., B.S., K.O., J.P.", fundedBy:"TBC", agencyPartner:"TBC", startDate:"", endDate:"2026-03-08", priority:"Med", status:"Not Started", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:23, mustWinKey:"4", initiative:"Field Activation & Execution", activity:"Objection Handler", details:"Support field with objection handling.", deliverables:"Digital one-pager", dependencies:"", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Sales, Field Enablement, Medical Affairs, Training", consultedMember:"J.P., K.O., B.S.", fundedBy:"Marketing", agencyPartner:"Creative Studio", startDate:"2026-01-05", endDate:"2026-03-08", priority:"Med", status:"Not Started", milestones:"Kickoff in January", recentAccomplishments:"", riskMitigation:"" },
  { id:24, mustWinKey:"4", initiative:"Field Training & Readiness", activity:"Learning Pathway Module", details:"", deliverables:"", dependencies:"", responsibleFunction:"", responsibleMember:"", consultedFunction:"", consultedMember:"", fundedBy:"", agencyPartner:"", startDate:"", endDate:"", priority:"", status:"TBC", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:25, mustWinKey:"4", initiative:"Field Training & Readiness", activity:"CRM Targeting Setup", details:"", deliverables:"", dependencies:"", responsibleFunction:"", responsibleMember:"", consultedFunction:"", consultedMember:"", fundedBy:"", agencyPartner:"", startDate:"", endDate:"", priority:"", status:"TBC", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:26, mustWinKey:"4", initiative:"Field Training & Readiness", activity:"Sales Execution Guide & Training", details:"Sales training strategy to support launch.", deliverables:"Training plan, assets, sales execution guide", dependencies:"Review committee approval", responsibleFunction:"Training", responsibleMember:"J.P.", consultedFunction:"Marketing, Sales", consultedMember:"A.M., C.D., J.P.", fundedBy:"Marketing", agencyPartner:"TBD", startDate:"2026-01-05", endDate:"2026-03-08", priority:"High", status:"Not Started", milestones:"Feb 9 presentation", recentAccomplishments:"", riskMitigation:"" },
  { id:27, mustWinKey:"5", initiative:"Consumer Awareness & Demand", activity:"Approval Press Release", details:"", deliverables:"", dependencies:"", responsibleFunction:"Corporate Comms", responsibleMember:"", consultedFunction:"", consultedMember:"", fundedBy:"", agencyPartner:"", startDate:"", endDate:"", priority:"", status:"TBC", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:28, mustWinKey:"5", initiative:"Consumer Awareness & Demand", activity:"Approval Social Media Posts", details:"", deliverables:"", dependencies:"", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"", consultedMember:"", fundedBy:"", agencyPartner:"", startDate:"", endDate:"", priority:"", status:"TBC", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:29, mustWinKey:"5", initiative:"Consumer Awareness & Demand", activity:"Consumer Events & Activation", details:"Consumer activation post-launch.", deliverables:"Events and activation", dependencies:"Launch", responsibleFunction:"Consumer Activation", responsibleMember:"R.M.", consultedFunction:"Marketing", consultedMember:"A.M., C.D.", fundedBy:"Marketing", agencyPartner:"TBD", startDate:"2026-04-15", endDate:"2026-07-01", priority:"Low", status:"Not Started", milestones:"", recentAccomplishments:"", riskMitigation:"Not yet funded" },
  { id:30, mustWinKey:"5", initiative:"Consumer Awareness & Demand", activity:"Paid Media", details:"Support owning the launch moment.", deliverables:"Advertising, articles", dependencies:"Launch", responsibleFunction:"Consumer Activation", responsibleMember:"R.M.", consultedFunction:"Marketing", consultedMember:"A.M., C.D.", fundedBy:"Marketing", agencyPartner:"Media Agency", startDate:"2026-03-08", endDate:"2026-07-01", priority:"Low", status:"Not Started", milestones:"", recentAccomplishments:"", riskMitigation:"" },
  { id:31, mustWinKey:"5", initiative:"Consumer Insights & Targeting", activity:"Persona Profiling & Segmentation", details:"Identify ideal target and inform target list.", deliverables:"Report, ideal persona, target list inputs", dependencies:"Target list inputs for Comm. Excellence", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Market Research", consultedMember:"M.T.", fundedBy:"Marketing", agencyPartner:"Research Partner", startDate:"2025-12-15", endDate:"2026-01-31", priority:"Med", status:"Completed", milestones:"", recentAccomplishments:"Final personas circulated Jan 30", riskMitigation:"" },
  { id:32, mustWinKey:"5", initiative:"Consumer Awareness & Demand", activity:"Pre-Launch Consumer Campaign", details:"Education driving early consumer demand.", deliverables:"Campaign materials", dependencies:"Consumer insights; timing pre-launch; review approval", responsibleFunction:"Consumer Activation", responsibleMember:"R.M.", consultedFunction:"Marketing", consultedMember:"A.M., C.D.", fundedBy:"Marketing", agencyPartner:"TBD", startDate:"2025-12-15", endDate:"2026-03-08", priority:"High", status:"At Risk", milestones:"Review committee concept review (wk of Dec 15)", recentAccomplishments:"", riskMitigation:"Decision required soon" },
  { id:33, mustWinKey:"5", initiative:"Consumer Insights & Targeting", activity:"Pre-Launch Consumer Research", details:"In conjunction with activation survey and email.", deliverables:"Report, consumer target profile", dependencies:"Review committee approval", responsibleFunction:"Marketing", responsibleMember:"A.M., C.D.", consultedFunction:"Commercial Ops", consultedMember:"M.H., K.F., C.Y.", fundedBy:"Commercial Ops", agencyPartner:"Activation Partner", startDate:"2026-01-05", endDate:"2026-02-15", priority:"Med", status:"Completed", milestones:"", recentAccomplishments:"Final research readout Feb 14", riskMitigation:"" },
  { id:34, mustWinKey:"5", initiative:"Consumer Awareness & Demand", activity:"Website Refresh", details:"Updated website aligned with launch branding.", deliverables:"Website", dependencies:"Launch", responsibleFunction:"Consumer Activation", responsibleMember:"R.M.", consultedFunction:"Marketing", consultedMember:"A.M., C.D.", fundedBy:"Marketing", agencyPartner:"Creative Studio", startDate:"2026-03-08", endDate:"2026-04-15", priority:"High", status:"Not Started", milestones:"", recentAccomplishments:"", riskMitigation:"" },
];

// ─── Utility Components ──────────────────────────────
const StatusBadge = ({ status, small }) => {
  const s = STATUS_COLORS[status] || STATUS_COLORS["TBC"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: small ? "2px 8px" : "4px 10px",
      borderRadius: 999, background: s.bg, color: s.text,
      fontSize: small ? 10.5 : 11.5, fontWeight: 500,
      letterSpacing: 0.2, whiteSpace: "nowrap",
      border: `1px solid ${s.ring}`, fontFamily: T.sans,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status || "—"}
    </span>
  );
};

const PriorityTag = ({ priority }) => {
  const p = PRIORITY_COLORS[priority];
  if (!p) return <span style={{ color: T.inkMute, fontSize: 12 }}>—</span>;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "2px 8px", borderRadius: 4, background: p.bg,
      color: p.c, fontSize: 11, fontWeight: 600,
      fontFamily: T.mono, letterSpacing: 0.3, textTransform: "uppercase",
    }}>
      {priority}
    </span>
  );
};

const MWTag = ({ mwKey, size = "sm" }) => {
  const mw = MUST_WINS.find(m => m.key === mwKey);
  if (!mw) return null;
  const large = size === "md";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: large ? 32 : 26, height: large ? 22 : 18,
      padding: "0 6px", borderRadius: 4,
      background: mw.color, color: "#fff",
      fontSize: large ? 11 : 10, fontWeight: 600,
      fontFamily: T.mono, letterSpacing: 0.6,
    }}>
      MW{mw.key}
    </span>
  );
};

// ─── Donut Chart ─────────────────────────────────────
function Donut({ size = 140, stroke = 16, segments, centerLabel, centerSub, trackColor }) {
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, seg) => s + (seg.value || 0), 0);
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke={trackColor || T.inkHair}
        strokeWidth={stroke}
      />
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {segments.map((seg, i) => {
          if (!total || !seg.value) return null;
          const len = circumference * (seg.value / total);
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${circumference - len}`}
              strokeDashoffset={-offset}
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            >
              <title>{`${seg.label}: ${seg.value}`}</title>
            </circle>
          );
          offset += len;
          return el;
        })}
      </g>
      {centerLabel !== undefined && (
        <text
          x={cx} y={centerSub !== undefined ? cy - size * 0.06 : cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={T.serif}
          fontSize={size * 0.28}
          fontWeight={400}
          fill={T.ink}
          style={{ letterSpacing: -0.8 }}
        >
          {centerLabel}
        </text>
      )}
      {centerSub !== undefined && (
        <text
          x={cx} y={cy + size * 0.15}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={T.mono}
          fontSize={Math.max(8, size * 0.065)}
          fill={T.inkMute}
          style={{ letterSpacing: 0.8 }}
        >
          {String(centerSub).toUpperCase()}
        </text>
      )}
    </svg>
  );
}

// ─── Dashboard View ───────────────────────────────────
function DashboardView({ tactics, onDrill }) {
  const statusCounts = useMemo(() => {
    const c = {};
    STATUS_OPTIONS.forEach(s => c[s] = 0);
    tactics.forEach(t => { if (c[t.status] !== undefined) c[t.status]++; else c["TBC"]++; });
    return c;
  }, [tactics]);

  const total = tactics.length;
  const inFlight  = statusCounts["On Track"] + statusCounts["At Risk"] + statusCounts["Delayed"];
  const flagged   = statusCounts["At Risk"] + statusCounts["Delayed"];
  const pctOnTrack = total ? Math.round(((statusCounts["On Track"] + statusCounts["Completed"]) / total) * 100) : 0;

  const priorityCounts = useMemo(() => {
    const c = { High: 0, Med: 0, Low: 0, TBC: 0 };
    tactics.forEach(t => {
      const p = t.priority && PRIORITY_COLORS[t.priority] ? t.priority : "TBC";
      c[p]++;
    });
    return c;
  }, [tactics]);

  const mwStats = useMemo(() => {
    return MUST_WINS.map(mw => {
      const items = tactics.filter(t => t.mustWinKey === mw.key);
      const counts = {};
      STATUS_OPTIONS.forEach(s => counts[s] = 0);
      items.forEach(t => { if (counts[t.status] !== undefined) counts[t.status]++; else counts["TBC"]++; });
      const health = counts["At Risk"] > 0 || counts["Delayed"] > 0
        ? "At Risk"
        : counts["On Track"] > 0 || counts["Completed"] > 0 ? "On Track" : "Not Started";
      const progressable = items.filter(t => t.status && t.status !== "TBC" && t.status !== "Not Started").length;
      const pct = items.length ? Math.round((progressable / items.length) * 100) : 0;
      const completePct = items.length ? Math.round((counts["Completed"] / items.length) * 100) : 0;
      return { ...mw, items: items.length, counts, health, pct, completePct };
    });
  }, [tactics]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Editorial hero */}
      <section style={{
        background: T.night, color: "#fff", borderRadius: 20, padding: "32px 36px 28px",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{
          position: "absolute", right: -80, top: -60, width: 340, height: 340, borderRadius: "50%",
          background: `radial-gradient(circle at center, ${T.primary}33, transparent 70%)`, pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 2.4, color: T.primary, textTransform: "uppercase", marginBottom: 14 }}>
              Launch Portfolio · H1 2026
            </div>
            <h2 style={{
              fontFamily: T.serif, fontSize: 44, lineHeight: 1.05, margin: 0, fontWeight: 400,
              letterSpacing: -1.2, color: "#fff",
            }}>
              Five must-wins.{" "}
              <em style={{ fontStyle: "italic", color: T.primary, fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
                One launch.
              </em>
            </h2>
            <p style={{ marginTop: 14, fontSize: 13.5, color: "rgba(255,255,255,0.66)", lineHeight: 1.55, maxWidth: 480 }}>
              A single view of every activity, owner, and milestone from pre-launch through market activation.
            </p>
          </div>

          {/* Stat rail */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: 28, alignItems: "end" }}>
            {[
              { n: total, label: "Activities" },
              { n: inFlight, label: "In flight" },
              { n: flagged, label: "Flagged", tint: flagged > 0 ? T.primary : "#fff" },
              { n: `${pctOnTrack}%`, label: "On-track or done" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: T.serif, fontSize: 40, lineHeight: 1, fontWeight: 400,
                  color: s.tint || "#fff", letterSpacing: -1,
                }}>{s.n}</div>
                <div style={{
                  fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6,
                  color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginTop: 8,
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio bar */}
        <div style={{ marginTop: 26 }}>
          <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", background: "rgba(255,255,255,0.08)" }}>
            {["Completed", "On Track", "At Risk", "Delayed", "Not Started", "TBC"].map(s => {
              const pct = total ? (statusCounts[s] / total) * 100 : 0;
              if (pct === 0) return null;
              return <div key={s} title={`${s}: ${statusCounts[s]}`}
                style={{ width: `${pct}%`, background: STATUS_COLORS[s].dot, transition: "width 0.4s" }} />;
            })}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 14 }}>
            {STATUS_OPTIONS.map(s => (
              <span key={s} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: T.sans,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLORS[s].dot }} />
                {s} <span style={{ color: "#fff", fontWeight: 600 }}>{statusCounts[s]}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* At a glance — donut charts */}
      <section>
        <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 400, margin: 0, color: T.ink, letterSpacing: -0.4 }}>
            At a glance <em style={{ color: T.inkMute, fontSize: 14, marginLeft: 8 }}>portfolio breakdown</em>
          </h3>
          <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.inkMute, letterSpacing: 1.6, textTransform: "uppercase" }}>
            {total} activities
          </span>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {/* Activities by Must-Win */}
          <div style={{
            background: T.paper, borderRadius: 16, border: `1px solid ${T.inkFaint}`,
            padding: "22px 24px",
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8,
              color: T.inkMute, textTransform: "uppercase", marginBottom: 16,
            }}>
              Activities by Must-Win
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Donut
                size={140} stroke={18}
                segments={mwStats.map(mw => ({
                  label: `MW${mw.key}`, value: mw.items, color: mw.color,
                }))}
                centerLabel={total}
                centerSub="Activities"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {mwStats.map(mw => (
                  <div key={mw.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: mw.color, flexShrink: 0 }} />
                    <span style={{ color: T.inkSoft, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      <span style={{ fontFamily: T.mono, color: T.ink, fontWeight: 500, marginRight: 6 }}>MW{mw.key}</span>
                      {mw.label}
                    </span>
                    <span style={{ fontFamily: T.mono, fontWeight: 600, color: T.ink, fontVariantNumeric: "tabular-nums" }}>{mw.items}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status donut */}
          <div style={{
            background: T.paper, borderRadius: 16, border: `1px solid ${T.inkFaint}`,
            padding: "22px 24px",
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8,
              color: T.inkMute, textTransform: "uppercase", marginBottom: 16,
            }}>
              Status mix
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Donut
                size={140} stroke={18}
                segments={STATUS_OPTIONS.map(s => ({
                  label: s, value: statusCounts[s], color: STATUS_COLORS[s].dot,
                }))}
                centerLabel={total}
                centerSub="Activities"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                {STATUS_OPTIONS.map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLORS[s].dot, flexShrink: 0 }} />
                    <span style={{ color: T.inkSoft, flex: 1 }}>{s}</span>
                    <span style={{ fontFamily: T.mono, fontWeight: 600, color: T.ink, fontVariantNumeric: "tabular-nums" }}>{statusCounts[s]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Priority donut */}
          <div style={{
            background: T.paper, borderRadius: 16, border: `1px solid ${T.inkFaint}`,
            padding: "22px 24px",
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 10, letterSpacing: 1.8,
              color: T.inkMute, textTransform: "uppercase", marginBottom: 16,
            }}>
              Priority mix
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Donut
                size={140} stroke={18}
                segments={["High", "Med", "Low", "TBC"].map(p => ({
                  label: p, value: priorityCounts[p], color: PRIORITY_COLORS[p].c,
                }))}
                centerLabel={priorityCounts.High}
                centerSub="High priority"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {["High", "Med", "Low", "TBC"].map(p => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: PRIORITY_COLORS[p].c, flexShrink: 0 }} />
                    <span style={{ color: T.inkSoft, flex: 1 }}>{p}</span>
                    <span style={{ fontFamily: T.mono, fontWeight: 600, color: T.ink, fontVariantNumeric: "tabular-nums" }}>{priorityCounts[p]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Must Win Grid */}
      <section>
        <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 400, margin: 0, color: T.ink, letterSpacing: -0.4 }}>
            Must-Wins <em style={{ color: T.inkMute, fontSize: 14, marginLeft: 8 }}>by health</em>
          </h3>
          <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.inkMute, letterSpacing: 1.6, textTransform: "uppercase" }}>
            Click a card to filter
          </span>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {mwStats.map(mw => (
            <button
              key={mw.key}
              onClick={() => onDrill?.(mw.key)}
              style={{
                background: T.paper, borderRadius: 16, border: `1px solid ${T.inkFaint}`,
                padding: 0, overflow: "hidden", cursor: "pointer", textAlign: "left",
                transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                fontFamily: T.sans,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 12px 28px -12px ${T.primary}55`;
                e.currentTarget.style.borderColor = T.secondary;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = T.inkFaint;
              }}
            >
              {/* Color band */}
              <div style={{ height: 4, background: mw.color }} />

              <div style={{ padding: "18px 20px 16px" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                      <MWTag mwKey={mw.key} size="md" />
                      <StatusBadge status={mw.health} small />
                    </div>
                    <h4 style={{
                      fontFamily: T.serif, fontSize: 18, fontWeight: 400, margin: 0, lineHeight: 1.25,
                      color: T.ink, letterSpacing: -0.2,
                    }}>
                      {mw.label}
                    </h4>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <Donut
                      size={72} stroke={8}
                      segments={[
                        { label: "Completed", value: mw.counts["Completed"], color: mw.color },
                        { label: "Remaining", value: Math.max(0, mw.items - mw.counts["Completed"]), color: T.inkHair },
                      ]}
                      trackColor={T.inkHair}
                      centerLabel={`${mw.completePct}%`}
                    />
                    <div style={{
                      fontFamily: T.mono, fontSize: 9.5, color: T.inkMute,
                      letterSpacing: 1.2, textTransform: "uppercase", marginTop: 6,
                    }}>
                      {mw.items} act.
                    </div>
                  </div>
                </div>

                {/* Segmented bar */}
                <div style={{ marginTop: 18 }}>
                  <div style={{
                    display: "flex", height: 6, borderRadius: 3, overflow: "hidden", background: T.tertiary,
                  }}>
                    {["Completed", "On Track", "At Risk", "Delayed", "Not Started", "TBC"].map(s => {
                      const pct = mw.items > 0 ? (mw.counts[s] / mw.items) * 100 : 0;
                      if (pct === 0) return null;
                      return <div key={s} style={{ width: `${pct}%`, background: STATUS_COLORS[s].dot }} />;
                    })}
                  </div>
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 12,
                  }}>
                    {["On Track", "At Risk", "Not Started", "Completed", "Delayed", "TBC"].map(s => (
                      <span key={s} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        fontSize: 11, color: T.inkSoft, fontFamily: T.sans,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLORS[s].dot }} />
                        <span style={{ color: T.inkMute }}>{s}</span>
                        <span style={{ marginLeft: "auto", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: T.ink }}>
                          {mw.counts[s]}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Editable Cell ──────────────────────────────────
function EditableCell({ value, onChange, type = "text", options = [], style = {} }) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const ref = useRef(null);

  useEffect(() => { setTemp(value); }, [value]);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  const focusStyle = { borderColor: T.primary, boxShadow: `0 0 0 3px ${T.tertiary}` };

  if (type === "select") {
    return (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: "transparent", border: `1px solid transparent`, borderRadius: 6,
          fontSize: 12, padding: "4px 6px", cursor: "pointer", color: T.ink, width: "100%",
          fontFamily: T.sans, outline: "none", transition: "all 0.15s", ...style,
        }}
        onFocus={e => Object.assign(e.target.style, focusStyle)}
        onBlur={e => { e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "none"; }}
      >
        <option value="">—</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (type === "date") {
    return (
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: "transparent", border: `1px solid transparent`, borderRadius: 6,
          fontSize: 12, padding: "4px 6px", width: "100%",
          fontFamily: T.mono, color: T.ink, outline: "none", transition: "all 0.15s", ...style,
        }}
        onFocus={e => Object.assign(e.target.style, focusStyle)}
        onBlur={e => { e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "none"; }}
      />
    );
  }

  if (!editing) {
    return (
      <div
        onClick={() => setEditing(true)}
        style={{
          cursor: "text", minHeight: 22, padding: "4px 6px", borderRadius: 6,
          border: `1px solid transparent`, fontSize: 12, lineHeight: 1.5,
          color: value ? T.ink : "rgba(25,25,25,0.35)", wordBreak: "break-word",
          fontFamily: T.sans, transition: "all 0.15s", ...style,
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = T.inkFaint}
        onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
      >
        {value || "—"}
      </div>
    );
  }

  return (
    <textarea
      ref={ref}
      value={temp}
      onChange={e => setTemp(e.target.value)}
      onBlur={() => { onChange(temp); setEditing(false); }}
      onKeyDown={e => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onChange(temp); setEditing(false); }
        if (e.key === "Escape") { setTemp(value); setEditing(false); }
      }}
      style={{
        width: "100%", fontSize: 12, padding: "4px 6px", borderRadius: 6,
        border: `1px solid ${T.primary}`, outline: "none", fontFamily: T.sans,
        resize: "vertical", minHeight: 28, lineHeight: 1.5, color: T.ink,
        boxShadow: `0 0 0 3px ${T.tertiary}`, ...style,
      }}
    />
  );
}

// ─── Detail Modal ────────────────────────────────────
function DetailModal({ tactic, onClose, onUpdate }) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!tactic) return null;
  const mw = MUST_WINS.find(m => m.key === tactic.mustWinKey);
  const fieldGroups = [
    { title: "Scope", fields: [["Initiative", "initiative"], ["Details", "details"], ["Deliverables", "deliverables"], ["Dependencies", "dependencies"]] },
    { title: "Ownership", fields: [["Responsible Function", "responsibleFunction"], ["Responsible Member", "responsibleMember"], ["Consulted Function", "consultedFunction"], ["Consulted Member", "consultedMember"], ["Funded By", "fundedBy"], ["Agency Partner", "agencyPartner"]] },
    { title: "Tracking", fields: [["Recent Accomplishments", "recentAccomplishments"], ["Risk Mitigation", "riskMitigation"], ["Milestones", "milestones"]] },
  ];

  return (
    <div
      role="dialog" aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(10,10,10,0.5)", backdropFilter: "blur(6px)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        animation: "ambitFade 0.2s ease",
      }}
    >
      <style>{`@keyframes ambitFade { from { opacity:0; } to { opacity:1; } }
                @keyframes ambitRise { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }`}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.paper, borderRadius: 20, maxWidth: 720, width: "100%",
          maxHeight: "88vh", overflow: "auto", boxShadow: "0 40px 80px -20px rgba(10,10,10,0.4)",
          animation: "ambitRise 0.22s ease",
          border: `1px solid ${T.inkFaint}`,
        }}
      >
        {/* Header */}
        <div style={{
          padding: "26px 28px 22px", background: T.tertiary, position: "relative",
          borderRadius: "20px 20px 0 0",
          borderBottom: `1px solid ${T.inkFaint}`,
        }}>
          <div aria-hidden style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: mw?.color || T.deepLav,
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <MWTag mwKey={tactic.mustWinKey} size="md" />
            <StatusBadge status={tactic.status} />
            <PriorityTag priority={tactic.priority} />
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                marginLeft: "auto", background: "rgba(25,25,25,0.08)", border: "none", color: T.ink,
                borderRadius: 999, width: 32, height: 32, cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.ink + " / 16%"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(25,25,25,0.08)"}
            >
              ✕
            </button>
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.deepLav, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 6 }}>
            Activity · {String(tactic.id).padStart(3, "0")}
          </div>
          <h2 style={{
            fontFamily: T.serif, fontSize: 26, fontWeight: 400, margin: 0, color: T.ink,
            letterSpacing: -0.5, lineHeight: 1.15,
          }}>
            {tactic.activity}
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 28px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
            {[
              ["Status", "status", "select", STATUS_OPTIONS],
              ["Priority", "priority", "select", PRIORITY_OPTIONS],
              ["Start Date", "startDate", "date"],
              ["End Date", "endDate", "date"],
            ].map(([label, key, type, options]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <EditableCell
                  value={tactic[key]} type={type} options={options || []}
                  onChange={v => onUpdate(key, v)}
                  style={{ background: T.paper2, border: `1px solid ${T.inkFaint}`, padding: "6px 8px" }}
                />
              </div>
            ))}
          </div>

          {fieldGroups.map(group => (
            <div key={group.title} style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: T.mono, fontSize: 10, color: T.inkMute, letterSpacing: 2,
                textTransform: "uppercase", paddingBottom: 8, marginBottom: 10,
                borderBottom: `1px solid ${T.inkFaint}`,
              }}>
                {group.title}
              </div>
              {group.fields.map(([label, key]) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>{label}</label>
                  <EditableCell
                    value={tactic[key]} onChange={v => onUpdate(key, v)}
                    style={{ background: T.paper2, borderRadius: 8, padding: "8px 10px" }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 10, fontWeight: 500, color: T.inkMute, textTransform: "uppercase",
  letterSpacing: 1.4, display: "block", marginBottom: 6, fontFamily: T.mono,
};

// ─── Activities Table ────────────────────────────────
function ActivitiesView({ tactics, setTactics, filterMW, filterStatus, search }) {
  const [selectedId, setSelectedId] = useState(null);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    let items = [...tactics];
    if (filterMW !== "all") items = items.filter(t => t.mustWinKey === filterMW);
    if (filterStatus !== "all") items = items.filter(t => t.status === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(t =>
        (t.activity || "").toLowerCase().includes(q) ||
        (t.initiative || "").toLowerCase().includes(q) ||
        (t.responsibleFunction || "").toLowerCase().includes(q) ||
        (t.responsibleMember || "").toLowerCase().includes(q)
      );
    }
    if (sortCol) {
      items.sort((a, b) => {
        const va = a[sortCol] || "";
        const vb = b[sortCol] || "";
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    return items;
  }, [tactics, filterMW, filterStatus, search, sortCol, sortDir]);

  const handleUpdate = (id, field, value) => {
    setTactics(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const selectedTactic = tactics.find(t => t.id === selectedId);

  const handleSort = col => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <span style={{ opacity: 0.25, fontSize: 9 }}>▲▼</span>;
    return <span style={{ fontSize: 10, color: T.deepLav }}>{sortDir === "asc" ? "▲" : "▼"}</span>;
  };

  const thStyle = {
    padding: "14px 14px", textAlign: "left", fontSize: 10, fontWeight: 500, color: T.inkMute,
    textTransform: "uppercase", letterSpacing: 1.6, borderBottom: `1px solid ${T.inkFaint}`,
    cursor: "pointer", userSelect: "none", whiteSpace: "nowrap", position: "sticky", top: 0,
    background: T.paper2, zIndex: 2, fontFamily: T.mono,
  };
  const tdStyle = { padding: "12px 14px", borderBottom: `1px solid ${T.inkHair}`, verticalAlign: "top", fontFamily: T.sans };

  return (
    <>
      <div style={{
        overflowX: "auto", borderRadius: 16, border: `1px solid ${T.inkFaint}`,
        background: T.paper, boxShadow: `0 1px 0 ${T.inkHair}`,
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 52 }}>ID</th>
              <th style={thStyle} onClick={() => handleSort("mustWinKey")}>MW <SortIcon col="mustWinKey" /></th>
              <th style={{ ...thStyle, minWidth: 240 }} onClick={() => handleSort("activity")}>Activity <SortIcon col="activity" /></th>
              <th style={thStyle} onClick={() => handleSort("initiative")}>Initiative <SortIcon col="initiative" /></th>
              <th style={thStyle} onClick={() => handleSort("responsibleFunction")}>Owner <SortIcon col="responsibleFunction" /></th>
              <th style={thStyle} onClick={() => handleSort("status")}>Status <SortIcon col="status" /></th>
              <th style={thStyle} onClick={() => handleSort("priority")}>Priority <SortIcon col="priority" /></th>
              <th style={thStyle} onClick={() => handleSort("startDate")}>Start <SortIcon col="startDate" /></th>
              <th style={thStyle} onClick={() => handleSort("endDate")}>End <SortIcon col="endDate" /></th>
              <th style={{ ...thStyle, width: 52 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ padding: "60px 20px", textAlign: "center" }}>
                  <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, marginBottom: 6, fontWeight: 400 }}>
                    Nothing matches those filters
                  </div>
                  <div style={{ fontSize: 13, color: T.inkMute, fontFamily: T.sans }}>
                    Try clearing your search or choosing a different Must-Win.
                  </div>
                </td>
              </tr>
            )}
            {filtered.map(t => (
              <tr
                key={t.id}
                style={{ transition: "background 0.12s", cursor: "pointer" }}
                onClick={() => setSelectedId(t.id)}
                onMouseEnter={e => e.currentTarget.style.background = T.paper2}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ ...tdStyle, fontFamily: T.mono, fontSize: 11, color: T.inkMute, fontWeight: 500 }}>
                  {String(t.id).padStart(3, "0")}
                </td>
                <td style={tdStyle}><MWTag mwKey={t.mustWinKey} /></td>
                <td style={{ ...tdStyle, fontFamily: T.sans, fontWeight: 500, fontSize: 13, color: T.ink }}>
                  {t.activity}
                </td>
                <td style={{ ...tdStyle, fontSize: 12, color: T.inkSoft }}>{t.initiative || "—"}</td>
                <td style={tdStyle}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: T.ink }}>{t.responsibleFunction || "—"}</div>
                  {t.responsibleMember && (
                    <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, marginTop: 2 }}>
                      {t.responsibleMember}
                    </div>
                  )}
                </td>
                <td style={tdStyle} onClick={e => e.stopPropagation()}>
                  <EditableCell value={t.status} type="select" options={STATUS_OPTIONS}
                    onChange={v => handleUpdate(t.id, "status", v)} />
                </td>
                <td style={tdStyle} onClick={e => e.stopPropagation()}>
                  <EditableCell value={t.priority} type="select" options={PRIORITY_OPTIONS}
                    onChange={v => handleUpdate(t.id, "priority", v)} />
                </td>
                <td style={{ ...tdStyle, fontSize: 12, color: T.inkSoft, whiteSpace: "nowrap", fontFamily: T.mono }}>
                  {t.startDate || <span style={{ color: T.inkMute }}>—</span>}
                </td>
                <td style={{ ...tdStyle, fontSize: 12, color: T.inkSoft, whiteSpace: "nowrap", fontFamily: T.mono }}>
                  {t.endDate || <span style={{ color: T.inkMute }}>—</span>}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedId(t.id); }}
                    aria-label="Open details"
                    style={{
                      background: T.tertiary, border: "none", borderRadius: 8, width: 30, height: 30,
                      cursor: "pointer", fontSize: 14, color: T.deepLav,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.tertiary; e.currentTarget.style.color = T.deepLav; }}
                  >
                    →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: T.mono, fontSize: 11, color: T.inkMute, letterSpacing: 1.2, textTransform: "uppercase",
      }}>
        <span>{filtered.length} of {tactics.length} activities</span>
        <span>Inline-editable · click any row for full detail</span>
      </div>

      {selectedTactic && (
        <DetailModal
          tactic={selectedTactic}
          onClose={() => setSelectedId(null)}
          onUpdate={(field, value) => handleUpdate(selectedTactic.id, field, value)}
        />
      )}
    </>
  );
}

// ─── Gantt Chart View ────────────────────────────────
function GanttView({ tactics, filterMW, filterStatus, search }) {
  const TODAY = new Date("2026-04-22");
  const GANTT_START = new Date("2025-12-01");
  const GANTT_END = new Date("2026-08-01");
  const totalDays = Math.ceil((GANTT_END - GANTT_START) / 86400000);

  const months = useMemo(() => {
    const m = [];
    let d = new Date(GANTT_START);
    while (d < GANTT_END) {
      const start = new Date(d);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const clampEnd = end > GANTT_END ? GANTT_END : end;
      const left = ((start - GANTT_START) / 86400000 / totalDays) * 100;
      const width = (((clampEnd - start) / 86400000 + 1) / totalDays) * 100;
      m.push({
        short: start.toLocaleDateString("en-US", { month: "short" }),
        year: start.getFullYear(),
        left, width,
      });
      d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    }
    return m;
  }, []);

  const todayLeft = ((TODAY - GANTT_START) / 86400000 / totalDays) * 100;

  const filtered = useMemo(() => {
    let items = tactics.filter(t => t.startDate && t.startDate.match(/^\d{4}/));
    if (filterMW !== "all") items = items.filter(t => t.mustWinKey === filterMW);
    if (filterStatus !== "all") items = items.filter(t => t.status === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(t => (t.activity || "").toLowerCase().includes(q));
    }
    return items.sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [tactics, filterMW, filterStatus, search]);

  const ROW = 40;
  const LABEL_W = 300;

  return (
    <div style={{
      borderRadius: 16, border: `1px solid ${T.inkFaint}`, background: T.paper,
      overflow: "hidden",
    }}>
      <div style={{ overflow: "auto", maxHeight: "70vh" }}>
        {/* Month headers */}
        <div style={{
          position: "sticky", top: 0, zIndex: 5, display: "flex", height: 44,
          background: T.night, color: "#fff",
        }}>
          <div style={{
            width: LABEL_W, minWidth: LABEL_W, borderRight: `1px solid rgba(255,255,255,0.08)`,
            display: "flex", alignItems: "center", padding: "0 18px",
            fontFamily: T.mono, fontSize: 10.5, letterSpacing: 2, color: "rgba(255,255,255,0.55)",
            textTransform: "uppercase",
          }}>
            Activity
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            {months.map((m, i) => (
              <div key={i} style={{
                position: "absolute", left: `${m.left}%`, width: `${m.width}%`, height: "100%",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                borderRight: `1px solid rgba(255,255,255,0.08)`,
              }}>
                <span style={{ fontFamily: T.mono, fontSize: 10.5, fontWeight: 500, color: "#fff", letterSpacing: 1.4, textTransform: "uppercase" }}>
                  {m.short}
                </span>
                <span style={{ fontFamily: T.mono, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>
                  {m.year}
                </span>
              </div>
            ))}
            {/* Today line (on header) */}
            <div style={{
              position: "absolute", left: `${todayLeft}%`, top: 0, bottom: 0,
              width: 2, background: T.primary, zIndex: 3,
            }} />
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, marginBottom: 6, fontWeight: 400 }}>
              No activities with dates to display
            </div>
            <div style={{ fontSize: 13, color: T.inkMute, fontFamily: T.sans }}>
              Add a start date to an activity or change your filters.
            </div>
          </div>
        )}

        {/* Rows */}
        <div>
          {filtered.map((t, i) => {
            const start = new Date(t.startDate);
            const end = t.endDate && t.endDate.match(/^\d{4}/)
              ? new Date(t.endDate)
              : new Date(start.getTime() + 30 * 86400000);
            const left = ((start - GANTT_START) / 86400000 / totalDays) * 100;
            const width = Math.max(((end - start) / 86400000 / totalDays) * 100, 0.8);
            const mw = MUST_WINS.find(m => m.key === t.mustWinKey);
            const sc = STATUS_COLORS[t.status] || STATUS_COLORS["TBC"];
            const isPastEnd = end < TODAY && t.status !== "Completed";
            return (
              <div key={t.id} style={{
                display: "flex", height: ROW,
                borderBottom: `1px solid ${T.inkHair}`,
                background: i % 2 === 0 ? T.paper : T.paper2,
              }}>
                <div style={{
                  width: LABEL_W, minWidth: LABEL_W, borderRight: `1px solid ${T.inkHair}`,
                  display: "flex", alignItems: "center", padding: "0 12px 0 16px", gap: 10, overflow: "hidden",
                }}>
                  <MWTag mwKey={t.mustWinKey} />
                  <span style={{
                    fontFamily: T.sans, fontSize: 12.5, fontWeight: 500, color: T.ink,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
                  }}>
                    {t.activity}
                  </span>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  {/* Month grid lines */}
                  {months.map((m, j) => (
                    <div key={j} style={{
                      position: "absolute", left: `${m.left}%`, top: 0, bottom: 0, width: 1,
                      background: T.inkHair,
                    }} />
                  ))}
                  {/* Today line */}
                  <div style={{
                    position: "absolute", left: `${todayLeft}%`, top: 0, bottom: 0, width: 2,
                    background: T.primary, zIndex: 3, opacity: 0.55,
                  }} />
                  {/* Bar */}
                  <div
                    title={`${t.activity}\n${t.startDate} → ${t.endDate || "TBC"}\nStatus: ${t.status || "—"}`}
                    style={{
                      position: "absolute", left: `${Math.max(left, 0)}%`, width: `${width}%`,
                      top: 8, height: 24, borderRadius: 6,
                      background: mw?.color || T.inkSoft,
                      display: "flex", alignItems: "center", paddingLeft: 10, overflow: "hidden",
                      boxShadow: isPastEnd
                        ? `inset 0 0 0 1px ${T.red}, 0 2px 6px -2px rgba(10,10,10,0.25)`
                        : "0 2px 6px -2px rgba(10,10,10,0.2)",
                      cursor: "default", transition: "transform 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scaleY(1.08)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scaleY(1)"}
                  >
                    <span style={{
                      fontFamily: T.sans, fontSize: 10.5, color: "#fff", fontWeight: 500,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: 0.95,
                    }}>
                      {t.activity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        padding: "14px 18px", borderTop: `1px solid ${T.inkFaint}`,
        display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", background: T.paper2,
      }}>
        <span style={{
          fontFamily: T.mono, fontSize: 10, color: T.inkMute, fontWeight: 500,
          letterSpacing: 1.8, textTransform: "uppercase",
        }}>
          Legend
        </span>
        {MUST_WINS.map(mw => (
          <span key={mw.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
            <span style={{ width: 12, height: 8, borderRadius: 2, background: mw.color }} />
            <span style={{ color: T.inkSoft, fontFamily: T.sans }}>
              <span style={{ fontFamily: T.mono, color: T.ink, fontWeight: 500 }}>MW{mw.key}</span>
              {" "}· {mw.label}
            </span>
          </span>
        ))}
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, marginLeft: "auto" }}>
          <span style={{ width: 12, height: 2, background: T.primary }} />
          <span style={{ color: T.deepLav, fontFamily: T.mono, fontWeight: 500, letterSpacing: 1.2, textTransform: "uppercase" }}>
            Today
          </span>
        </span>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────
export default function App() {
  const [tactics, setTactics] = useState(INITIAL_TACTICS);
  const [view, setView] = useState("dashboard");
  const [filterMW, setFilterMW] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const navItems = [
    { v: "dashboard",  label: "Dashboard" },
    { v: "activities", label: "Activities" },
    { v: "gantt",      label: "Timeline" },
  ];

  const handleDrill = (mwKey) => {
    setFilterMW(mwKey);
    setView("activities");
  };

  const lastUpdated = "Apr 22, 2026";

  return (
    <div style={{
      minHeight: "100vh", background: T.paper2, color: T.ink,
      fontFamily: T.sans, fontFeatureSettings: "'ss01'",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{
        background: T.paper, padding: "18px 36px",
        borderBottom: `1px solid ${T.inkFaint}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, maxWidth: 1440, margin: "0 auto" }}>
          {/* Ambit wordmark */}
          <a href="#" onClick={e => e.preventDefault()} style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            <img
              src="/ambit-logo.png"
              alt="Ambit Advisory"
              style={{ height: 26, width: "auto", display: "block" }}
            />
          </a>

          {/* Divider + product lockup */}
          <div style={{ width: 1, height: 28, background: T.inkFaint }} />

          <div>
            <div style={{
              fontFamily: T.serif, fontSize: 16, fontWeight: 400, color: T.ink,
              letterSpacing: -0.2, lineHeight: 1.1,
            }}>
              <em style={{ fontStyle: "italic", fontVariationSettings: "'SOFT' 100, 'WONK' 1", color: T.deepLav }}>
                Launch
              </em>{" "}
              Tracker
            </div>
            <div style={{
              fontFamily: T.mono, fontSize: 10, color: T.inkMute,
              letterSpacing: 1.6, textTransform: "uppercase", marginTop: 3,
            }}>
              H1 2026 · {tactics.length} activities
            </div>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontFamily: T.mono, fontSize: 10, color: T.inkMute,
                letterSpacing: 1.6, textTransform: "uppercase",
              }}>
                Last updated
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink, marginTop: 2, fontWeight: 500 }}>
                {lastUpdated}
              </div>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: T.tertiary,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: T.mono, fontSize: 11, color: T.deepLav, fontWeight: 500,
              border: `1px solid ${T.secondary}`,
            }}>
              AM
            </div>
          </div>
        </div>
      </header>

      {/* Sub-nav + filter bar */}
      <div style={{
        background: T.paper, borderBottom: `1px solid ${T.inkFaint}`,
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1440, margin: "0 auto", padding: "14px 36px",
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        }}>
          {/* Tabs */}
          <div style={{
            display: "flex", gap: 4, padding: 4, borderRadius: 10, background: T.paper2,
            border: `1px solid ${T.inkFaint}`,
          }}>
            {navItems.map(({ v, label }) => {
              const active = view === v;
              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: "7px 14px", borderRadius: 7, border: "none",
                    fontFamily: T.sans, fontSize: 12.5, fontWeight: active ? 500 : 400,
                    cursor: "pointer", transition: "all 0.15s",
                    background: active ? T.ink : "transparent",
                    color: active ? "#fff" : T.inkSoft,
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = T.ink; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = T.inkSoft; }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {view !== "dashboard" && (
            <>
              {/* Search */}
              <div style={{ position: "relative", minWidth: 240, flex: "0 1 320px" }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  fontSize: 12, color: T.inkMute,
                }}>⌕</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search activities, initiatives, owners…"
                  style={{
                    width: "100%", padding: "9px 14px 9px 32px", borderRadius: 10,
                    border: `1px solid ${T.inkFaint}`, background: T.paper2,
                    fontFamily: T.sans, fontSize: 12.5, color: T.ink, outline: "none",
                    transition: "all 0.15s",
                  }}
                  onFocus={e => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 3px ${T.tertiary}`; }}
                  onBlur={e => { e.target.style.borderColor = T.inkFaint; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {/* MW Chip row */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <Chip active={filterMW === "all"} onClick={() => setFilterMW("all")} label="All MWs" />
                {MUST_WINS.map(mw => (
                  <Chip
                    key={mw.key}
                    active={filterMW === mw.key}
                    onClick={() => setFilterMW(filterMW === mw.key ? "all" : mw.key)}
                    label={`MW${mw.key}`}
                    accent={mw.color}
                    title={mw.label}
                  />
                ))}
              </div>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                style={{
                  padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.inkFaint}`,
                  fontFamily: T.sans, fontSize: 12.5, color: T.ink, background: T.paper2,
                  cursor: "pointer", outline: "none", marginLeft: "auto",
                }}
              >
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {(filterMW !== "all" || filterStatus !== "all" || search) && (
                <button
                  onClick={() => { setFilterMW("all"); setFilterStatus("all"); setSearch(""); }}
                  style={{
                    padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.inkFaint}`,
                    background: T.paper, fontFamily: T.mono, fontSize: 10.5, color: T.inkSoft,
                    cursor: "pointer", letterSpacing: 1.4, textTransform: "uppercase",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.tertiary; e.currentTarget.style.color = T.deepLav; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.paper; e.currentTarget.style.color = T.inkSoft; }}
                >
                  Clear
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 36px 48px" }}>
        {view === "dashboard"  && <DashboardView tactics={tactics} onDrill={handleDrill} />}
        {view === "activities" && (
          <ActivitiesView
            tactics={tactics} setTactics={setTactics}
            filterMW={filterMW} filterStatus={filterStatus} search={search}
          />
        )}
        {view === "gantt" && (
          <GanttView
            tactics={tactics}
            filterMW={filterMW} filterStatus={filterStatus} search={search}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${T.inkFaint}`, padding: "20px 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 1440, margin: "0 auto",
      }}>
        <span style={{
          fontFamily: T.mono, fontSize: 10, color: T.inkMute, letterSpacing: 1.6, textTransform: "uppercase",
        }}>
          Ambit Advisory · Launch Tracker
        </span>
        <span style={{
          fontFamily: T.mono, fontSize: 10, color: T.inkMute, letterSpacing: 1.6, textTransform: "uppercase",
        }}>
          v1.2 · {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

function Chip({ active, onClick, label, accent, title }) {
  return (
    <button
      onClick={onClick}
      title={title || label}
      style={{
        padding: "6px 12px", borderRadius: 999, cursor: "pointer",
        border: `1px solid ${active ? T.ink : T.inkFaint}`,
        background: active ? T.ink : T.paper,
        color: active ? "#fff" : T.inkSoft,
        fontFamily: T.mono, fontSize: 10.5, fontWeight: 500, letterSpacing: 1.2, textTransform: "uppercase",
        transition: "all 0.15s",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = T.tertiary;
          e.currentTarget.style.borderColor = T.secondary;
          e.currentTarget.style.color = T.deepLav;
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = T.paper;
          e.currentTarget.style.borderColor = T.inkFaint;
          e.currentTarget.style.color = T.inkSoft;
        }
      }}
    >
      {accent && (
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: accent,
          boxShadow: active ? `0 0 0 2px ${T.paper}` : "none",
        }} />
      )}
      {label}
    </button>
  );
}
