import {
  ArrowLeft, ArrowUpDown, ArrowUpRight, CalendarCheck, CalendarDays, CheckCircle2, Download,
  ChevronLeft, ChevronRight, CircleAlert, Clock3, FileText, Mail, MapPin, Phone,
  Search, SlidersHorizontal, Stethoscope, UserRound, UsersRound, X
} from 'lucide-react'
import { patients } from '../data'
import { Avatar, formatDate, PageHeading, Status } from './Shared'

export function PatientsPage({
  query, setQuery, department, setDepartment, status, setStatus, toggleSort,
  rows, filtered, page, maxPage, setPage, onSelect, onExport, onAdd
}) {
  return (
    <>
      <PageHeading
        eyebrow="CARE MANAGEMENT"
        title="Patients"
        subtitle="Manage patient records and keep care teams connected."
        actions={
          <>
            <button className="btn secondary" onClick={onExport}><Download size={16} /> Export CSV</button>
            <button className="btn primary" onClick={onAdd}><UsersRound size={17} /> Add patient</button>
          </>
        }
      />
      <div className="metric-strip">
        <div><UsersRound size={17} /><span>All patients</span><strong>{filtered.length}</strong></div>
        <div><Clock3 size={17} /><span>In progress</span><strong>{filtered.filter(patient => ['Checked in', 'In consultation'].includes(patient.status)).length}</strong></div>
        <div><CalendarCheck size={17} /><span>Scheduled</span><strong>{filtered.filter(patient => patient.status === 'Scheduled').length}</strong></div>
        <div><CheckCircle2 size={17} /><span>Completed</span><strong>{filtered.filter(patient => patient.status === 'Completed').length}</strong></div>
      </div>
      <section className="panel patient-table-panel">
        <div className="panel-head patient-table-heading">
          <div><h2>Patient directory</h2><p>Search and manage patient information</p></div>
          <span className="record-count">{filtered.length} records</span>
        </div>
        <div className="filters">
          <div className="table-search">
            <Search size={16} />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, patient ID, provider..." aria-label="Search patients" />
            {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}
          </div>
          <label className="filter-select">
            <SlidersHorizontal size={15} />
            <select aria-label="Filter by department" value={department} onChange={event => setDepartment(event.target.value)}>
              <option>All departments</option>
              {[...new Set(patients.map(patient => patient.department))].sort().map(value => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label className="filter-select">
            <select aria-label="Filter by status" value={status} onChange={event => setStatus(event.target.value)}>
              <option>All statuses</option>
              {['Scheduled', 'Checked in', 'In consultation', 'Completed', 'Cancelled'].map(value => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th><button className="sort-btn" onClick={() => toggleSort('name')}>Patient <ArrowUpDown size={13} /></button></th>
                <th><button className="sort-btn" onClick={() => toggleSort('id')}>Patient ID <ArrowUpDown size={13} /></button></th>
                <th><button className="sort-btn" onClick={() => toggleSort('department')}>Department <ArrowUpDown size={13} /></button></th>
                <th>Provider</th>
                <th><button className="sort-btn" onClick={() => toggleSort('date')}>Last visit <ArrowUpDown size={13} /></button></th>
                <th>Status</th><th />
              </tr>
            </thead>
            <tbody>
              {rows.map(patient => (
                <tr key={patient.id} onClick={() => onSelect(patient)} className="click-row">
                  <td><div className="patient-cell"><Avatar patient={patient} /><div><strong>{patient.name}</strong><span>{patient.email}</span></div></div></td>
                  <td className="id-text">{patient.id}</td><td>{patient.department}</td><td>{patient.provider}</td><td>{formatDate(patient.date)}</td>
                  <td><Status status={patient.status} /></td>
                  <td><button className="row-more" aria-label={`View ${patient.name}`} onClick={event => { event.stopPropagation(); onSelect(patient) }}><ArrowUpRight size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="empty-state">
              <Search size={26} /><strong>No patients found</strong><span>Try changing your search or filters.</span>
              <button className="btn secondary compact" onClick={() => { setQuery(''); setDepartment('All departments'); setStatus('All statuses') }}>Clear filters</button>
            </div>
          )}
        </div>
        <div className="pagination">
          <span>Showing <strong>{filtered.length ? (page - 1) * 6 + 1 : 0}–{Math.min(page * 6, filtered.length)}</strong> of <strong>{filtered.length}</strong> patients</span>
          <div className="page-controls">
            <button aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
            {Array.from({ length: maxPage }, (_, index) => index + 1).slice(0, 5).map(number => (
              <button key={number} className={page === number ? 'current' : ''} onClick={() => setPage(number)}>{number}</button>
            ))}
            <button aria-label="Next page" disabled={page >= maxPage} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
          </div>
        </div>
      </section>
      <p className="demo-note"><CircleAlert size={14} /> Demo environment only. Patient records are fictional sample data, not real medical records.</p>
    </>
  )
}

export function PatientDetail({ patient, onBack }) {
  return (
    <>
      <button className="back-link" onClick={onBack}><ArrowLeft size={16} /> Back to patients</button>
      <PageHeading eyebrow="PATIENT RECORD" title={patient.name} subtitle={`Patient ID: ${patient.id} · ${patient.department}`} />
      <div className="detail-grid">
        <section className="panel patient-summary">
          <div className="summary-profile">
            <Avatar patient={patient} />
            <div>
              <h2>{patient.name}</h2><span className="id-text">{patient.id}</span>
              <div className="summary-status"><Status status={patient.status} /></div>
            </div>
          </div>
          <div className="detail-divider" />
          <h3>Personal information</h3>
          <Info icon={Mail} label="Email" value={patient.email} />
          <Info icon={UserRound} label="Age / gender" value={`${patient.age} / ${patient.gender}`} />
          <Info icon={Stethoscope} label="Department" value={patient.department} />
          <Info icon={MapPin} label="Care provider" value={patient.provider} />
          <Info icon={Phone} label="Contact" value="Not provided in demo" />
          <div className="privacy-note"><CircleAlert size={16} /><span>Sample data only. Do not enter real patient information into this demo.</span></div>
        </section>
        <section className="panel visit-history">
          <div className="panel-head">
            <div><h2>Visit overview</h2><p>Summary of the latest recorded visit</p></div>
            <CalendarDays size={19} className="muted" />
          </div>
          <div className="visit-detail-card">
            <div className="visit-detail-icon"><Stethoscope size={19} /></div>
            <div><span className="eyebrow">VISIT TYPE</span><strong>{patient.visit}</strong><span>{formatDate(patient.date)}</span></div>
            <Status status={patient.status} />
          </div>
          <h3>Care team notes</h3>
          <div className="note-placeholder"><FileText size={20} /><strong>No notes available</strong><span>Clinical notes are not included in this prototype.</span></div>
          <h3>Recent activity</h3>
          <div className="timeline">
            <div className="timeline-item"><i /><div><strong>Patient record viewed</strong><span>Just now · Demo activity</span></div></div>
            <div className="timeline-item"><i /><div><strong>Visit record created</strong><span>{formatDate(patient.date)} · Sample record</span></div></div>
          </div>
        </section>
      </div>
    </>
  )
}

function Info({ icon: Icon, label, value }) {
  return <div className="info-row"><Icon size={16} /><div><span>{label}</span><strong>{value}</strong></div></div>
}
