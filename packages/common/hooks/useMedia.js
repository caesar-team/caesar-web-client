import { createBreakpoint } from 'react-use';

const useBreakpoint = createBreakpoint({
  wideDesktop: 1440, // >1440
  desktop: 1024, // 1024-1439
  tablet: 780, // 780-1023
  wideMobile: 480, // 480-779
  mobile: 320, // 320-479
});

export const useMedia = () => {
  const breakpoint = useBreakpoint();

  return {
    isWideDesktop: breakpoint === 'wideDesktop',
    isDesktop: breakpoint === 'desktop',
    isTablet: breakpoint === 'tablet',
    isWideMobile: breakpoint === 'wideMobile',
    isMobile: breakpoint === 'mobile',
  };
};
