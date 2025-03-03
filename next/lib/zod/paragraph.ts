import { z } from "zod";

export const FormattedTextSchema = z.object({
  type: z.literal("paragraph--formatted_text"),
  id: z.string(),
  field_formatted_text: z.object({
    processed: z.string(),
  }),
  field_heading: z.string().nullable(),
});

export const ImageShape = z.object({
  type: z.literal("file--file"),
  id: z.string(),
  filename: z.string(),
  uri: z
    .object({
      url: z.string(),
    })
    .nullable(),
  resourceIdObjMeta: z.object({
    alt: z.string().nullable(),
    title: z.string().nullable(),
    width: z.number(),
    height: z.number(),
  }),
});

export const ImageSchema = z.object({
  type: z.literal("paragraph--image"),
  id: z.string(),
  field_image: z
    .object({
      type: z.literal("media--image"),
      id: z.string(),
      field_media_image: ImageShape,
    })
    .nullable()
    .optional(),
});

export const VideoSchema = z.object({
  type: z.literal("paragraph--video"),
  id: z.string(),
  field_video: z
    .object({
      type: z.literal("media--remote_video"),
      id: z.string(),
      name: z.string(),
      field_media_oembed_video: z.string(),
    })
    .nullable(),
});

export const LinksSchema = z.object({
  type: z.literal("paragraph--links"),
  id: z.string(),
  field_links: z.array(
    z.object({
      title: z.string(),
      full_url: z.string(),
    })
  ),
});

export const AccordionItemSchema = z.object({
  type: z.literal("paragraph--accordion_item"),
  id: z.string(),
  field_heading: z.string(),
  field_content_elements: z.array(
    z.discriminatedUnion("type", [
      FormattedTextSchema,
      ImageSchema,
      VideoSchema,
      LinksSchema,
    ])
  ),
});

export const AccordionSchema = z.object({
  type: z.literal("paragraph--accordion"),
  id: z.string(),
  field_heading: z.string(),
  field_accordion_items: z.array(AccordionItemSchema),
});

export type FormattedText = z.infer<typeof FormattedTextSchema>;
export type Image = z.infer<typeof ImageSchema>;
export type Video = z.infer<typeof VideoSchema>;
export type Links = z.infer<typeof LinksSchema>;
export type Accordion = z.infer<typeof AccordionSchema>;
export type AccordionItem = z.infer<typeof AccordionItemSchema>;

export type Paragraph =
  | FormattedText
  | Image
  | Video
  | Links
  | Accordion
  | AccordionItem;
