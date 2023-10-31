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
  onOpenChange: (open: boolean) => void;
  // drawerOpened: boolean;
};

// //@ts-ignore-3 adf
// function toTitleCase(str): string {
//   return str.replace(/\w\S*/g, function (txt): string {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
// }

export const Modal = (props: ModalProps) => {
  const {
    location = "",
    grantor,
    grantee,
    lat,
    lon,
    onOpenChange,
    isOpen,
  } = props;

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
      >
        <SheetHeader>
          <SheetTitle className="text-left"> {prettyLocation}</SheetTitle>
          <SheetDescription className="text-left">
            <p>
              Grantee:{" "}
              <span className="font-medium text-slate-900">
                {grantee?.split(",").map((name) => (
                  <p key={name} className="underline">
                    <TooltipProvider>
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                          <Link
                            href={`https://www.google.com/search?q=${encodeURIComponent(
                              name,
                            )}`}
                            target="_blank"
                            onClick={() => {
                              mixpanel.track("searched on google", {
                                type: "grantee",
                                name: name,
                              });
                            }}
                          >
                            {name}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Search on Google</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </p>
                ))}
              </span>
            </p>
            <br />

            <p>
              Grantor:{" "}
              <span className="font-medium text-slate-900">
                {grantor?.split(",").map((name) => {
                  return (
                    <p key={name} className="underline">
                      <TooltipProvider>
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <Link
                              href={`https://www.google.com/search?q=${encodeURIComponent(
                                name,
                              )}`}
                              target="_blank"
                              onClick={() => {
                                mixpanel.track("searched on google", {
                                  type: "grantor",
                                  name: name,
                                });
                              }}
                              // add mixpanel event here:
                            >
                              {name}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Search on Google</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </p>
                  );
                })}
              </span>{" "}
            </p>
            <br />

            <p>
              Coordinates:
              <br />
              <span className="font-medium text-slate-900">
                {lat},{lon}
              </span>
            </p>
            <br />
            {/* <Link
              href={`https://www.google.com/search?q=${grantee}`}
              target="_blank"
              // add mixpanel event here:
            >
              <Button
                onClick={() => {
                  mixpanel.track("searched on google", {
                    "Property name": location,
                    Grantor: grantor,
                    Grantee: grantee,
                  });
                }}
              >
                Who is {grantee}?
              </Button>
            </Link> */}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
