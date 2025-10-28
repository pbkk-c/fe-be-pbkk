import { ReactNode } from "react";

import Typography from "@/components/Typography";
import clsxm from "@/lib/clsxm";

type LabelTextProps = {
  children: ReactNode;
  htmlFor?: string;
  labelTextClassname?: string;
  required?: boolean;
  className?: string;
};

export default function LabelText({
  children,
  htmlFor,
  labelTextClassname,
  required,
  className,
}: LabelTextProps) {
  return (
    <label htmlFor={htmlFor} className={className}>
      <Typography
        as="p"
        variant="bt"
        weight="bold"
        className={clsxm("text-xs text-typo-main", labelTextClassname)}
      >
        {children} {required && <span className="text-danger-main">*</span>}
      </Typography>
    </label>
  );
}
