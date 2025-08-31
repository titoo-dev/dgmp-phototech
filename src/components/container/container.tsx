import { HTMLProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container(props: ContainerProps) {
  const { children, ...divProps } = props;
  return (
    <div
      {...divProps}
      className={cn("container mx-auto px-4", divProps.className)}
    >
      {children}
    </div>
  );
}

export type ContainerProps = HTMLProps<HTMLDivElement> & {
  children?: ReactNode;
};
