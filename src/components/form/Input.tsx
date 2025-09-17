import { useState } from "react";
import { RegisterOptions, get, useFormContext } from "react-hook-form";
import { IconType } from "react-icons";
import { HiEye, HiEyeOff } from "react-icons/hi";

import Typography from "@/components/Typography";
import ErrorMessage from "@/components/form/ErrorMessage";
import HelperText from "@/components/form/HelperText";
import clsxm from "@/lib/clsxm";
import LabelText from "./LabelText";

export type InputProps = {
  id: string;
  label?: string;
  helperText?: React.ReactNode;
  helperTextClassName?: string;
  labelTextClassName?: string;
  hideError?: boolean;
  validation?: RegisterOptions;
  prefix?: string;
  suffix?: string;
  rightIcon?: IconType;
  leftIcon?: IconType;
  rightIconClassName?: string;
  leftIconClassName?: string;
  labelTextClasname?: string;
} & React.ComponentPropsWithoutRef<"input">;

export default function Input({
  id,
  label,
  helperText,
  hideError = false,
  validation,
  prefix,
  suffix,
  className,
  type = "text",
  readOnly = false,
  rightIcon: RightIcon,
  leftIcon: LeftIcon,
  rightIconClassName,
  leftIconClassName,
  labelTextClassName,
  helperTextClassName,
  ...rest
}: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const error = get(errors, id);

  return (
    <div className="w-full space-y-2">
      {label && (
        <LabelText
          required={validation?.required ? true : false}
          labelTextClassname={labelTextClassName}
        >
          {label}
        </LabelText>
      )}

      <div className="relative flex w-full gap-0">
        <div
          className={clsxm(
            "pointer-events-none absolute h-full w-full rounded-md border-typo-outline-1 ring-1 ring-inset ring-typo-outline-1",
          )}
        />

        {prefix && (
          <Typography
            variant="c1"
            className="flex w-min items-center rounded-l-md bg-transparent px-3 text-sm text-typo-outline-1"
          >
            {prefix}
          </Typography>
        )}

        <div
          className={clsxm(
            "relative w-full rounded-md",
            prefix && "rounded-l-md",
            suffix && "rounded-r-md",
          )}
        >
          {LeftIcon && (
            <div
              className={clsxm(
                "absolute left-0 top-0 h-full",
                "flex items-center justify-center pl-2.5",
                "text-lg text-typo-main md:text-xl",
                leftIconClassName,
              )}
            >
              <LeftIcon />
            </div>
          )}

          <input
            {...register(id, validation)}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            id={id}
            name={id}
            readOnly={readOnly}
            disabled={readOnly}
            className={clsxm(
              "h-full w-full rounded-md border border-typo-outline-1 px-3 py-2.5",
              [LeftIcon && "pl-9", RightIcon && "pr-9"],
              "focus:outline-1 focus:outline-info-main focus:ring-inset",
              "bg-typo-white text-sm",
              "hover:ring-1 hover:ring-inset hover:ring-typo-main",
              "placeholder:text-sm placeholder:text-typo-outline-1",
              "text-typo-main",
              readOnly && "cursor-not-allowed",
              error &&
                "border-none ring-2 ring-inset ring-danger-main placeholder:text-typo-outline-1 focus:ring-danger-main",
              prefix && "rounded-l-none rounded-r-md ",
              suffix && "rounded-l-md rounded-r-none",
              prefix && suffix && "rounded-none",
              className,
            )}
            aria-describedby={id}
            {...rest}
          />

          {RightIcon && type !== "password" && (
            <div
              className={clsxm(
                "absolute bottom-0 right-0 h-full",
                "flex items-center justify-center pr-2.5",
                "text-lg text-typo-main md:text-xl",
                rightIconClassName,
              )}
            >
              <RightIcon />
            </div>
          )}

          {type === "password" && (
            <div
              className={clsxm(
                "absolute bottom-0 right-0 h-full",
                "flex items-center justify-center pr-3",
                "text-lg text-typo-outline-1 md:text-xl cursor-pointer",
                rightIconClassName,
              )}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiEye /> : <HiEyeOff />}
            </div>
          )}
        </div>

        {suffix && (
          <Typography
            variant="c1"
            className="flex w-min items-center rounded-r-md border-l bg-typo-white px-3 text-sm text-typo-outline-1"
          >
            {suffix}
          </Typography>
        )}
      </div>

      {!hideError && error && <ErrorMessage>{error.message}</ErrorMessage>}
      {helperText && (
        <HelperText
          helperTextClassName={clsxm(
            helperTextClassName,
            !hideError && error && "text-danger-main",
          )}
        >
          {helperText}
        </HelperText>
      )}
    </div>
  );
}