import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import mixpanel from "mixpanel-browser";
import Link from "next/link";
import React, { useState } from "react";
import { Drawer } from "vaul";
import { Sheet, SheetContent } from "~/components/ui/sheet";

export type BottomSheetProps = {
  isOpen: boolean;
  clickHome: boolean;
  location?: string;
  // prettyLocation: string;
};

export default function BottomSheetMobile(props: BottomSheetProps) {
  const { isOpen, location = "", clickHome } = props;

  const first = location.slice(0, 4);
  const middle = location.slice(4, -4);
  const last = location.slice(-4);

  const prettyLocation = [
    first.replace(/^0+/, ""),
    middle.trim().replace(/^0+/, ""),
    last.replace(/^0+/, ""),
  ].join(" ");

  const [snap, setSnap] = useState<number | string | null>("148px");

  // const [isOpen, setIsOpen] = useState(true);

  console.log(isOpen, "1. isOpen");
  console.log(location, "location");
  console.log(clickHome, "2. clickHome");

  return (
    // <Drawer.Root
    //   open={isOpen}
    //   // value={isOpen}
    //   onOpenChange={(e) => {
    //     console.log("what is e", e);
    //     e = true;
    //   }}
    //   modal={false}
    //   shouldScaleBackground
    //   // snapPoints={["148px", "355px", 1]}
    //   // activeSnapPoint={snap}
    //   // setActiveSnapPoint={setSnap}
    // >
    //   {/* <div>{console.log("whats isOPen here", isOpen)}</div> */}
    //   {/* <Drawer.Trigger>Open</Drawer.Trigger> */}
    //   <Drawer.Portal>
    //     <Drawer.Overlay className="fixed inset-0 bg-black/40" />
    //     <Drawer.Content className="border-b-none fixed bottom-0 left-0 right-0 mx-[-1px] flex h-full max-h-[50%] flex-col rounded-t-[10px] border border-gray-200 bg-white">
    //       <div className="flex-1 rounded-t-[10px] bg-white p-4">
    //         <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
    //         <p>Content</p>
    //       </div>
    //     </Drawer.Content>
    //     {/* <Drawer.Overlay /> */}
    //   </Drawer.Portal>
    // </Drawer.Root>

    // sheet works
    // <Sheet open={isOpen} modal={false}>
    //   <SheetContent
    //     showCloseButton={false}
    //     side={window.innerWidth > 800 ? "left" : "bottom"}
    //   ></SheetContent>
    // </Sheet>

    <Drawer.Root
      open={isOpen}
      dismissible={false}
      modal={false}
      // onOpenChange={(e) => {
      //   console.log(e, "3. on open change state");
      // }}
    >
      <Drawer.Trigger asChild className="z-40 flex items-center align-middle">
        <button>Open Drawer</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[50%] flex-col rounded-t-[10px] bg-zinc-100">
          <Drawer.NestedRoot>
            <div className="flex-1 rounded-t-[10px] bg-white p-4">
              <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />

              <Drawer.Title>
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
              </Drawer.Title>
            </div>
          </Drawer.NestedRoot>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
