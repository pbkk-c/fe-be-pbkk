import Typography from "@/components/Typography";

export default function ErrorMessage({ children }: { children: string }) {
  return (
    <div className="flex space-x-1">
      <Typography
        as="p"
        weight="regular"
        variant="c1"
        className="text-xs !leading-tight text-danger-main"
      >
        {children}
      </Typography>
    </div>
  );
}
