export const getHostName = () => location.hostname;

export const getDomainName = hostname => {
  if (!hostname) return '';

  const regex = hostname.match(/^(.+?).caesar.team$/);

  return regex ? regex[1] : hostname;
};
