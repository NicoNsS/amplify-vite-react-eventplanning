import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Alert, View } from '@aws-amplify/ui-react';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  hint?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, hint?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', hint?: string) => {
    const id = Date.now();
    
    // Emoji-Prefix basierend auf Typ hinzufügen (wie im Issue gefordert)
    let emoji = '';
    switch (type) {
      case 'success': emoji = '✅ '; break;
      case 'warning': emoji = '⚠️ '; break;
      case 'error': emoji = '🚫 '; break;
      case 'info': emoji = '🎈 '; break;
    }

    setToasts((prev) => [...prev, { id, message: `${emoji}${message}`, type, hint }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View
        position="fixed"
        top="1rem"
        right="1rem"
        width={{ base: '90%', medium: '400px' }}
        style={{ zIndex: 9999 }}
      >
        {toasts.map((toast) => (
          <Alert
            key={toast.id}
            variation={toast.type === 'error' ? 'error' : toast.type === 'success' ? 'success' : toast.type === 'warning' ? 'warning' : 'info'}
            isDismissible={true}
            marginBottom="0.5rem"
            heading={toast.hint}
          >
            {toast.message}
          </Alert>
        ))}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
