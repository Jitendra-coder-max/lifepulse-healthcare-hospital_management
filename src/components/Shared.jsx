import {
  ArrowDownRight, ArrowUpRight, MoreHorizontal
} from 'lucide-react'

export function PageHeading({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {actions && <div className="heading-actions">{actions}</div>}
    </div>
  )
}

export function Metric({ icon: Icon, label, value, change, positive, note, color }) {
  return (
    <section className="metric-card">
      <div className="metric-top">
        <div className={`metric-icon ${color}`}><Icon size={19} /></div>
        <button className="metric-menu" aria-label={`${label} options`}><MoreHorizontal size={18} /></button>
      </div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot">
        <span className={`change ${positive ? 'up' : 'down'}`}>
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {change}
        </span>
        <span className="metric-note">{note}</span>
      </div>
    </section>
  )
}

export function Avatar({ patient }) {
  return <div className={`avatar patient-avatar ${patient.color || 'blue'}`}>{patient.initials}</div>
}

export function Status({ status }) {
  return <span className={`status ${status.toLowerCase().replaceAll(' ', '-')}`}><i />{status}</span>
}

export function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
