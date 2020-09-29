// TODO: Move to the schema
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
