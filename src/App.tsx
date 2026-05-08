import { useEffect, useState } from 'react'
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

type AllowedApp = {
  id: string
  name: string
}

type TimelineItem = {
  id: string
  title: string
  detail: string
  status: 'Queued' | 'Delivered' | 'Confirmed' | 'Failed'
}

const API_BASE = 'https://localhost:7168/api'

function App() {
  const [devices, setDevices] = useState<Device[]>([])
  const [devicesLoading, setDevicesLoading] = useState(true)
  const [devicesError, setDevicesError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [connectedCount, setConnectedCount] = useState<number>(0)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [deviceDetailError, setDeviceDetailError] = useState<string | null>(null)
  const [allowedApps, setAllowedApps] = useState<AllowedApp[]>([])
  const [allowedAppsLoading, setAllowedAppsLoading] = useState(false)
  const [allowedAppsError, setAllowedAppsError] = useState<string | null>(null)
  const [isEditingApps, setIsEditingApps] = useState(false)
  const [draftAllowedApps, setDraftAllowedApps] = useState<AllowedApp[]>([])
  const [allowedAppInput, setAllowedAppInput] = useState('')
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [timelineLoading, setTimelineLoading] = useState(false)
  const [timelineError, setTimelineError] = useState<string | null>(null)
  const [commandBusy, setCommandBusy] = useState(false)
  const [commandStatus, setCommandStatus] = useState<string | null>(null)
  const isDetail = Boolean(selectedDevice)

  const formatRelative = (d: Date) => {
    const diff = Math.floor((Date.now() - d.getTime()) / 1000)
    if (diff < 10) return 'Just now'
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return d.toLocaleString()
  }

  const fetchJson = async <T,>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    return response.json() as Promise<T>
  }

  const loadDevices = async () => {
    try {
      setDevicesLoading(true)
      setDevicesError(null)
      const data = await fetchJson<Device[]>(`${API_BASE}/devices`)
      setDevices(data)
      setLastSync(new Date())
      setConnectedCount(data.length)
    } catch {
      setDevicesError('Unable to reach the backend. Start the API and retry.')
      setDevices([])
      setConnectedCount(0)
    } finally {
      setDevicesLoading(false)
    }
  }

  useEffect(() => {
    void loadDevices()
  }, [])

  useEffect(() => {
    const deviceId = selectedDevice?.id
    if (!deviceId) {
      return
    }

    const loadDeviceDetail = async () => {
      try {
        setDeviceDetailError(null)
        const detail = await fetchJson<Device>(`${API_BASE}/devices/${deviceId}`)
        setSelectedDevice(detail)
      } catch {
        setDeviceDetailError('Unable to load device details. Check the backend.')
      }
    }

    const loadAllowedApps = async () => {
      try {
        setAllowedAppsLoading(true)
        setAllowedAppsError(null)
        const apps = await fetchJson<AllowedApp[]>(`${API_BASE}/devices/${deviceId}/allowed-apps`)
        setAllowedApps(apps)
      } catch {
        setAllowedAppsError('Unable to load allowed apps. Check the backend.')
        setAllowedApps([])
      } finally {
        setAllowedAppsLoading(false)
      }
    }

    const loadTimeline = async () => {
      try {
        setTimelineLoading(true)
        setTimelineError(null)
        const items = await fetchJson<TimelineItem[]>(`${API_BASE}/devices/${deviceId}/timeline`)
        setTimelineItems(items)
      } catch {
        setTimelineError('Unable to load timeline events. Check the backend.')
        setTimelineItems([])
      } finally {
        setTimelineLoading(false)
      }
    }

    void loadDeviceDetail()
    void loadAllowedApps()
    void loadTimeline()
  }, [selectedDevice?.id])

  const handleSelectDevice = (device: Device) => {
    setSelectedDevice(device)
    setCommandStatus(null)
    setIsEditingApps(false)
  }

  const retryDeviceDetail = () => {
    const deviceId = selectedDevice?.id
    if (!deviceId) {
      return
    }
    setDeviceDetailError(null)
    void fetchJson<Device>(`${API_BASE}/devices/${deviceId}`).then(setSelectedDevice).catch(() => {
      setDeviceDetailError('Unable to load device details. Check the backend.')
    })
  }

  const handleCommand = async (command: 'lock' | 'unlock' | 'grace') => {
    const deviceId = selectedDevice?.id
    if (!deviceId) {
      return
    }

    try {
      setCommandBusy(true)
      setCommandStatus(null)
      await fetchJson(`${API_BASE}/devices/${deviceId}/commands/${command}`, {
        method: 'POST',
      })
      setCommandStatus('Command sent to cloud relay.')
    } catch {
      setCommandStatus('Command failed to send. Backend not ready yet.')
    } finally {
      setCommandBusy(false)
    }
  }

  const startEditAllowedApps = () => {
    setDraftAllowedApps(allowedApps)
    setIsEditingApps(true)
  }

  const cancelEditAllowedApps = () => {
    setDraftAllowedApps([])
    setAllowedAppInput('')
    setIsEditingApps(false)
  }

  const saveAllowedApps = async () => {
    const deviceId = selectedDevice?.id
    if (!deviceId) {
      return
    }

    try {
      setAllowedAppsLoading(true)
      setAllowedAppsError(null)
      const payload = { apps: draftAllowedApps }
      const updated = await fetchJson<AllowedApp[]>(`${API_BASE}/devices/${deviceId}/allowed-apps`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setAllowedApps(updated)
      setIsEditingApps(false)
      setAllowedAppInput('')
    } catch {
      setAllowedAppsError('Unable to save allowed apps. Backend not ready yet.')
    } finally {
      setAllowedAppsLoading(false)
    }
  }

  const addAllowedApp = () => {
    const trimmed = allowedAppInput.trim()
    if (!trimmed) {
      return
    }

    const nextApp: AllowedApp = {
      id: `${trimmed.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: trimmed,
    }
    setDraftAllowedApps((prev) => [...prev, nextApp])
    setAllowedAppInput('')
  }

  const removeAllowedApp = (id: string) => {
    setDraftAllowedApps((prev) => prev.filter((app) => app.id !== id))
  }

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

              {deviceDetailError ? (
                <div className="inline-alert">
                  <p className="muted">{deviceDetailError}</p>
                  <button className="button button--ghost" onClick={retryDeviceDetail}>
                    Retry
                  </button>
                </div>
              ) : null}

              <div className="panel__body">
                <div className="control-row">
                  <button
                    className="button button--primary"
                    onClick={() => handleCommand('lock')}
                    disabled={commandBusy}
                  >
                    Lock now
                  </button>
                  <button
                    className="button button--ghost"
                    onClick={() => handleCommand('unlock')}
                    disabled={commandBusy}
                  >
                    Unlock now
                  </button>
                  <button className="button" onClick={() => handleCommand('grace')} disabled={commandBusy}>
                    Send 15 min grace
                  </button>
                </div>

                {commandStatus ? <p className="muted">{commandStatus}</p> : null}

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
                {isEditingApps ? (
                  <div className="button-row">
                    <button className="button button--ghost" onClick={saveAllowedApps} disabled={allowedAppsLoading}>
                      Save
                    </button>
                    <button className="button button--ghost" onClick={cancelEditAllowedApps}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button className="button button--ghost" onClick={startEditAllowedApps}>
                    Edit
                  </button>
                )}
              </div>
              <div className="panel__body">
                {allowedAppsError ? <p className="muted">{allowedAppsError}</p> : null}
                {allowedAppsLoading ? <p className="muted">Loading allowed apps...</p> : null}
                <div className="chip-grid">
                  {(isEditingApps ? draftAllowedApps : allowedApps).map((app) => (
                    <span key={app.id} className={`chip ${isEditingApps ? 'chip--editable' : ''}`}>
                      {app.name}
                      {isEditingApps ? (
                        <button
                          className="chip__remove"
                          type="button"
                          onClick={() => removeAllowedApp(app.id)}
                        >
                          Remove
                        </button>
                      ) : null}
                    </span>
                  ))}
                </div>
                <label className="field">
                  <span className="field__label">Add allowed app</span>
                  <div className="inline-input">
                    <input
                      className="field__input"
                      type="text"
                      placeholder="Search package or app name"
                      value={allowedAppInput}
                      onChange={(event) => setAllowedAppInput(event.target.value)}
                      disabled={!isEditingApps}
                    />
                    <button className="button" type="button" onClick={addAllowedApp} disabled={!isEditingApps}>
                      Add
                    </button>
                  </div>
                  <span className="field__help">
                    {isEditingApps ? 'Changes sync through the cloud relay.' : 'Tap edit to update allowed apps.'}
                  </span>
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
              {timelineError ? <p className="muted">{timelineError}</p> : null}
              {timelineLoading ? <p className="muted">Loading timeline...</p> : null}
              {timelineItems.map((item) => (
                <div key={item.id} className="timeline-item">
                  <div>
                    <p className="timeline-title">{item.title}</p>
                    <p className="muted">{item.detail}</p>
                  </div>
                  <span className={`status-pill ${item.status === 'Delivered' ? 'status-pill--online' : ''}`}>
                    {item.status}
                  </span>
                </div>
              ))}
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
              <div className="status-pill">Last sync {lastSync ? formatRelative(lastSync) : '—'}</div>
              <div className="status-pill">{connectedCount} devices connected</div>
            </div>
          </header>

          <section className="device-grid">
            {devicesLoading ? <p className="muted">Loading devices...</p> : null}
            {devicesError ? (
              <div className="inline-alert">
                <p className="muted">{devicesError}</p>
                <button className="button button--ghost" onClick={loadDevices}>
                  Retry
                </button>
              </div>
            ) : null}
            {devices.map((device) => (
              <article
                key={device.id}
                className="card device-card device-card--action"
                role="button"
                tabIndex={0}
                onClick={() => handleSelectDevice(device)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleSelectDevice(device)
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