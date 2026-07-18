import Image from "next/image";

/**
 * Reusable footer brand mark.
 *
 * Centered, 50% opacity, sits below the page content. The mark is black
 * brush-script on a transparent background, so it's inverted to white in
 * dark mode to stay visible against the dark background.
 *
 * Intended as a shared template element — drop `public/brand/verity-mark.png`
 * and this component into future Verity/VOW Center projects to keep the
 * same footer treatment consistent across sites.
 */
export default function BrandMark() {
  return (
    <div className="mt-14 flex justify-center">
      <Image
        src="/brand/verity-mark.png"
        alt="Verity"
        width={220}
        height={124}
        className="h-auto w-36 opacity-50 dark:invert sm:w-44"
        priority={false}
      />
    </div>
  );
}
