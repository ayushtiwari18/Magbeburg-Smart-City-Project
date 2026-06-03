import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20 ${className}`}
    >
      {children}
    </div>
  );
}
