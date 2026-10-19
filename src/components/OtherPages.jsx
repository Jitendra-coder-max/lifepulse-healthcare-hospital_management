import {
  Activity, ArrowUpRight, CalendarDays, CheckCircle2, CircleAlert, Clock3, UsersRound
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import { departments, weeklyVisits } from '../data'
import { Avatar, Metric, PageHeading, Status } from './Shared'

export function AppointmentsPage({ data, onSelect }) {
  const upcoming = data.filter(patient =>
    patient.status === 'Scheduled' || patient.status === 'Checked in' || patient.status === 'In consultation'
  )

  return (
    <>
      <PageHeading eyebrow="SCHEDULING" title="Appointments" subtitle="Track scheduled visits and daily patient flow." />
      <div className="metric-grid three">
        <Metric icon={CalendarDays} label="Today's appointments" value="128" change="+8.2%" positive note="vs. last Monday" color="blue" />
        <Metric icon={Clock3} label="Awaiting consultation" value="18" change="-4.5%" positive note="vs. yesterday" color="orange" />
        <Metric icon={CheckCircle2} label="Completed today" value="86" change="+11.2%" positive note="vs. yesterday" color="green" />
      </div>
      <section className="panel appointments-panel">
        <div className="panel-head">
          <div><h2>Upcoming visits</h2><p>Sample appointment schedule</p></div>
          <span className="record-count">{upcoming.length} appointments</span>
        </div>
        {upcoming.map((patient, index) => (
          <button className="appointment-row" key={patient.id} onClick={() => onSelect(patient)}>
            <div className="appointment-time"><strong>{['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'][index % 6]}</strong><span>AM</span></div>
            <div className="appointment-avatar"><Avatar patient={patient} /></div>
            <div className="appointment-main"><strong>{patient.name}</strong><span>{patient.visit} · {patient.department}</span></div>
            <div className="appointment-provider"><span>Care provider</span><strong>{patient.provider}</strong></div>
            <Status status={patient.status} />
            <ArrowUpRight size={16} className="muted" />
          </button>
        ))}
      </section>
    </>
  )
}

export function AnalyticsPage() {
  return (
    <>
      <PageHeading eyebrow="REPORTING & INSIGHTS" title="Analytics" subtitle="Explore high-level operational trends in this sample dataset." />
      <div className="metric-grid">
        <Metric icon={UsersRound} label="Total patients" value="2,846" change="+12.8%" positive note="vs. last month" color="blue" />
        <Metric icon={CalendarDays} label="Visits this week" value="318" change="+9.4%" positive note="vs. last week" color="green" />
        <Metric icon={Activity} label="Care completion" value="94.6%" change="+3.1%" positive note="vs. last month" color="purple" />
        <Metric icon={Clock3} label="Avg. wait time" value="14 min" change="-2.4 min" positive note="vs. last week" color="orange" />
      </div>
      <div className="dashboard-grid">
        <section className="panel visits-panel">
          <div className="panel-head"><div><h2>Visit volume</h2><p>Daily visits · sample values</p></div></div>
          <div className="visit-chart tall">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyVisits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#edf0f5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8b95a7', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b95a7', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="visits" name="Visits" fill="#5b78e5" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel department-panel">
          <div className="panel-head"><div><h2>Department mix</h2><p>Illustrative visit counts</p></div></div>
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
        </section>
      </div>
      <p className="demo-note"><CircleAlert size={14} /> Dashboard metrics and charts are illustrative, not connected to a live healthcare system.</p>
    </>
  )
}
