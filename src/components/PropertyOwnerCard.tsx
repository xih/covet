import React from "react";
import { CardContent } from "~/components/ui/card";
import { titleCase } from "title-case";

import { Button } from "~/components/ui/button";

type PropertyOwnerCard = {
  name: string;
};

export default function PropertyOwnerCard({ name }: PropertyOwnerCard) {
  const dorkingString = "filetype:pdf OR filetype:xlsx OR filetype:docx";
  return (
    <CardContent className="grid overflow-hidden px-0 py-0">
      <div className="flex items-center justify-between space-x-2 overflow-hidden rounded-md py-2  pl-4 pr-2 transition-all hover:bg-accent hover:text-accent-foreground">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">
            {titleCase(name.toLowerCase())}
          </p>
        </div>
        <div className="flex flex-row items-end justify-end gap-x-1">
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => {
              const encodedName = encodeURIComponent('"' + name + '"');
              const searchUrl = `https://www.google.com/search?q=${encodedName}`;
              window.open(searchUrl, "_blank");
            }}
          >
            Search
          </Button>
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => {
              const encodedName = encodeURIComponent(
                '"' + name + '"' + " " + dorkingString,
              );
              const searchUrl = `https://www.google.com/search?q=${encodedName}`;
              window.open(searchUrl, "_blank");
            }}
          >
            Scan
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
