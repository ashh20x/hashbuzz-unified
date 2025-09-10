import React, { useEffect } from 'react';

interface CertikEmblemProps {
  projectId: string;
  dataId: string;
}

const CertikEmblem: React.FC<CertikEmblemProps> = ({ projectId, dataId }) => {
  useEffect(() => {
    // Dynamically hide the emblem to prevent a flash of default text
    const style = document.createElement('style');
    style.textContent = '.certik-emblem { display: none; }';
    document.head.appendChild(style);

    // Load the external Certik script asynchronously
    const script = document.createElement('script');
    script.src = `https://emblem.certik-assets.com/script?pid=${projectId}&vid=${dataId}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the added script and style elements on unmount
      document.head.removeChild(style);
      document.body.removeChild(script);
    };
  }, [projectId, dataId]);

  return (
    <div className='certik-emblem w-20' data-id={dataId}>
      <a
        href={`https://skynet.certik.com/projects/${projectId}?utm_source=SkyEmblem&utm_campaign=${projectId}&utm_medium=link`}
        target='_blank'
        rel='noopener noreferrer'
      >
        View project at certik.com
      </a>
    </div>
  );
};

export default CertikEmblem;
