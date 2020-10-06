import { useDispatch } from 'react-redux';
import { useIsomorphicLayoutEffect } from 'react-use';
import { logout } from '@caesar/common/actions/user';

const LogoutPage = () => {
  const dispatch = useDispatch();

  useIsomorphicLayoutEffect(() => {
    dispatch(logout());
  });

  return null;
};

export default LogoutPage;
