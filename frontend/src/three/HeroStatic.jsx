export default function HeroStatic() {
  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        background:
          'linear-gradient(180deg, #060A12 0%, #0B1220 45%, #16273F 75%, #1E3350 100%)',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-[45%] opacity-90"
      >
        <polygon fill="#0F1B2E" points="0,400 0,180 220,90 420,220 640,60 900,200 1120,110 1300,230 1440,150 1440,400" />
        <polygon fill="#16273F" points="0,400 0,260 260,180 500,300 760,150 1040,290 1280,190 1440,260 1440,400" opacity="0.9" />
      </svg>
    </div>
  );
}
