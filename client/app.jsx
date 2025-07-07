const { useState, useEffect } = React;

function Login({ onLogin, switchView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="max-w-sm mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Login</h2>
      <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2 w-full" onClick={() => onLogin(email, password)}>Login</button>
      <p className="mt-2 text-sm text-center">
        No account? <button className="text-blue-600" onClick={() => switchView('register')}>Register</button>
      </p>
    </div>
  );
}

function Register({ onRegister, switchView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="max-w-sm mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Register</h2>
      <input className="border p-2 w-full mb-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2 w-full" onClick={() => onRegister(name, email, password)}>Register</button>
      <p className="mt-2 text-sm text-center">
        Have an account? <button className="text-blue-600" onClick={() => switchView('login')}>Login</button>
      </p>
    </div>
  );
}

function Dashboard({ user, onMark, records, onRefresh }) {
  const [status, setStatus] = useState('present');
  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Welcome {user.name}</h2>
      <div className="mb-4">
        <select className="border p-2 mr-2" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
        <button className="bg-green-500 text-white px-3 py-2" onClick={() => onMark(status)}>Mark Attendance</button>
        <button className="ml-2 text-sm text-blue-600" onClick={onRefresh}>Refresh</button>
      </div>
      <ul>
        {records.map(r => (
          <li key={r._id} className="border-b py-1 text-sm flex justify-between">
            <span>{new Date(r.date).toLocaleDateString()}</span>
            <span>{r.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminPanel({ token }) {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, [token, refresh]);

  function updateStars(id, stars) {
    fetch(`/api/admin/users/${id}/star`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ stars: Number(stars) })
    }).then(() => setRefresh(r => r + 1));
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Admin Panel</h2>
      <ul>
        {users.map(u => (
          <li key={u.id} className="border-b py-2 flex items-center">
            <span className="flex-1">{u.name} ({u.email})</span>
            <input type="number" min="0" max="5" defaultValue={u.stars} className="border w-16 mr-2" onBlur={e => updateStars(u.id, e.target.value)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [view, setView] = useState('login');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);

  function login(email, password) {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(res => res.json()).then(data => {
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        setView(data.user.role === 'admin' ? 'admin' : 'dashboard');
        loadRecords(data.token);
      }
    });
  }

  function register(name, email, password) {
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    }).then(res => res.json()).then(data => {
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        setView('dashboard');
        loadRecords(data.token);
      }
    });
  }

  function loadRecords(tok = token) {
    fetch('/api/attendance/me', { headers: { Authorization: `Bearer ${tok}` } })
      .then(res => res.json())
      .then(data => setRecords(data));
  }

  function markAttendance(status) {
    fetch('/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }).then(() => loadRecords());
  }

  if (view === 'login') return <Login onLogin={login} switchView={setView} />;
  if (view === 'register') return <Register onRegister={register} switchView={setView} />;
  if (view === 'dashboard') return <Dashboard user={user} onMark={markAttendance} records={records} onRefresh={loadRecords} />;
  if (view === 'admin') return <AdminPanel token={token} />;

  return null;
}

ReactDOM.render(<App />, document.getElementById('root'));
