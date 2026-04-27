export default function AuthDivider() {
  return (
    <div className="my-8 flex items-center gap-4 font-semibold text-[#7B8794]">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#7AAACE]/30 to-transparent" />
      <span>OR</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#7AAACE]/30 to-transparent" />
    </div>
  );
}