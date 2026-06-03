export default function Container({ children, className = "" }) {
  return (
    <div
      className={`mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20 ${className}`}
    >
      {children}
    </div>
  );
}
