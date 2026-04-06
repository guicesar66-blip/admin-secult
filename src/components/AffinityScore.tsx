interface AffinityScoreProps {
  score: number; // 0–100
  size?: number;
}

const AffinityScore = ({ score, size = 64 }: AffinityScoreProps) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color =
    score > 80 ? "#00A84F" : score >= 60 ? "#FFBD0C" : "#C41200";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="relative rounded-full bg-card/90 dark:bg-pe-dark/90 shadow"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color }}
        >
          <span className="text-[11px] font-bold leading-none">{score}%</span>
        </div>
      </div>
      <span className="text-[9px] font-semibold text-white drop-shadow leading-none">
        Afinidade
      </span>
    </div>
  );
};

export default AffinityScore;
