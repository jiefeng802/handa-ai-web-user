import Image from "next/image";
import { useEffect, useState } from "react";

interface QuivrLogoProps {
  size: number;
  color?: "white" | "black" | "primary" | "accent";
}

export const QuivrLogo = ({
  size,
  color = "white",
}: QuivrLogoProps): JSX.Element => {
  const [src, setSrc] = useState<string>("/logo-white.png");

  useEffect(() => {
    if (color === "primary") {
      setSrc("/logo-primary.png");
    } else if (color === "accent") {
      setSrc("/logo-accent.png");
    } else if (color === "black") {
      setSrc("/logo-black.png");
    } else {
      setSrc("/logo-white.png");
    }
  }, [color]);

  return <Image src={src} alt="handa Logo" width={size} height={size} />;
};
