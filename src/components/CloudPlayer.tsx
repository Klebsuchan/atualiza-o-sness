import React, { useRef, useState, useEffect } from 'react';

interface CloudPlayerProps {
  playUrl: string;
  title: string;
  joinCode?: string;
  iframeRef?: React.RefObject<HTMLIFrameElement>;
}

export function CloudPlayer({ playUrl, title, joinCode, iframeRef }: CloudPlayerProps) {
  // If the playUrl is from ssega.com, we proxy it to hide their layout
  let finalUrl = playUrl;
  if (playUrl.includes('ssega.com')) {
    finalUrl = `/api/ssega-embed?url=${encodeURIComponent(playUrl)}`;
    if (joinCode) {
      finalUrl += `&join=${encodeURIComponent(joinCode)}`;
    }
  } else {
    if (joinCode) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + `join=${encodeURIComponent(joinCode)}`;
    }
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
