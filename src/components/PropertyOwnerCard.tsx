import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { titleCase } from "title-case";
import { BellIcon, EyeNoneIcon, PersonIcon } from "@radix-ui/react-icons";

import { BellRing, Check } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import Link from "next/link";
import mixpanel from "mixpanel-browser";

type CardProps = React.ComponentProps<typeof Card>;

type PropertyOwnerCard = {
  name: string;
};

export function DemoNotifications() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose what you want to be notified about.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <BellIcon className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Everything</p>
            <p className="text-sm text-muted-foreground">
              Email digest, mentions & all activity.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PropertyOwnerCard({
  name,
  ...props
}: PropertyOwnerCard) {
  console.log("name", name.toLowerCase());
  console.log("title", titleCase(name.toLowerCase()));

  const dorkingString = "filetype:pdf OR filetype:xlsx OR filetype:docx";
  return (
    <CardContent className="grid gap-1 overflow-hidden px-1">
      <div className="-mx-2 flex items-center justify-between space-x-4 overflow-hidden rounded-md p-2 py-4 transition-all hover:bg-accent hover:text-accent-foreground">
        {/* <BellIcon className="mt-px h-5 w-5" /> */}
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">
            {titleCase(name.toLowerCase())}
          </p>
          {/* <p className="text-sm text-muted-foreground">
            Email digest, mentions & all activity.
          </p> */}
        </div>
        <div className="flex flex-row items-end justify-end gap-x-1">
          <Button
            variant="secondary"
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
            variant="secondary"
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
    // <div>PropertyOwnerCard</div>;
    // <Card className={cn("w-full ")} {...props}>
    //   <CardHeader className="px-4 pb-2">
    //     <CardTitle className="text-lg">
    //       {titleCase(name.toLowerCase())}
    //     </CardTitle>
    //   </CardHeader>
    //   <CardContent className="grid px-4 pt-0">
    //     <div className="flex flex-row gap-2">
    //       <Button
    //         variant="secondary"
    //         className="text-xs"
    //         onClick={() => {
    //           const encodedName = encodeURIComponent('"' + name + '"');
    //           const searchUrl = `https://www.google.com/search?q=${encodedName}`;
    //           window.open(searchUrl, "_blank");
    //         }}
    //       >
    //         Google Search
    //       </Button>
    //       <Button
    //         variant="secondary"
    //         className="text-xs"
    //         onClick={() => {
    //           const encodedName = encodeURIComponent(
    //             '"' + name + '"' + " " + dorkingString,
    //           );
    //           const searchUrl = `https://www.google.com/search?q=${encodedName}`;
    //           window.open(searchUrl, "_blank");
    //         }}
    //       >
    //         Advanced Search
    //       </Button>
    //     </div>
    //   </CardContent>
    //   {/* <CardFooter> */}
    //   {/* <Button className="w-full">
    //       <Check className="mr-2 h-4 w-4" /> Mark all as read
    //     </Button> */}
    //   {/* </CardFooter> */}
    // </Card>
  );
}
