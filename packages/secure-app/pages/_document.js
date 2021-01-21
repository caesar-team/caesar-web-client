import React from 'react';
import {
  // eslint-disable-next-line import/no-named-default
  default as NextDocument,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import styled, { ServerStyleSheet } from 'styled-components';
import { PORTAL_ID } from '@caesar/common/constants';
import sprite from 'svg-sprite-loader/runtime/sprite.build';

const Body = styled.body``;

export default class Document extends NextDocument {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />),
    );
    const styleTags = sheet.getStyleElement();
    const spriteContent = sprite.stringify();

    return { ...page, styleTags, spriteContent };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {this.props.styleTags}
          <link rel="icon" href="/public/images/favicon/favicon.ico" />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/public/images/favicon/safari-pinned-tab.svg"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/public/images/favicon/apple-touch-icon.png"
          />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <Body>
          <div dangerouslySetInnerHTML={{ __html: this.props.spriteContent }} />
          <div id={PORTAL_ID} />
          <Main />
          <NextScript />
        </Body>
      </Html>
    );
  }
}
