import React, { useState } from "react";
import { Drawer } from "vaul";
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
import { titleCase } from "title-case";
import clsx from "clsx";

const snapPoints = [0.45, 0.95];

export default function BottomSheet(
  props: BottomSheetProps & PropsWithChildren,
) {
  const { open, onClose, location, grantee, grantor, children } = props;
  const [snap, setSnap] = useState<number | string | null>("148px");

  const [activeSnapPoint, setActiveSnapPoint] = React.useState<
    number | string | null
  >(snapPoints[0]);

  return (
    <Drawer.Root
      open={open}
      onClose={onClose}
      modal={false}
      snapPoints={[0.45, 0.95]}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      closeThreshold={0.1}
      fadeFromIndex={1}
    >
      <Drawer.Portal>
        <Drawer.Content className="border-b-none fixed bottom-0 left-0 right-0 mx-[-1px] flex h-full max-h-[97%] flex-col rounded-t-[10px] border border-gray-200 bg-white">
          <div
            style={{ scrollbarGutter: "stable" }} // Stops scrollbar from moving the text
            className="mx-auto flex max-h-full w-full w-screen flex-col p-4 pt-2"
          >
            <Drawer.NestedRoot>
              <div className="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 overflow-auto rounded-full bg-zinc-300" />
              <div
                className={clsx("text-gray-600", {
                  "overflow-y-auto": activeSnapPoint === snapPoints[1],
                  "overflow-hidden": activeSnapPoint !== snapPoints[1],
                })}
              >
                <div className="flex-1 rounded-t-[10px] bg-white">
                  <div className="mx-auto flex w-full max-w-md flex-col rounded-t-[10px]">
                    <Drawer.Title className="text-xl font-medium">
                      {location && titleCase(location.toLowerCase())}
                    </Drawer.Title>
                    <br />
                    <Drawer.Description>{children}</Drawer.Description>
                    <Drawer.Close />
                  </div>
                </div>
              </div>
            </Drawer.NestedRoot>
          </div>
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
}
