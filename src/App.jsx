import { Outlet } from 'react-router'

import './App.css'

export default function App() {

  return (
    <main className='app'>
      <Outlet />
    </main>
  );
}
