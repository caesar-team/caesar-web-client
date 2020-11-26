import React, { createContext, useState, useCallback } from 'react';
import { Notification } from './Notification';

export const NotificationContext = createContext({
  notification: null,
  show: () => {},
  hide: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const hide = (stopTimer = Function.prototype) => {
    setNotification(null);
    stopTimer();
  };

  const show = notif => {
    setNotification({
      ...notif,
      options: {
        position: 'top-center',
        timeout: 2500,
        ...notif.options,
      },
    });
  };

  const contextValue = {
    notification,
    show: useCallback(notif => show(notif), []),
    hide: useCallback(() => hide(), []),
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {notification && <Notification notification={notification} hide={hide} />}
    </NotificationContext.Provider>
  );
};
