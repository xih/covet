import React, { useState } from "react";
import { Drawer } from "vaul";
import { useRouter } from "next/router";
// import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

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
import { titleCase } from "title-case";

export default function BottomSheet(
  props: BottomSheetProps & PropsWithChildren,
) {
  const { open, onClose, location, grantee, grantor, children } = props;
  const [snap, setSnap] = useState<number | string | null>("148px");

  return (
    <Drawer.Root
      open={open}
      onClose={onClose}
      modal={false}
      snapPoints={[0.45, 0.95]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      closeThreshold={0.1}
      fadeFromIndex={1}
    >
      <Drawer.Portal>
        <Drawer.Content className="border-b-none fixed bottom-0 left-0 right-0 mx-[-1px] flex h-full max-h-[97%] flex-col rounded-t-[10px] border border-gray-200 bg-white">
          <Drawer.NestedRoot>
            <div className="flex-1 rounded-t-[10px] bg-white p-4">
              <div className="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 overflow-auto rounded-full bg-zinc-300" />
              <div className="mx-auto flex w-full max-w-md flex-col rounded-t-[10px]">
                <Drawer.Title className="text-xl font-medium">
                  {location && titleCase(location.toLowerCase())}
                </Drawer.Title>
                <br />
                <Drawer.Description>
                  {/* <ScrollArea className="h-72 w-fit"> */}
                  {children}
                  {/* <ScrollBar orientation="vertical" /> */}
                  {/* </ScrollArea> */}
                </Drawer.Description>
                <Drawer.Close />
              </div>
            </div>
          </Drawer.NestedRoot>
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
}
