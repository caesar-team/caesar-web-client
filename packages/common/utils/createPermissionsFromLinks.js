export const createPermissionsFromLinks = links =>
  links
    ? Object.keys(links).reduce(
        (accumulator, key) => ({
          ...accumulator,
          [key]: !!links[key],
        }),
        {},
      )
    : {};
