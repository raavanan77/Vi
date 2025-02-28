// Dependencies: pnpm install emblor
// Add the following to tailwind.config.ts: "./node_modules/emblor/dist/index.mjs",

"use client";
import { Tag, TagInput } from "emblor";
import { useEffect, useState } from "react";

interface InputDemoProps {
  tags: { [key: string]: string[] }; // Dictionary format
}

export default function InputDemo({ tags }: InputDemoProps) {
  const [exampleTags, setExampleTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  useEffect(() => {
    // Flatten the dictionary into a list of tags
    const flattenedTags = Object.values(tags)
      .flat()
      .map((text, index) => ({
        id: `${index}`, // Using index as id for each tag (adjust as needed)
        text,
      }));
    setExampleTags(flattenedTags); // Update the state with the flattened tags
  }, [tags]);

  return (
    <div className="space-y-2">
      <TagInput
        id="input-57"
        tags={exampleTags}
        setTags={(newTags) => {
          setExampleTags(newTags);
        }}
        placeholder="Select Test case"
        styleClasses={{
          inlineTagsContainer:
            "border-input rounded-lg bg-background shadow-sm shadow-black/5 transition-shadow focus-within:border-ring focus-within:outline-none focus-within:ring-[3px] focus-within:ring-ring/20 p-1 gap-1",
          input:
            "w-full min-w-[80px] focus-visible:outline-none shadow-none px-2 h-7",
          tag: {
            body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-e-lg flex size-7 transition-colors outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 text-muted-foreground/80 hover:text-foreground",
          },
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
      />
    </div>
  );
}
