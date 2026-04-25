import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, Alert, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import AppShell from "./components/AppShell";
import DashboardPage from "./pages/DashboardPage";
import NewEventPage from "./pages/NewEventPage";
import CalendarPage from "./pages/CalendarPage";
import InvitationsPage from "./pages/InvitationsPage";
import SettingsPage from "./pages/SettingsPage";
import EventDetailPage from "./pages/EventDetailPage";
import { theme } from "./theme";
import { usePWA } from "./hooks/usePWA";
import { useNetworkStatus } from "./hooks/useNetworkStatus";

function App() {
  const { offlineReady, needUpdate, updateServiceWorker, close } = usePWA();
  const { isOffline } = useNetworkStatus();

  return (
    <ThemeProvider theme={theme}>
      <View>
        {isOffline && (
          <Alert variation="warning" isDismissible={false}>
            Du bist offline. Daten werden aus dem Cache geladen.
          </Alert>
        )}
        {(offlineReady || needUpdate) && (
          <Alert 
            variation="info" 
            heading={offlineReady ? "App bereit für Offline-Nutzung" : "Neues Update verfügbar"}
            hasIcon={true}
            isDismissible={true}
            onDismiss={close}
          >
            {needUpdate && (
              <button onClick={() => updateServiceWorker(true)}>Aktualisieren</button>
            )}
          </Alert>
        )}
      </View>
      
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/events/new" element={<NewEventPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/invitations" element={<InvitationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
