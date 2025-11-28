import { put, list, del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const password = formData.get("password");

  if (password !== process.env.UPLOAD_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    // Delete ALL existing files in the store
    const { blobs } = await list();

    if (blobs.length > 0) {
      await Promise.all(blobs.map((blob) => del(blob.url)));
    }

    const newBlob = await put("secret-image", file, {
      access: "public",
      addRandomSuffix: true, // Ensures the URL changes so browsers don't cache the old image
    });

    return NextResponse.json({ success: true, url: newBlob.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
