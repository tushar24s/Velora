import { forwardRef, useEffect, useMemo, useState } from "react";
import { buildImageFallback, getPreferredImageSrc } from "../utils/helpers";

const AppImage = forwardRef(({ src, alt, label, onError, loading = "lazy", ...props }, ref) => {
  const preferredSrc = useMemo(
    () => getPreferredImageSrc(src, label || alt || ""),
    [alt, label, src]
  );
  const fallbackSrc = useMemo(
    () => buildImageFallback(label || alt || "Velora"),
    [alt, label]
  );
  const [currentSrc, setCurrentSrc] = useState(preferredSrc || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(preferredSrc || fallbackSrc);
  }, [preferredSrc, fallbackSrc]);

  const handleError = (event) => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }

    onError?.(event);
  };

  return (
    <img
      {...props}
      ref={ref}
      src={currentSrc}
      alt={alt}
      loading={loading}
      onError={handleError}
    />
  );
});

AppImage.displayName = "AppImage";

export default AppImage;
