import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

export default async function EasterEgg() {
  const { blobs } = await list();

  // Find any file that starts with our prefix
  const eggImages = blobs.filter((blob) =>
    blob.pathname.startsWith("easter-egg-"),
  );

  // If we have multiple (due to race conditions), pick the newest
  const currentImage = eggImages.sort(
    (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt),
  )[0];

  if (!currentImage) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <h1>No Easter Egg found yet!</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-black overflow-hidden">
      <img
        src={currentImage.url}
        alt="Secret Easter Egg"
        className="max-w-full max-h-screen object-contain"
      />
    </div>
  );
}
