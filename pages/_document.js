import React from 'react';
// eslint-disable-next-line
import { default as NextDocument, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import styles from 'common/styles/antd.overrides.less';

export default class Document extends NextDocument {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />),
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {this.props.styleTags}
          <style dangerouslySetInnerHTML={{ __html: styles }} />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:400"
            rel="stylesheet"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/static/images/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/images/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/images/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/images/favicon/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/static/images/favicon/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
