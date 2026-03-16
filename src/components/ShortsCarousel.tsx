import { Play, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import shortThumb1 from "@/assets/short-thumb-1.jpg";
import shortThumb2 from "@/assets/short-thumb-2.jpg";
import shortThumb3 from "@/assets/short-thumb-3.jpg";
import shortThumb4 from "@/assets/short-thumb-4.jpg";
import shortThumb5 from "@/assets/short-thumb-5.jpg";
import shortThumb6 from "@/assets/short-thumb-6.jpg";
import { useRef } from "react";

const shorts = [
  { id: 1, thumbnail: shortThumb1, title: "Morning Routine", duration: "0:47", author: "Jake M." },
  { id: 2, thumbnail: shortThumb2, title: "Pitch Tips", duration: "1:46", author: "Sarah K." },
  { id: 3, thumbnail: shortThumb3, title: "Idea Validation", duration: "1:02", author: "Alex R." },
  { id: 4, thumbnail: shortThumb4, title: "We Shipped It!", duration: "0:38", author: "Team Bolt" },
  { id: 5, thumbnail: shortThumb5, title: "Founder Story", duration: "2:11", author: "Chris P." },
  { id: 6, thumbnail: shortThumb6, title: "Growth Hacks", duration: "1:24", author: "Nina T." },
];

export default function ShortsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Founder Shorts</h3>
        <Button variant="ghost" size="sm" className="text-muted-foreground text-xs rounded-full">
          View all
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {shorts.map((short) => (
            <div
              key={short.id}
              className="relative flex-shrink-0 w-[150px] md:w-[170px] rounded-2xl overflow-hidden cursor-pointer group/card hover:scale-[1.03] transition-transform"
            >
              <div className="aspect-[9/16] relative">
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center">
                    <Play className="h-5 w-5 text-foreground fill-foreground ml-0.5" />
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-12 left-3 flex items-center gap-1">
                  <Play className="h-3 w-3 text-white fill-white" />
                  <span className="text-white text-xs font-medium">{short.duration}</span>
                </div>

                {/* Title & author */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-semibold leading-tight">{short.title}</p>
                  <p className="text-white/70 text-xs mt-0.5">{short.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}
