const AlertBox = ({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) => {
  return (
    <div className={`flex items-start gap-3 px-3.5 py-3 mb-3 rounded-xl border border-amber-400/20 bg-amber-400/5 ${className ?? ""}`}>
      <svg
        width="15" height="15" viewBox="0 0 16 16" fill="none"
        className="shrink-0 mt-0.5 text-amber-400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        <rect x="5" y="13" width="6" height="1.2" rx="0.5" fill="currentColor"/>
        <rect x="6.5" y="6" width="3" height="1" rx="0.4" fill="currentColor"/>
        <circle cx="8" cy="9.2" r="0.7" fill="currentColor"/>
      </svg>
      <div>
        <p className="text-xs font-medium text-amber-400 leading-snug">{title}</p>
        <p className="text-xs text-amber-400/70 leading-relaxed mt-0.5">{description}</p>
      </div>
    </div>
  );
};

export default AlertBox;