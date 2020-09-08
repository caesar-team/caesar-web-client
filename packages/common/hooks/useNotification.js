import { useContext } from 'react';
import { NotificationContext } from '@caesar/components';

export const useNotification = () => {
  const { notification, show, hide } = useContext(NotificationContext);

  return {
    notification,
    show,
    hide,
  };
};
