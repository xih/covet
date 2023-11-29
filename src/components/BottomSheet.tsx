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

import { useRouter } from "next/router";

export type BottomSheetProps = {
  open: boolean;
  location?: string;
  grantee?: string;
  grantor?: string;
  lat?: number;
  lon?: number;
  onClose: () => void;
};

import type { PropsWithChildren } from "react";

export default function BottomSheet(
  props: BottomSheetProps & PropsWithChildren,
) {
  const { open, onClose, location, grantee, grantor, children } = props;
  const [snap, setSnap] = useState<number | string | null>("148px");

  const router = useRouter();

  const browserURL = router.asPath;

  const domain = "https://postcovet.com";

  const textMessage = encodeURIComponent(
    `👋 Want to purchase this home? Check out who owns this home near me: ${
      domain + router.asPath
    }`,
  );

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
          <Drawer.NestedRoot>
            <div className="flex-1 rounded-t-[10px] bg-white p-4">
              <div className="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 overflow-auto rounded-full bg-zinc-300" />
              <div className="mx-auto flex w-full max-w-md flex-col overflow-auto rounded-t-[10px] p-4">
                <Drawer.Title className="text-xl font-medium	">
                  {location}
                </Drawer.Title>
                <br />
                <Drawer.Description>{children}</Drawer.Description>
              </div>
            </div>
          </Drawer.NestedRoot>
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
}
