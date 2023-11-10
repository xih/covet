import clsx from "clsx";
import { bool } from "envalid";
import React, { useState } from "react";
import { Drawer } from "vaul";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import { Badge } from "./ui/badge";

export type BottomSheetProps = {
  open: boolean;
  location?: string;
  grantee?: string;
  grantor?: string;
  lat?: number;
  lon?: number;
  onClose: () => void;
};

export default function BottomSheet(props: BottomSheetProps) {
  const { open, onClose, location, grantee, grantor } = props;
  const [snap, setSnap] = useState<number | string | null>("148px");

  return (
    <Drawer.Root
      open={open}
      onClose={onClose}
      modal={false}
      snapPoints={[0.3, 0.6, 0.95]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <Drawer.Portal>
        <Drawer.Content className="border-b-none fixed bottom-0 left-0 right-0 mx-[-1px] flex h-full max-h-[97%] flex-col rounded-t-[10px] border border-gray-200 bg-white">
          {/* <div
            className={clsx("mx-auto flex w-full max-w-md flex-col p-4 pt-5", {
              "overflow-y-auto": snap === 1,
              "overflow-hidden": snap !== 1,
            })}
          > */}
          <Drawer.NestedRoot>
            <div className="flex-1 rounded-t-[10px] bg-white p-4">
              <div className="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
              <Drawer.Title className="text-xl font-medium	">
                {location}
              </Drawer.Title>
              <br />
              <Drawer.Description>
                <div className="flex flex-col gap-y-1 text-slate-700">
                  Current Owner:{" "}
                  <span className="flex flex-wrap gap-x-2 gap-y-1.5 font-medium text-slate-900">
                    {grantee?.split(",").map((name) => (
                      <p key={name} className="">
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
                                <Badge variant="secondary">
                                  <span className="flex text-sm">{name}</span>
                                </Badge>
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
                </div>
                <br />
                <div className="flex flex-col gap-y-1">
                  <span className="gap-y-0.5 text-slate-700">
                    Previous Owner:{" "}
                  </span>
                  <div className="flex flex-wrap gap-x-2 gap-y-1.5 font-medium text-slate-900">
                    {grantor?.split(",").map((name) => {
                      return (
                        <div key={name}>
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
                                >
                                  <Badge variant="secondary">
                                    <span className="flex text-sm">{name}</span>
                                  </Badge>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Search on Google</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <br />
                <div className="flex flex-col gap-y-1">
                  <p className="text-slate-800">Find on:</p>
                  <div className="flex flex-wrap justify-start gap-1">
                    <div className="flex grow flex-row gap-1">
                      <Link
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          "zillow " + location + " san francisco",
                        )}`}
                        target="_blank"
                        onClick={() => {
                          mixpanel.track("searched address", {
                            type: "zillow",
                            address: location,
                          });
                        }}
                      >
                        <Button variant="outline" className="grow">
                          Zillow
                        </Button>
                      </Link>

                      <Link
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          "trulia " + location + " san francisco",
                        )}`}
                        target="_blank"
                        onClick={() => {
                          mixpanel.track("searched address", {
                            type: "trulia",
                            address: location,
                          });
                        }}
                      >
                        <Button variant="outline">Trulia</Button>
                      </Link>
                      <Link
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          "redfin " + location + " san francisco",
                        )}`}
                        target="_blank"
                        onClick={() => {
                          mixpanel.track("searched address", {
                            type: "redfin",
                            address: location,
                          });
                        }}
                      >
                        <Button variant="outline">Redfin</Button>
                      </Link>
                      <Link
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          "compass " + location + " san francisco",
                        )}`}
                        target="_blank"
                        onClick={() => {
                          mixpanel.track("searched address", {
                            type: "compass",
                            address: location,
                          });
                        }}
                      >
                        <Button variant="outline">Compass</Button>
                      </Link>
                    </div>
                    <Link
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        location + " san francisco",
                      )}`}
                      target="_blank"
                      onClick={() => {
                        mixpanel.track("searched address", {
                          type: "google maps",
                          address: location,
                        });
                      }}
                    >
                      <Button variant="outline">Google Maps</Button>
                    </Link>
                  </div>
                </div>
              </Drawer.Description>
            </div>
          </Drawer.NestedRoot>
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
}
