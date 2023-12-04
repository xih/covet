import mixpanel from "mixpanel-browser";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "~/components/ui/sheet";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export type ModalProps = {
  isOpen: boolean;
  location?: string;
  grantor?: string;
  grantee?: string;
  lat?: number;
  lon?: number;
  // onOpenChange: (open: boolean) => void;
  // drawerOpened: boolean;
};

import type { PropsWithChildren } from "react";

// //@ts-ignore-3 adf
// function toTitleCase(str): string {
//   return str.replace(/\w\S*/g, function (txt): string {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
// }

export const Modal = (props: ModalProps & PropsWithChildren) => {
  const { location = "", grantor, grantee, lat, lon, isOpen, children } = props;

  const first = location.slice(0, 4);
  const middle = location.slice(4, -4);
  const last = location.slice(-4);

  const prettyLocation = [
    first.replace(/^0+/, ""),
    middle.trim().replace(/^0+/, ""),
    last.replace(/^0+/, ""),
  ].join(" ");

  return (
    <Sheet open={isOpen} modal={false}>
      <SheetContent
        showCloseButton={false}
        side={window.innerWidth > 800 ? "right" : "bottom"}
        // classname from here:
        // https://github.com/shadcn-ui/ui/issues/16
        className="max-h-screen overflow-y-scroll"
      >
        <SheetHeader>
          <SheetTitle className="text-left">
            <p key={prettyLocation} className="underline">
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Link
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        prettyLocation,
                      )}`}
                      target="_blank"
                      onClick={() => {
                        mixpanel.track("search address on google", {
                          type: "address",
                          location: prettyLocation,
                        });
                      }}
                    >
                      {prettyLocation}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search on Google</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
          </SheetTitle>
          <br />
          <SheetDescription className="text-left">{children}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
