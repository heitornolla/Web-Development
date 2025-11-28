import { put, list, del } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const passwordHeader = req.headers["x-upload-password"];

    // Debug logs (Check Vercel Function Logs to see these)
    console.log("Upload attempt started");

    // Safety: Handle missing env var
    if (!process.env.UPLOAD_PASSWORD) {
      console.error(
        "Server Error: UPLOAD_PASSWORD is not set in environment variables.",
      );
      return res
        .status(500)
        .json({ error: "Server misconfiguration: Password not set" });
    }

    const provided = (passwordHeader || "").trim();
    const expected = (process.env.UPLOAD_PASSWORD || "").trim();

    if (provided !== expected) {
      console.warn(
        `Auth failed. provided: "${provided}" vs expected: "${expected.substring(0, 3)}..."`,
      );
      return res.status(401).json({ error: "Incorrect password" });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("Server Error: BLOB_READ_WRITE_TOKEN is missing.");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: Blob token missing" });
    }

    const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
    if (blobs.length > 0) {
      await Promise.all(
        blobs.map((blob) =>
          del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN }),
        ),
      );
    }

    console.log("Starting upload to Vercel Blob...");
    const blob = await put("secret-image", req, {
      access: "public",
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log("Upload successful:", blob.url);
    return res.status(200).json(blob);
  } catch (error) {
    console.error("Upload Error Details:", error);
    return res
      .status(500)
      .json({ error: error.message || "Upload failed due to server error" });
  }
}
