import Router from 'next/router';
import { isServer } from '@caesar/common/utils/isEnvironment';

export const redirectTo = (res, location, statusCode) => {
  if (isServer) {
    res.writeHead(statusCode, {
      Location: location,
    });
    res.end();
  } else {
    Router.push(location);
  }
};
