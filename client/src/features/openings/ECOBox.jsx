import React from 'react';

const ECOBox = React.memo(function ECOBox({ eco }) {
  return (
    <span
      className="inline-flex items-center justify-center w-12 h-12 border-2 border-gold-primary text-gold-primary rounded-lg font-mono text-[20px] font-bold uppercase flex-shrink-0"
      style={{ background: 'rgba(201,168,76,0.06)' }}
    >
      {eco || '—'}
    </span>
  );
});

export default ECOBox;
