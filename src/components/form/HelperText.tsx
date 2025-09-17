import { ReactNode } from "react";

import Typography from "@/components/Typography";
import clsxm from "@/lib/clsxm";

export default function HelperText({
  children,
  helperTextClassName,
}: {
  children: ReactNode;
  helperTextClassName?: string;
}) {
  return (
    <div className="flex space-x-1">
      <Typography
        as="p"
        font="Poppins"
        weight="regular"
        variant="c1"
        className={clsxm(
          "text-xs !leading-tight text-typo-main",
          helperTextClassName,
        )}
      >
        {children}
      </Typography>
    </div>
  );
}