import { useMemo, useState } from 'react'
import {
  ArrowUpRight, Bell, CalendarCheck, CalendarDays, ChartNoAxesCombined, CheckCircle2,
  ChevronDown, FileText, HeartPulse, HelpCircle, LayoutDashboard, Menu,
  MoreHorizontal, Plus, Search, Settings, UsersRound, X
} from 'lucide-react'
import { patients } from './data'
import Dashboard from './components/Dashboard'
import { AnalyticsPage, AppointmentsPage } from './components/OtherPages'
import { PatientDetail, PatientsPage } from './components/PatientPages'

const nav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Patients', icon: UsersRound },
  { label: 'Appointments', icon: CalendarDays },
  { label: 'Analytics', icon: ChartNoAxesCombined }
]

function App() {
  const [active, setActive] = useState('Overview')
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All departments')
  const [status, setStatus] = useState('All statuses')
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [notice, setNotice] = useState('')
  const [newPatient, setNewPatient] = useState({ name: '', id: '', department: 'Cardiology', visit: 'Consultation' })
  const [localPatients, setLocalPatients] = useState(patients)
  const pageSize = 6

  const filtered = useMemo(() => {
    const rows = localPatients.filter(patient => {
      const search = query.toLowerCase()
      return (!search || [patient.name, patient.id, patient.email, patient.provider].some(value => value.toLowerCase().includes(search))) &&
        (department === 'All departments' || patient.department === department) &&
        (status === 'All statuses' || patient.status === status)
    })

    rows.sort((a, b) => {
      const comparison = String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true })
      return sort.dir === 'asc' ? comparison : -comparison
    })
    return rows
  }, [localPatients, query, department, status, sort])

  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize))
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize)
  const go = label => {
    setActive(label)
    setSelected(null)
    setMobileNav(false)
  }
  const toggleSort = key => {
    setSort(current => ({ key, dir: current.key === key && current.dir === 'asc' ? 'desc' : 'asc' }))
    setPage(1)
  }
  const exportCsv = () => {
    const csv = [
      'Patient ID,Name,Department,Provider,Visit Date,Status',
      ...filtered.map(patient =>
        [patient.id, patient.name, patient.department, patient.provider, patient.date, patient.status]
          .map(value => `"${String(value).replaceAll('"', '""')}"`)
          .join(',')
      )
    ].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'lifepulse-patients-demo.csv'
    anchor.click()
    URL.revokeObjectURL(url)
    setNotice('Patient demo data exported as CSV.')
  }
  const addPatient = event => {
    event.preventDefault()
    if (!newPatient.name.trim()) return

    const name = newPatient.name.trim()
    const patient = {
      id: newPatient.id.trim() || `LP-${10500 + localPatients.length}`,
      name,
      initials: name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase(),
      email: 'new.patient@example.test',
      department: newPatient.department,
      provider: 'Care team pending',
      date: '2026-10-19',
      status: 'Scheduled',
      age: '—',
      gender: 'Not specified',
      visit: newPatient.visit,
      color: 'blue'
    }
    setLocalPatients([patient, ...localPatients])
    setQuery('')
    setDepartment('All departments')
    setStatus('All statuses')
    setPage(1)
    setShowAdd(false)
    setNewPatient({ name: '', id: '', department: 'Cardiology', visit: 'Consultation' })
    setActive('Patients')
    setNotice('Demo patient added successfully.')
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><HeartPulse size={23} /></div>
          <div><strong>LifePulse</strong><span>HEALTH SYSTEMS</span></div>
          <button className="mobile-close icon-btn" onClick={() => setMobileNav(false)}><X size={18} /></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="nav-list">
          {nav.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => go(label)}>
              <Icon size={18} /><span>{label}</span>
              {label === 'Appointments' && <span className="nav-count">8</span>}
            </button>
          ))}
        </div>
        <div className="side-section">
          <div className="workspace-label">MANAGE</div>
          <button className="nav-item" onClick={() => { go('Patients'); setNotice('Patient directory opened.') }}>
            <FileText size={18} /><span>Patient records</span>
          </button>
          <button className="nav-item" onClick={() => { go('Appointments'); setNotice('Appointments view selected.') }}>
            <CalendarCheck size={18} /><span>Scheduling</span>
          </button>
        </div>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><HelpCircle size={17} /></div>
            <strong>Need a hand?</strong>
            <p>Visit the help center for tips and guides.</p>
            <button onClick={() => setNotice('Help center: this is a front-end demo. Connect your support resources here.')}>
              Open help center <ArrowUpRight size={13} />
            </button>
          </div>
          <button className="nav-item" onClick={() => setNotice('Settings are illustrative in this demo.')}>
            <Settings size={18} /><span>Settings</span>
          </button>
          <div className="profile">
            <div className="avatar admin">AM</div>
            <div className="profile-info"><strong>Alex Morgan</strong><span>Administrator</span></div>
            <MoreHorizontal size={19} />
          </div>
        </div>
      </aside>
      {mobileNav && <div className="scrim" onClick={() => setMobileNav(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-btn" onClick={() => setMobileNav(true)}><Menu size={20} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{selected ? 'Patient details' : active}</strong></div>
          <div className="top-actions">
            <div className="global-search">
              <Search size={16} />
              <input
                aria-label="Search anywhere"
                placeholder="Search anything..."
                onChange={event => { setQuery(event.target.value); setActive('Patients'); setSelected(null); setPage(1) }}
              />
              <kbd>⌘ K</kbd>
            </div>
            <button className="icon-btn notification" aria-label="Notifications" onClick={() => setNotice('You’re all caught up — no new notifications.')}>
              <Bell size={18} /><i />
            </button>
            <div className="top-divider" />
            <div className="avatar admin small">AM</div>
            <ChevronDown size={15} className="muted" />
          </div>
        </header>
        <div className="content">
          {notice && (
            <div className="toast">
              <CheckCircle2 size={16} /><span>{notice}</span>
              <button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button>
            </div>
          )}
          {selected ? (
            <PatientDetail patient={selected} onBack={() => setSelected(null)} />
          ) : active === 'Patients' ? (
            <PatientsPage
              query={query}
              setQuery={value => { setQuery(value); setPage(1) }}
              department={department}
              setDepartment={value => { setDepartment(value); setPage(1) }}
              status={status}
              setStatus={value => { setStatus(value); setPage(1) }}
              toggleSort={toggleSort}
              rows={rows}
              filtered={filtered}
              page={page}
              maxPage={maxPage}
              setPage={setPage}
              onSelect={setSelected}
              onExport={exportCsv}
              onAdd={() => setShowAdd(true)}
            />
          ) : active === 'Appointments' ? (
            <AppointmentsPage data={localPatients} onSelect={setSelected} />
          ) : active === 'Analytics' ? (
            <AnalyticsPage />
          ) : (
            <Dashboard onViewPatients={() => go('Patients')} onSelect={setSelected} data={localPatients} />
          )}
        </div>
        <footer className="footer">
          <span>© 2026 LifePulse Health Systems</span>
          <span><i className="secure-dot" /> Demo environment <span className="footer-sep">·</span> Fictional patient data</span>
        </footer>
      </main>
      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={event => event.stopPropagation()}>
            <div className="modal-head">
              <div><span className="eyebrow">PATIENT DIRECTORY</span><h2>Add patient</h2><p>Create a fictional patient record for this demo.</p></div>
              <button className="icon-btn" onClick={() => setShowAdd(false)}><X size={19} /></button>
            </div>
            <form onSubmit={addPatient} className="add-form">
              <label>Full name
                <input required value={newPatient.name} onChange={event => setNewPatient({ ...newPatient, name: event.target.value })} placeholder="e.g. Jamie Wilson" />
              </label>
              <label>Patient ID <span className="optional">(optional)</span>
                <input value={newPatient.id} onChange={event => setNewPatient({ ...newPatient, id: event.target.value })} placeholder="Auto-generated if blank" />
              </label>
              <label>Department
                <select value={newPatient.department} onChange={event => setNewPatient({ ...newPatient, department: event.target.value })}>
                  {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology'].map(value => <option key={value}>{value}</option>)}
                </select>
              </label>
              <label>Visit type
                <select value={newPatient.visit} onChange={event => setNewPatient({ ...newPatient, visit: event.target.value })}>
                  {['Consultation', 'Follow-up', 'Imaging review', 'Routine checkup'].map(value => <option key={value}>{value}</option>)}
                </select>
              </label>
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                <button className="btn primary" type="submit"><Plus size={16} /> Add patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
