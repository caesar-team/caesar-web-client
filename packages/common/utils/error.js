import { DEFAULT_ERROR_MESSAGE } from '@caesar/common/constants';

export function getServerErrorMessage(error) {
  try {
    return error.data.error.message;
  } catch (e) {
    return DEFAULT_ERROR_MESSAGE;
  }
}

function getChildrenErrors(children) {
  return Object.keys(children).reduce((acc, key) => {
    if (children[key].children) {
      acc.push(getChildrenErrors(children[key].children));
    } else {
      acc.push(children[key].errors[0]);
    }
    return acc;
  }, []);
}

export function getServerErrorByNames(error) {
  const children = error?.data?.errors?.children;

  if (!children) {
    return DEFAULT_ERROR_MESSAGE;
  }

  return getChildrenErrors(children);
}
