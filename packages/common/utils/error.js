import { DEFAULT_ERROR_MESSAGE } from '@caesar/common/constants';

export function getServerErrorMessage(error) {
  if ([400, 403, 404].includes(error?.data?.error?.code)) {
    return error?.data?.error?.message ?? DEFAULT_ERROR_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
}

function getArrayOfChildrenErrors(children) {
  return Object.keys(children).reduce((acc, key) => {
    if (children[key].children) {
      acc.push(getArrayOfChildrenErrors(children[key].children));
    } else if (children[key]?.errors) {
      acc.push(children[key]?.errors[0]);
    }

    return acc;
  }, []);
}

// Function returns children errors like a single array
export function getServerErrors(error) {
  const children = error?.data?.errors?.children;

  if (!children) {
    return DEFAULT_ERROR_MESSAGE;
  }

  return getArrayOfChildrenErrors(children);
}

export function getChildrenErrors(children) {
  return Object.keys(children).reduce((acc, key) => {
    if (children[key].children) {
      getChildrenErrors(children[key].children);
    } else if (children[key]?.errors) {
      return { ...acc, [key]: children[key]?.errors[0] };
    }

    return acc;
  }, []);
}

// Function returns children errors like an object by field name
export function getServerErrorsByName(error) {
  const children = error?.data?.errors?.children;

  if (!children) {
    return DEFAULT_ERROR_MESSAGE;
  }

  return getChildrenErrors(children);
}
