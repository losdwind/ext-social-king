import React, { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CopyButton } from "./CopyButton";

export const AddressDisplay = ({ address }: { address: string }) => {
  return (
    <div className="font-semibold">
      {address.length > 10 ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{address.slice(0, 6) + "..." + address.slice(-4)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-row items-center gap-1">
                <p>{address}</p>
                <CopyButton value={address} />
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span>{address}</span>
      )}
    </div>
  );
};