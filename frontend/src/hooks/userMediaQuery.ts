import React from 'react';
import { screens } from '../theme/styled';

type ScreenSizes = keyof typeof screens;

const getMediaQuery = (
  size: ScreenSizes,
  type: 'up' | 'down' | 'between',
  endSize?: ScreenSizes
) => {
  const minWidth = screens[size];
  const maxWidth = endSize ? screens[endSize] : undefined;

  switch (type) {
    case 'up':
      return `(min-width: ${minWidth})`;
    case 'down':
      return `(max-width: ${minWidth})`;
    case 'between':
      if (!maxWidth) throw new Error('End size is required for between type');
      return `(min-width: ${minWidth}) and (max-width: ${maxWidth})`;
    default:
      throw new Error('Invalid media query type');
  }
};

const useMediaLocalQuery = (
  size: ScreenSizes,
  type: 'up' | 'down' | 'between',
  endSize?: ScreenSizes
) => {
  const query = getMediaQuery(size, type, endSize);

  const [matches, setMatches] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false; // Default value for SSR
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaMatch = window.matchMedia(query);
    const handler = () => setMatches(mediaMatch.matches);

    mediaMatch.addListener(handler);
    handler(); // Set the initial state

    return () => {
      mediaMatch.removeListener(handler);
    };
  }, [query]);

  return matches;
};

/**
 * Custom hook to query local media data.
 *
 * This hook is used to fetch and manage media data stored locally.
 * It provides an easy way to access and manipulate media data within the application.
 *
 * @param {ScreenSizes} size - The screen size to query.
 * @param {'up' | 'down' | 'between'} type - The type of media query.
 * @param {ScreenSizes} [endSize] - The end screen size for 'between' type queries.
 *
 * @example
 * ```typescript
 * import useMediaLocalQuery from 'path/to/hooks/userMediaLocalQuery';
 *
 * const MyComponent = () => {
 *   const mediaData = useMediaLocalQuery('medium', 'up');
 *
 *   return (
 *     <div>
 *       {mediaData.map(media => (
 *         <div key={media.id}>{media.name}</div>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 *
 * @returns {boolean} A boolean indicating if the media query matches.
 */
export default useMediaLocalQuery;
