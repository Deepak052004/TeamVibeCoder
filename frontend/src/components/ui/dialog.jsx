import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "./utils";

/* Root */
export function Dialog(props) {
  return <DialogPrimitive.Root {...props} />;
}

/* Trigger */
export function DialogTrigger(props) {
  return <DialogPrimitive.Trigger {...props} />;
}

/* Overlay */
export function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      {...props}
    />
  );
}

/* Content */
export function DialogContent({ className, children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <DialogPrimitive.Content
          className={cn(
            "relative z-50 w-full max-w-2xl bg-white border-4 border-black",
            "rounded-lg p-6 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            className
          )}
          {...props}
        >
          {children}

          <DialogPrimitive.Close className="absolute top-4 right-4 opacity-70 hover:opacity-100">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}
