import { useState } from 'react';

/**
 * Drop-in <img> replacement that swaps to a soft gradient placeholder
 * if the source fails to load, instead of showing a broken-image icon.
 */
export default function SafeImage({ src, alt, className = '', ...rest }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-duskdeep to-dusk ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-stone/30">
          Image unavailable
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}