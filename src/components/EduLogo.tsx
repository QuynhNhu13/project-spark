const EduLogo = ({ size = 36, className = "" }: { size?: number; className?: string }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded square background */}
      <rect width="48" height="48" rx="14" className="fill-primary" />
      
      {/* Graduation cap / connection + E letter */}
      {/* Cap top */}
      <path
        d="M24 10L10 18L24 26L38 18L24 10Z"
        className="fill-neon"
        opacity="0.9"
      />
      {/* Cap body */}
      <path
        d="M16 20.5V28C16 28 19 32 24 32C29 32 32 28 32 28V20.5L24 25.5L16 20.5Z"
        className="fill-primary-foreground"
        opacity="0.85"
      />
      {/* Tassel line */}
      <path
        d="M36 18V30"
        stroke="hsl(82, 100%, 54%)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Tassel ball */}
      <circle cx="36" cy="31" r="2" className="fill-neon" />
      
      {/* AI spark dots */}
      <circle cx="10" cy="12" r="1.5" className="fill-neon" opacity="0.6" />
      <circle cx="38" cy="10" r="1" className="fill-neon" opacity="0.4" />
      <circle cx="8" cy="30" r="1" className="fill-neon" opacity="0.3" />
      
      {/* Connection lines (subtle) */}
      <path
        d="M12 36L18 33M36 36L30 33"
        stroke="hsl(82, 100%, 54%)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
};

export default EduLogo;
