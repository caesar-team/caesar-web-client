import { redirectTo } from '@caesar/common/utils/routerUtils';

const SettingsIndexPage = () => null;

SettingsIndexPage.getInitialProps = async ({ res }) =>
  redirectTo(res, '/settings/manage');

export default SettingsIndexPage;
