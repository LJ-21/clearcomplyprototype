import { useStore } from './useStore.js';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import Roster from './components/Roster.jsx';
import Projects from './components/Projects.jsx';
import DetailPage from './components/DetailPage.jsx';
import Drawer from './components/Drawer.jsx';
import Toast from './components/Toast.jsx';
import EmailModal from './components/EmailModal.jsx';
import ReviewModal from './components/ReviewModal.jsx';
import OnboardModal from './components/OnboardModal.jsx';
import UploadPortal from './components/UploadPortal.jsx';

export default function App({ identity, onSignOut }) {
  const vm = useStore();

  // Public subcontractor upload portal (reached via the secure link hash route).
  if (vm.route && vm.route.name === 'upload') return <UploadPortal vm={vm} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F6F3', color: '#1C2B39', fontFamily: 'Inter,system-ui,sans-serif', fontSize: 15, lineHeight: 1.5, WebkitFontSmoothing: 'antialiased' }}>
      <Sidebar vm={vm} identity={identity} onSignOut={onSignOut} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header vm={vm} />

        <main style={{ flex: 1, padding: 24, maxWidth: 1180, width: '100%' }}>
          {vm.isDashboard && <Dashboard vm={vm} />}
          {vm.showRoster && <Roster vm={vm} />}
          {vm.isProjects && <Projects vm={vm} />}
          {vm.isDetailPage && <DetailPage vm={vm} />}
        </main>
      </div>

      <Drawer vm={vm} />
      <Toast vm={vm} />
      <EmailModal vm={vm} />
      <ReviewModal vm={vm} />
      <OnboardModal vm={vm} />
    </div>
  );
}
