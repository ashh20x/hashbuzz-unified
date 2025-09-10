import { useEffect, useRef } from 'react';

export default function XProfileEmbed({ handle }: { handle: string }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load Twitter widget script if not already loaded
    if (!window.twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Refresh embeds
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <div ref={containerRef}>
      <a
        className='twitter-timeline'
        href={`https://twitter.com/${handle}`}
        data-width='400'
        data-height='600'
      >
        Tweets by {handle}
      </a>
    </div>
  );
}
