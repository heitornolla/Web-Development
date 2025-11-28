import { list } from "@vercel/blob";

export async function getServerSideProps() {
  const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
  const currentImage = blobs[0] || null;

  return {
    props: {
      currentImage,
    },
  };
}

export default function EasterEgg({ currentImage }) {
  if (!currentImage) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#000",
          color: "#fff",
        }}
      >
        <h1>Waiting for the signal...</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#000",
      }}
    >
      <img
        src={currentImage.url}
        alt="Secret Easter Egg"
        style={{ maxWidth: "90%", maxHeight: "90vh", objectFit: "contain" }}
      />
    </div>
  );
}
