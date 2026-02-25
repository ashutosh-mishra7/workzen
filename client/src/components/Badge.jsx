const badgeStyles = {
  Pending: {
    bg: "#1F2937",
    color: "#F59E0B",
    border: "#374151",
  },
  "In Progress": {
    bg: "#1F2937",
    color: "#D1D5DB",
    border: "#374151",
  },
  Completed: {
    bg: "#1F2937",
    color: "#10B981",
    border: "#374151",
  },
  "Not Started": {
    bg: "#1F2937",
    color: "#9CA3AF",
    border: "#374151",
  },

  Low: {
    bg: "#1F2937",
    color: "#10B981",
    border: "#374151",
  },
  Medium: {
    bg: "#1F2937",
    color: "#F59E0B",
    border: "#374151",
  },
  High: {
    bg: "#1F2937",
    color: "#EF4444",
    border: "#374151",
  },
};

const sizeStyles = {
  sm: "text-xs px-2.5 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-sm px-3.5 py-1.5",
};

const Badge = ({ label, size = "sm", className = "" }) => {
  const style =
    badgeStyles[label] || {
      bg: "#1F2937",
      color: "#9CA3AF",
      border: "#374151",
    };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium rounded-md border
        whitespace-nowrap leading-none
        transition-colors duration-150
        ${sizeStyles[size]}
        ${className}
      `}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        borderColor: style.border,
      }}
    >
      {label}
    </span>
  );
};

export default Badge;