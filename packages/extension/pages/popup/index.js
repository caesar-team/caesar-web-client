import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import sprite from 'svg-sprite-loader/runtime/sprite.build';
import theme from '@caesar-utils/theme';
import { configureExtensionStore } from '@caesar-utils/root/store';
import globalStyles from '@caesar-utils/styles/globalStyles';
import { App } from '@caesar/containers';
import { NotificationProvider } from '@caesar-ui';

function run(token) {
  const GlobalStyles = createGlobalStyle`${globalStyles}`;
  const spriteContent = sprite.stringify();
  const store = configureExtensionStore();

  const root = document.getElementById('caesar-extension-root');

  if (root) {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <Fragment>
            <GlobalStyles />
            <div dangerouslySetInnerHTML={{ __html: spriteContent }} />
            <Provider store={store}>
              <App token={token} />
            </Provider>
          </Fragment>
        </NotificationProvider>
      </ThemeProvider>,
      root,
    );
  }
}

chrome.cookies &&
  chrome.cookies.get({ url: process.env.APP_URI, name: 'token' }, run);
