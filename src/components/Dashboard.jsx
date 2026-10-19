import {
  Activity, ArrowUpRight, CalendarDays, ChevronDown, Clock3, MoreHorizontal, UsersRound
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { departments, weeklyVisits } from '../data'
import { Avatar, formatDate, Metric, PageHeading, Status } from './Shared'

export default function Dashboard({ onViewPatients, onSelect, data }) {
  const recent = data.slice(0, 5)

  return (
    <>
      <PageHeading
        eyebrow="MONDAY, OCTOBER 19, 2026"
        title="Good morning, Alex 👋"
        subtitle="Here’s what’s happening across your healthcare network today."
        actions={<button className="btn primary" onClick={onViewPatients}><UsersRound size={16} /> View patients <ArrowUpRight size={15} /></button>}
      />
      <div className="metric-grid">
        <Metric icon={UsersRound} label="Total patients" value="2,846" change="+12.8%" positive note="vs. last month" color="blue" />
        <Metric icon={CalendarDays} label="Appointments today" value="128" change="+8.2%" positive note="vs. last Monday" color="green" />
        <Metric icon={Clock3} label="Avg. wait time" value="14 min" change="-2.4 min" positive note="vs. last week" color="orange" />
        <Metric icon={Activity} label="Care completion" value="94.6%" change="+3.1%" positive note="vs. last month" color="purple" />
      </div>
      <div className="dashboard-grid">
        <section className="panel visits-panel">
          <div className="panel-head">
            <div><h2>Patient visits</h2><p>Weekly appointment overview</p></div>
            <button className="select-like" onClick={() => {}}><span>This week</span><ChevronDown size={14} /></button>
          </div>
          <div className="chart-legend">
            <span><i className="legend-blue" /> This week</span><span><i className="legend-light" /> Last week</span>
          </div>
          <div className="visit-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyVisits} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5676e8" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#5676e8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#edf0f5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8b95a7', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b95a7', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #edf0f5', fontSize: 12 }} />
                <Area type="monotone" dataKey="last" name="Last week" stroke="#cbd3e6" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="visits" name="This week" stroke="#5b78e5" strokeWidth={2.5} fill="url(#visitsFill)" activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel department-panel">
          <div className="panel-head">
            <div><h2>Visits by department</h2><p>Patient distribution</p></div>
            <button className="icon-btn" onClick={() => {}}><MoreHorizontal size={18} /></button>
          </div>
          <div className="department-list">
            {departments.map(department => (
              <div className="department-row" key={department.name}>
                <div className="department-meta">
                  <span><i style={{ background: department.color }} />{department.name}</span>
                  <strong>{department.count}</strong>
                </div>
                <div className="progress-track"><div style={{ width: `${department.count / 84 * 100}%`, background: department.color }} /></div>
              </div>
            ))}
          </div>
          <button className="text-link" onClick={onViewPatients}>Explore patient records <ArrowUpRight size={14} /></button>
        </section>
      </div>
      <section className="panel recent-panel">
        <div className="panel-head">
          <div><h2>Recent patients</h2><p>Latest patient activity across your network</p></div>
          <button className="btn secondary compact" onClick={onViewPatients}>View all <ArrowUpRight size={14} /></button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Patient</th><th>Patient ID</th><th>Department</th><th>Last visit</th><th>Status</th><th /></tr></thead>
            <tbody>
              {recent.map(patient => (
                <tr key={patient.id} onClick={() => onSelect(patient)} className="click-row">
                  <td><div className="patient-cell"><Avatar patient={patient} /><div><strong>{patient.name}</strong><span>{patient.email}</span></div></div></td>
                  <td className="id-text">{patient.id}</td><td>{patient.department}</td><td>{formatDate(patient.date)}</td><td><Status status={patient.status} /></td>
                  <td><button className="row-more" aria-label="Open patient" onClick={event => { event.stopPropagation(); onSelect(patient) }}><ArrowUpRight size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
