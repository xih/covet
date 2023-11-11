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

// //@ts-ignore-3 adf
// function toTitleCase(str): string {
//   return str.replace(/\w\S*/g, function (txt): string {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
// }

export const Modal = (props: ModalProps) => {
  const { location = "", grantor, grantee, lat, lon, isOpen } = props;

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
          <SheetDescription className="text-left">
            <p>
              Current Owner:{" "}
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
              Previous Owner:{" "}
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
              <br />
              Coordinates:
              <br />
              <span className="font-medium text-slate-900">
                {lat},{lon}
              </span>
            </p>
            <br />
            <p>Find on:</p>
            <div className="flex flex-col justify-start gap-2">
              <div className="flex grow flex-row gap-1">
                <Link
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    "zillow" + prettyLocation + "san francisco",
                  )}`}
                  target="_blank"
                  onClick={() => {
                    mixpanel.track("searched address", {
                      type: "zillow",
                      address: prettyLocation,
                    });
                  }}
                >
                  <Button variant="outline" className="grow">
                    Zillow
                  </Button>
                </Link>

                <Link
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    "trulia" + prettyLocation + "san francisco",
                  )}`}
                  target="_blank"
                  onClick={() => {
                    mixpanel.track("searched address", {
                      type: "trulia",
                      address: prettyLocation,
                    });
                  }}
                >
                  <Button variant="outline">Trulia</Button>
                </Link>
                <Link
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    "redfin" + prettyLocation + "san francisco",
                  )}`}
                  target="_blank"
                  onClick={() => {
                    mixpanel.track("searched address", {
                      type: "redfin",
                      address: prettyLocation,
                    });
                  }}
                >
                  <Button variant="outline">Redfin</Button>
                </Link>
                <Link
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    "compass" + prettyLocation + "san francisco",
                  )}`}
                  target="_blank"
                  onClick={() => {
                    mixpanel.track("searched address", {
                      type: "compass",
                      address: prettyLocation,
                    });
                  }}
                >
                  <Button variant="outline">Compass</Button>
                </Link>
              </div>
              <Link
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  prettyLocation + "san francisco",
                )}`}
                target="_blank"
                onClick={() => {
                  mixpanel.track("searched address", {
                    type: "google maps",
                    address: prettyLocation,
                  });
                }}
              >
                <Button variant="outline">Google Maps</Button>
              </Link>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
