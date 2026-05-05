import './App.css'

function App() {
  return (
    <div className="app">
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
          <div className="status-pill status-pill--online">Cloud relay online</div>
          <div className="status-pill">Last sync 2 min ago</div>
          <div className="status-pill">2 devices connected</div>
        </div>
      </header>

      <section className="device-grid">
        <article className="card device-card">
          <div className="device-card__top">
            <div>
              <h3>Amina's Pixel 7</h3>
              <p className="muted">Android 14 · Battery 62%</p>
            </div>
            <span className="status status--locked">Locked</span>
          </div>
          <div className="device-card__meta">
            <div>
              <p className="meta-label">Unlocks at</p>
              <p className="meta-value">7:00 AM</p>
            </div>
            <div>
              <p className="meta-label">Next lock</p>
              <p className="meta-value">9:00 PM</p>
            </div>
            <div>
              <p className="meta-label">Queue</p>
              <p className="meta-value">2 pending</p>
            </div>
          </div>
        </article>

        <article className="card device-card">
          <div className="device-card__top">
            <div>
              <h3>Jordan's Galaxy A54</h3>
              <p className="muted">Android 13 · Battery 84%</p>
            </div>
            <span className="status status--open">Unlocked</span>
          </div>
          <div className="device-card__meta">
            <div>
              <p className="meta-label">Locks at</p>
              <p className="meta-value">8:30 PM</p>
            </div>
            <div>
              <p className="meta-label">Next unlock</p>
              <p className="meta-value">6:30 AM</p>
            </div>
            <div>
              <p className="meta-label">Queue</p>
              <p className="meta-value">0 pending</p>
            </div>
          </div>
        </article>
      </section>

      <section className="detail-grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <h2>Selected device</h2>
              <p className="muted">Amina's Pixel 7 · Child device state</p>
            </div>
            <div className="device-state">
              <span className="state-dot state-dot--locked" />
              Locked until 7:00 AM
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
              <p className="muted">Amina's Pixel 7 · Locks at 9:00 PM</p>
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
    </div>
  )
}

export default App