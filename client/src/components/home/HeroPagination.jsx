import { Pause, Play } from "lucide-react";
import Container from "../ui/Container";

const pad = (n) => String(n).padStart(2, "0");

// Custom pagination. The active line's fill is driven by progressRef (transform only).
export default function HeroPagination({
  count,
  activeIndex,
  onSelect,
  progressRef,
  animated,
  showToggle,
  playing,
  onTogglePlay,
}) {
  return (
    <div className="absolute inset-x-0 bottom-4 z-20 md:bottom-8">
      <Container>
        <div className="flex items-center gap-4 text-white">
          <span className="text-sm tabular-nums" aria-hidden="true">
            {pad(activeIndex + 1)} / {pad(count)}
          </span>

          <div className="flex items-center">
            {Array.from({ length: count }, (_, i) => {
              const active = i === activeIndex;
              const initialScale = active && !animated ? 1 : 0;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active ? "true" : undefined}
                  className="flex h-11 w-12 items-center"
                >
                  <span className="relative block h-0.5 w-full overflow-hidden bg-white/40">
                    <span
                      ref={active ? progressRef : undefined}
                      className="absolute inset-0 origin-left bg-white"
                      style={{ transform: `scaleX(${initialScale})` }}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {showToggle && (
            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 hover:bg-white/10"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          )}
        </div>
      </Container>
    </div>
  );
}