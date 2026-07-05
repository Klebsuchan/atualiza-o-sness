import React, { useRef, useState, useEffect } from 'react';

interface MegaDrivePlayerProps {
  playUrl: string;
  title: string;
  iframeRef?: React.RefObject<HTMLIFrameElement>;
}

export function MegaDrivePlayer({ playUrl, title, iframeRef }: MegaDrivePlayerProps) {
  // If the playUrl is from ssega.com, we proxy it to hide their layout
  let finalUrl = playUrl;
  if (playUrl.includes('ssega.com')) {
    finalUrl = `/api/ssega-embed?url=${encodeURIComponent(playUrl)}`;
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-black overflow-hidden">
      <iframe 
        ref={iframeRef}
        src={finalUrl}
        className="w-full h-full border-none bg-black"
        allow="autoplay; encrypted-media; gamepad; clipboard-read; clipboard-write"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals"
        onLoad={() => {
          iframeRef?.current?.focus();
        }}
        title={title}
      ></iframe>
    </div>
  );
}
