import { Play, ChevronRight, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import shortThumb1 from "@/assets/short-thumb-1.jpg";
import shortThumb2 from "@/assets/short-thumb-2.jpg";
import shortThumb3 from "@/assets/short-thumb-3.jpg";
import shortThumb4 from "@/assets/short-thumb-4.jpg";
import shortThumb5 from "@/assets/short-thumb-5.jpg";
import shortThumb6 from "@/assets/short-thumb-6.jpg";
import { useRef, useState } from "react";

const shorts = [
  { id: 1, thumbnail: shortThumb1, title: "Morning Routine", duration: "0:47", author: "Jake M.", video: "/videos/founder-video.mp4" },
  { id: 2, thumbnail: shortThumb2, title: "Pitch Tips", duration: "1:46", author: "Sarah K.", video: "/videos/founder-video.mp4" },
  { id: 3, thumbnail: shortThumb3, title: "Idea Validation", duration: "1:02", author: "Alex R.", video: "/videos/founder-video.mp4" },
  { id: 4, thumbnail: shortThumb4, title: "We Shipped It!", duration: "0:38", author: "Team Bolt", video: "/videos/founder-video.mp4" },
  { id: 5, thumbnail: shortThumb5, title: "Founder Story", duration: "2:11", author: "Chris P.", video: "/videos/founder-video.mp4" },
  { id: 6, thumbnail: shortThumb6, title: "Growth Hacks", duration: "1:24", author: "Nina T.", video: "/videos/founder-video.mp4" },
];

export default function ShortsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeShort, setActiveShort] = useState<typeof shorts[0] | null>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
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
              onClick={() => setActiveShort(short)}
              className="relative flex-shrink-0 w-[150px] md:w-[170px] rounded-2xl overflow-hidden cursor-pointer group/card hover:scale-[1.03] transition-transform"
            >
              <div className="aspect-[9/16] relative">
                <img src={short.thumbnail} alt={short.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center">
                    <Play className="h-5 w-5 text-foreground fill-foreground ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-12 left-3 flex items-center gap-1">
                  <Play className="h-3 w-3 text-white fill-white" />
                  <span className="text-white text-xs font-medium">{short.duration}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-semibold leading-tight">{short.title}</p>
                  <p className="text-white/70 text-xs mt-0.5">{short.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Video Player Dialog */}
      <Dialog open={!!activeShort} onOpenChange={(open) => !open && setActiveShort(null)}>
        <DialogContent className="p-0 border-none bg-black max-w-sm w-[90vw] rounded-2xl overflow-hidden [&>button]:hidden">
          <VisuallyHidden><DialogTitle>Playing video</DialogTitle></VisuallyHidden>
          <div className="relative aspect-[9/16]">
            {activeShort && (
              <video
                src={activeShort.video}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={() => setActiveShort(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-semibold">{activeShort?.title}</p>
              <p className="text-white/70 text-sm">{activeShort?.author}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
