import type { AppProps } from 'next/app';
import { withHydrate } from 'effector-next';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

const enhance = withHydrate();

export default enhance(MyApp);
