type MilaConnectMarkProps = {
  filled?: boolean;
  className?: string;
};

export function MilaConnectMark({ filled = false, className = "" }: MilaConnectMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={`mila-connect-mark ${filled ? "is-filled" : ""} ${className}`.trim()}
      data-filled={filled}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className="mila-connect-mark-fill" cx="16" cy="16" r="14.5" />
      <g className="mila-connect-mark-lines">
        <path d="M4.7 13.1C7.7 8.7 10.3 7 13.5 7.8" />
        <path d="M27.3 13.1C24.3 8.7 21.7 7 18.5 7.8" />
        <path d="M8.2 14.9L12.7 11C13.7 10.1 15.2 10.2 16.1 11.1L18.6 13.4C19.3 14 20.3 14 21 13.4" />
        <path d="M8.7 16.5L13 20.2C14 21.1 15.5 21.1 16.5 20.2L23.7 14" />
        <path d="M11.1 18.5L9.8 19.7M13.7 20.2L12.6 21.3M16.2 20.3L15.3 21.2" />
      </g>
    </svg>
  );
}
