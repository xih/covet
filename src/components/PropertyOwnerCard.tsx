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

import { BellRing, Check } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import Link from "next/link";
import mixpanel from "mixpanel-browser";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

type CardProps = React.ComponentProps<typeof Card>;

export function CardDemo({ className, ...props }: CardProps) {
  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
          <Switch />
        </div>
        <div>
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Check className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter>
    </Card>
  );
}

type PropertyOwnerCard = {
  name: string;
};

export default function PropertyOwnerCard({
  name,
  ...props
}: PropertyOwnerCard) {
  console.log("name", name.toLowerCase());
  console.log("title", titleCase(name.toLowerCase()));

  const dorkingString = "filetype:pdf OR filetype:xlsx OR filetype:docx";
  return (
    // <div>PropertyOwnerCard</div>;
    <Card className={cn("w-full ")} {...props}>
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-lg">
          {titleCase(name.toLowerCase())}
        </CardTitle>
        {/* <CardDescription>You have 3 unread messages.</CardDescription> */}
      </CardHeader>
      <CardContent className="grid px-4 pt-0">
        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            className="text-xs"
            onClick={() => {
              const encodedName = encodeURIComponent('"' + name + '"');
              const searchUrl = `https://www.google.com/search?q=${encodedName}`;
              window.open(searchUrl, "_blank");
            }}
          >
            Google Search
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
            Advanced Search
          </Button>
        </div>
      </CardContent>
      {/* <CardFooter> */}
      {/* <Button className="w-full">
          <Check className="mr-2 h-4 w-4" /> Mark all as read
        </Button> */}
      {/* </CardFooter> */}
    </Card>
  );
}
