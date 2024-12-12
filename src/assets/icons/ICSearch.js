export function ICSearch({
  width = "24",
  height = "24",
  fillColor = "gray",
  className = "",
}){
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="11.7664"
        cy="11.7666"
        r="8.98856"
        stroke={fillColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.0181 18.4851L21.5421 22"
        stroke={fillColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
