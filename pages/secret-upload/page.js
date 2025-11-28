import { list } from "@vercel/blob";

// Ensure this page never caches
export const dynamic = "force-dynamic";

export default async function EasterEgg() {
  // Get list of all files
  const { blobs } = await list();

  // Since we delete everything else on upload,
  // we can safely assume the first file we find is the right one.
  const currentImage = blobs[0];

  if (!currentImage) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <h1>Waiting for the signal...</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={currentImage.url}
        alt="Secret Content"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
