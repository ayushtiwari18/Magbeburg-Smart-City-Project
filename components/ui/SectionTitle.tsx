import { ElementType } from "react";

interface SectionTitleProps {
  icon: ElementType;
  title: string;
  subtitle: string;
  color?: string;
}

export default function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  color = "#2563eb",
}: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border"
        style={{
          background: `${color}18`,
          borderColor: `${color}33`,
        }}
      >
        <Icon size={20} color={color} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#061B46] m-0 leading-tight">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5 m-0">{subtitle}</p>
      </div>
    </div>
  );
}
