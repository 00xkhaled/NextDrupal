import dynamic from "next/dynamic";

import { ParagraphImage } from "@/components/paragraph--image";
import { ParagraphLinks } from "@/components/paragraph--links";
import { ParagraphText } from "@/components/paragraph--text";
import { Paragraph } from "@/lib/zod/paragraph";

// Use dynamic imports to defer loading a component until after initial page load: https://nextjs.org/docs/advanced-features/dynamic-import
const ParagraphVideo = dynamic(() =>
  import("./paragraph--video").then((mod) => mod.ParagraphVideo)
);

const ParagraphAccordion = dynamic(() =>
  import("./paragraph--accordion").then((mod) => mod.ParagraphAccordion)
);

export function Paragraph({ paragraph }: { paragraph: Paragraph }) {
  if (!paragraph) {
    return null;
  }

  switch (paragraph.type) {
    case "paragraph--formatted_text": {
      return <ParagraphText paragraph={paragraph} />;
    }
    case "paragraph--links": {
      return <ParagraphLinks paragraph={paragraph} />;
    }
    case "paragraph--image": {
      return <ParagraphImage paragraph={paragraph} />;
    }
    case "paragraph--video": {
      return <ParagraphVideo paragraph={paragraph} />;
    }
    case "paragraph--accordion": {
      return <ParagraphAccordion paragraph={paragraph} />;
    }
    default:
      return null;
  }
}
