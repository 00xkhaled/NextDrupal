import { MediaImage } from "@/components/media--image";
import { Image } from "@/lib/zod/paragraph";

export function ParagraphImage({ paragraph }: { paragraph: Image }) {
  return <MediaImage media={paragraph.field_image} priority />;
}
