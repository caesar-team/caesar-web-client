import { redirectTo } from '@caesar/common/utils/routerUtils';
import { ROUTES } from '@caesar/common/constants';

const SettingsIndexPage = () => null;

SettingsIndexPage.getInitialProps = async ({ res }) =>
  redirectTo(res, ROUTES.SETTINGS + ROUTES.TEAM);

export default SettingsIndexPage;
