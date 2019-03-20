import { redirectTo } from 'common/utils/routerUtils';

const SettingsIndexPage = () => null;

SettingsIndexPage.getInitialProps = async ({ res }) =>
  redirectTo(res, '/settings/manage');

export default SettingsIndexPage;
