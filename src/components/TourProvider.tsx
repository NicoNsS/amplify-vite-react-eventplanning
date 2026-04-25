import React, { createContext, useContext, useEffect, useState } from 'react';
import { Joyride, Step, EventData, STATUS, ACTIONS, EVENTS } from 'react-joyride';
import { fetchUserAttributes, updateUserAttributes, getCurrentUser } from 'aws-amplify/auth';

interface TourContextType {
  startTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = [
    {
      target: '[data-tour="logo"]',
      content: 'Willkommen bei EventPlanner! Dies ist deine Zentrale. Klicke jederzeit auf das Logo, um zum Dashboard zurückzukehren.',
      title: 'Willkommen',
      placement: 'bottom',
      skipBeacon: true,
    },
    {
      target: '[data-tour="menu"]',
      content: 'Nutze dieses Menü, um zwischen Dashboard, Kalender, Einladungen und Einstellungen zu navigieren.',
      title: 'Navigation',
      placement: 'right',
    },
    {
      target: '[data-tour="fab"]',
      content: 'Klicke auf das Plus-Symbol, um ein neues Event zu planen.',
      title: 'Event erstellen',
      placement: 'left',
    },
    {
      target: '[data-tour="event-form-basics"]',
      content: 'Gib hier die grundlegenden Details deines Events ein. Pflichtfelder sind mit * markiert.',
      title: 'Basis-Infos',
      placement: 'top',
    },
    {
      target: '[data-tour="event-form-time"]',
      content: 'Wähle Datum und Uhrzeit. Nutze unsere KI-Vorschläge für optimale Zeiten!',
      title: 'Zeit & Ort',
      placement: 'top',
    },
    {
      target: '[data-tour="calendar-view"]',
      content: 'Hier siehst du alle deine Events in der Übersicht. Klicke auf ein Event für Details.',
      title: 'Kalender',
      placement: 'bottom',
    },
    {
      target: '[data-tour="qr-checkin"]',
      content: 'Beim Event kannst du diesen QR-Code zeigen oder Gäste scannen, um den Check-In zu erfassen.',
      title: 'Check-In',
      placement: 'top',
    },
    {
      target: '[data-tour="help"]',
      content: 'Du kannst diese Tour jederzeit hier oben über das Hilfe-Icon erneut starten.',
      title: 'Hilfe nötig?',
      placement: 'bottom',
    },
  ];

  useEffect(() => {
    const checkTourStatus = async () => {
      try {
        // Zuerst localStorage prüfen für schnelles Feedback
        const localSeen = localStorage.getItem('tourSeen') === 'true';
        if (localSeen) {
          return;
        }

        // Dann versuchen, Cognito Attribute zu prüfen
        try {
          const user = await getCurrentUser();
          if (user) {
            const attributes = await fetchUserAttributes();
            const tourSeen = attributes['custom:tourSeen'] === 'true';
            if (!tourSeen) {
              setRun(true);
            }
          } else {
            // Kein User eingeloggt, zeige Tour wenn localStorage sagt "nicht gesehen"
            setRun(true);
          }
        } catch (authError) {
          // Auth Fehler (z.B. nicht eingeloggt), Fallback auf localStorage
          setRun(true);
        }
      } catch (error) {
        console.error('Error checking tour status:', error);
      }
    };

    const savedStep = localStorage.getItem('tourStep');
    if (savedStep) {
      setStepIndex(parseInt(savedStep, 10));
    }

    checkTourStatus();
  }, []);

  const handleCallback = async (data: EventData) => {
    const { status, type, index, action } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false);
      localStorage.setItem('tourSeen', 'true');
      localStorage.removeItem('tourStep');

      try {
        const user = await getCurrentUser();
        if (user) {
          await updateUserAttributes({
            userAttributes: {
              'custom:tourSeen': 'true',
            },
          });
        }
      } catch (e: any) {
        // Ignoriere Fehler wenn User nicht eingeloggt ist (erwartet für Gäste)
        // oder wenn das Attribut nicht konfiguriert ist
        const isUnauthenticated = e.name === 'UserUnAuthenticatedException';
        if (!isUnauthenticated) {
          console.warn('Could not update custom:tourSeen in Cognito', e);
        }
      }
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setStepIndex(nextIndex);
      localStorage.setItem('tourStep', nextIndex.toString());
    }
  };

  const startTour = () => {
    setStepIndex(0);
    setRun(true);
  };

  return (
    <TourContext.Provider value={{ startTour }}>
      {children}
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous
        onEvent={handleCallback}
        locale={{
          back: 'Zurück',
          close: 'Schließen',
          last: 'Fertig',
          next: 'Weiter',
          skip: 'Überspringen',
        }}
        options={{
          showProgress: true,
          primaryColor: '#3041c7',
          zIndex: 10000,
          buttons: ['back', 'primary', 'skip'],
        }}
      />
    </TourContext.Provider>
  );
};
