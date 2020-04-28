import { createBreakpoint } from 'react-use';

const useBreakpoint = createBreakpoint({
  desktop: 1024, // >1024
  tablet: 780, // 780-1023
  wideMobile: 480, // 480-779
  mobile: 320, // 320-479
});

export const useMedia = () => {
  const breakpoint = useBreakpoint();

  return {
    isDesktop: breakpoint === 'desktop',
    isTablet: breakpoint === 'tablet',
    isWideMobile: breakpoint === 'wideMobile',
    isMobile: breakpoint === 'mobile',
  };
};
