import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, Alert, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import React, { Suspense, lazy } from "react";

import { TourProvider } from "./components/TourProvider";
import AppShell from "./components/AppShell";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { theme } from "./theme";
import { usePWA } from "./hooks/usePWA";
import { useNetworkStatus } from "./hooks/useNetworkStatus";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NewEventPage = lazy(() => import("./pages/NewEventPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const InvitationsPage = lazy(() => import("./pages/InvitationsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));

function App() {
  const { offlineReady, needUpdate, updateServiceWorker, close } = usePWA();
  const { isOffline } = useNetworkStatus();

  return (
    <ThemeProvider theme={theme}>
      <>
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
        
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <TourProvider>
            <AppShell>
              <Suspense fallback={<LoadingSpinner fullPage />}>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/events/new" element={<NewEventPage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/invitations" element={<InvitationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </Suspense>
            </AppShell>
          </TourProvider>
        </BrowserRouter>
      </>
    </ThemeProvider>
  );
}

export default App;
