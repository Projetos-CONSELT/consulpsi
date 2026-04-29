type SectionDividerProps = {
  fromColor: string;
  toColor: string;
  className?: string;
  flip?: boolean;
};

const SectionDivider = ({ fromColor, toColor, className = "h-20 md:h-24", flip = false }: SectionDividerProps) => {
  // Use an SVG with preserveAspectRatio="none" to avoid subpixel seams between backgrounds
  // Extend polygon slightly beyond 100% to prevent 1px seam on some viewports
  const points = flip ? "0,0 100,100 0,102 0,0" : "0,102 100,0 100,100 0,102";

  return (
    <div className={`relative ${className}`} style={{ backgroundColor: fromColor }} aria-hidden>
      <svg
        className="absolute inset-0 w-full h-full block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: "none", display: "block", transform: "translateZ(0)" }}
        shapeRendering="geometricPrecision"
        aria-hidden
      >
        <polygon points={points} fill={toColor} />
      </svg>
    </div>
  );
};

export default SectionDivider;
