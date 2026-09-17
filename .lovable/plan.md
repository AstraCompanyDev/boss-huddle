# Founder interviews and scrolling Latest stories

## What will change
- Add a dedicated **Founder Interviews** section to the news page.
- Use a responsive two-column editorial layout: one large featured interview on the left and a stacked set of recent interview tiles on the right.
- Reuse the existing newsroom imagery and article styling so the new section feels native to the current brand.
- Convert **Latest** into a slow, continuously auto-scrolling horizontal carousel.
- Duplicate the story sequence for a seamless loop, pause movement when readers hover or focus within it, and stop animation for reduced-motion preferences.
- Keep the Latest stories readable and swipeable on smaller screens.

## Technical details
- Update `src/pages/News.tsx` with interview content, layout, and accessible carousel markup.
- Add a newsroom-specific carousel animation to `src/index.css` using semantic styling and responsive card widths.
- Verify the page at desktop and mobile widths, including the two-column collapse and carousel behavior.
