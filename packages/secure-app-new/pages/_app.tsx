import { AppProps } from 'next/app';
import { withHydrate } from 'effector-next';
import globalStyles from '@caesar/assets/styles/globalStyles';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component className={globalStyles} {...pageProps} />;
}

const enhance = withHydrate();

export default enhance(MyApp);
