/*
 * PhotoSlot — production replacement for the design's <image-slot> web component.
 * Renders an elegant placeholder (frame + dashed ring + caption) matching the
 * prototype's empty state, or a real licensed photo when `src` is provided.
 * (The prototype's drag-drop/localStorage behavior is a design-tool feature and
 * is intentionally omitted; fill these by passing real image URLs.)
 */

type Variant = "slot-light" | "slot-dark" | "slot-26";
type Shape = "circle" | "rounded";

export function PhotoSlot({
  variant,
  shape = "rounded",
  radius = 12,
  placeholder,
  src,
  alt,
  objectPosition,
  priority = false,
}: {
  variant: Variant;
  shape?: Shape;
  radius?: number;
  placeholder: string;
  src?: string;
  alt?: string;
  /** CSS object-position for the crop (e.g. "center 22%" to keep a face in frame). */
  objectPosition?: string;
  /** Eager-load above-the-fold images; everything else lazy-loads. */
  priority?: boolean;
}) {
  const borderRadius = shape === "circle" ? "50%" : `${radius}px`;
  const filled = Boolean(src);

  return (
    <div
      className={`photo-slot ${variant}${filled ? " filled" : ""}`}
      style={{ borderRadius }}
    >
      <div className="ps-frame">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="ps-img"
            src={src}
            alt={alt ?? placeholder}
            draggable={false}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            style={objectPosition ? { objectPosition } : undefined}
          />
        )}
      </div>
      {!filled && (
        <>
          <div className="ps-empty">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <div className="ps-cap">{placeholder}</div>
          </div>
          <div className="ps-ring" />
        </>
      )}
    </div>
  );
}
