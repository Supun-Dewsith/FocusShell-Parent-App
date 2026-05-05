import { useState } from 'react'
import './App.css'

type Device = {
  id: string
  name: string
  model: string
  status: 'Locked' | 'Unlocked'
  battery: string
  lockAt: string
  unlockAt: string
  queue: string
  stateText: string
}

function App() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const isDetail = Boolean(selectedDevice)

  const devices: Device[] = [
    {
      id: 'amina-pixel',
      name: "Amina's Pixel 7",
      model: 'Android 14',
      status: 'Locked',
      battery: '62%',
      lockAt: '9:00 PM',
      unlockAt: '7:00 AM',
      queue: '2 pending',
      stateText: 'Locked until 7:00 AM',
    },
    {
      id: 'jordan-galaxy',
      name: "Jordan's Galaxy A54",
      model: 'Android 13',
      status: 'Unlocked',
      battery: '84%',
      lockAt: '8:30 PM',
      unlockAt: '6:30 AM',
      queue: '0 pending',
      stateText: 'Unlocked until 8:30 PM',
    },
  ]

  return (
    <div className="app">
      {isDetail ? (
        <section>
          <div className="detail-header">
            <div className="detail-header__copy">
              <span className="eyebrow">Selected device</span>
              <h2>{selectedDevice?.name ?? 'Selected device'}</h2>
              <p className="muted">Child device controls and status</p>
            </div>
            <div>
              <button className="button button--ghost" onClick={() => setSelectedDevice(null)}>
              Back to devices
            </button>
            </div>
          </div>

          <section className="detail-grid">
            <div className="panel">
              <div className="panel__header">
                <div>
                  <h2>Selected device</h2>
                  <p className="muted">{selectedDevice?.name ?? "Amina's Pixel 7"} · Child device state</p>
                </div>
                <div className="device-state">
                  <span
                    className={`state-dot ${
                      selectedDevice?.status === 'Locked' ? 'state-dot--locked' : ''
                    }`}
                  />
                  {selectedDevice?.stateText ?? 'Locked until 7:00 AM'}
                </div>
              </div>

              <div className="panel__body">
                <div className="control-row">
                  <button className="button button--primary">Lock now</button>
                  <button className="button button--ghost">Unlock now</button>
                  <button className="button">Send 15 min grace</button>
                </div>

                <div className="form-grid">
                  <label className="field">
                    <span className="field__label">Lock timer</span>
                    <input className="field__input" type="range" min="5" max="180" defaultValue="45" />
                    <span className="field__help">Auto-lock after 45 minutes of focus time.</span>
                  </label>
                  <label className="field">
                    <span className="field__label">Lock at</span>
                    <input className="field__input" type="time" defaultValue="21:00" />
                    <span className="field__help">Device will lock at 9:00 PM.</span>
                  </label>
                  <label className="field">
                    <span className="field__label">Unlock at</span>
                    <input className="field__input" type="time" defaultValue="07:00" />
                    <span className="field__help">Device will unlock at 7:00 AM.</span>
                  </label>
                  <label className="field">
                    <span className="field__label">Timezone</span>
                    <select className="field__input" defaultValue="utc-5">
                      <option value="utc-5">UTC -05:00 (Local)</option>
                      <option value="utc-6">UTC -06:00</option>
                      <option value="utc-7">UTC -07:00</option>
                    </select>
                    <span className="field__help">Schedules align to the child's locale.</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel__header">
                <div>
                  <h2>Allowed apps</h2>
                  <p className="muted">Only these apps stay available during lock.</p>
                </div>
                <button className="button button--ghost">Edit list</button>
              </div>
              <div className="panel__body">
                <div className="chip-grid">
                  <span className="chip">Phone</span>
                  <span className="chip">Messages</span>
                  <span className="chip">Camera</span>
                  <span className="chip">Maps</span>
                  <span className="chip">Calculator</span>
                  <span className="chip">Khan Academy</span>
                  <span className="chip">Spotify Kids</span>
                </div>
                <label className="field">
                  <span className="field__label">Add allowed app</span>
                  <div className="inline-input">
                    <input className="field__input" type="text" placeholder="Search package or app name" />
                    <button className="button">Add</button>
                  </div>
                  <span className="field__help">Changes sync through the cloud relay.</span>
                </label>
              </div>
            </div>
          </section>

          <section className="panel timeline">
            <div className="panel__header">
              <div>
                <h2>Command timeline</h2>
                <p className="muted">Recent requests and device responses.</p>
              </div>
              <button className="button button--ghost">View all</button>
            </div>
            <div className="panel__body timeline__body">
              <div className="timeline-item">
                <div>
                  <p className="timeline-title">Lock scheduled</p>
                  <p className="muted">{selectedDevice?.name ?? "Amina's Pixel 7"} · Locks at 9:00 PM</p>
                </div>
                <span className="status-pill">Queued</span>
              </div>
              <div className="timeline-item">
                <div>
                  <p className="timeline-title">Allowed apps updated</p>
                  <p className="muted">Khan Academy added</p>
                </div>
                <span className="status-pill status-pill--online">Delivered</span>
              </div>
              <div className="timeline-item">
                <div>
                  <p className="timeline-title">Unlock command</p>
                  <p className="muted">Jordan's Galaxy A54 · 6:28 AM</p>
                </div>
                <span className="status-pill">Confirmed</span>
              </div>
            </div>
          </section>
        </section>
      ) : (
        <section>
          <header className="app__header">
            <div>
              <span className="eyebrow">Parent Console</span>
              <h1>FocusShell Command Center</h1>
              <p className="subtitle">
                Send lock commands, schedule downtime, and curate allowed apps. All
                actions route through the cloud relay you will connect later.
              </p>
            </div>
            <div className="header__status">
              <div className="status-pill">Last sync 2 min ago</div>
              <div className="status-pill">2 devices connected</div>
            </div>
          </header>

          <section className="device-grid">
            {devices.map((device) => (
              <article
                key={device.id}
                className="card device-card device-card--action"
                role="button"
                tabIndex={0}
                onClick={() => setSelectedDevice(device)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedDevice(device)
                  }
                }}
              >
                <div className="device-card__top">
                  <div>
                    <h3>{device.name}</h3>
                    <p className="muted">
                      {device.model} · Battery {device.battery}
                    </p>
                  </div>
                  <span
                    className={`status ${
                      device.status === 'Locked' ? 'status--locked' : 'status--open'
                    }`}
                  >
                    {device.status}
                  </span>
                </div>
                <div className="device-card__meta">
                  <div>
                    <p className="meta-label">Unlocks at</p>
                    <p className="meta-value">{device.unlockAt}</p>
                  </div>
                  <div>
                    <p className="meta-label">Next lock</p>
                    <p className="meta-value">{device.lockAt}</p>
                  </div>
                  <div>
                    <p className="meta-label">Queue</p>
                    <p className="meta-value">{device.queue}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </section>
      )}
    </div>
  )
}

export default App