import { useState } from "react";

export default function SecretUpload() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Uploading...");

    const fileInput = e.target.elements.file;
    const passwordInput = e.target.elements.password;

    if (!fileInput.files[0]) {
      setStatus("No file selected");
      return;
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "x-upload-password": passwordInput.value, // Sending password in header
      },
      body: fileInput.files[0], // Sending raw file as body
    });

    if (res.ok) {
      setStatus("Success! Easter egg updated.");
    } else {
      setStatus("Error: Incorrect password or upload failed.");
    }
  }

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Top Secret Upload</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="password"
          name="password"
          placeholder="Admin Password"
          required
          style={{ padding: "10px" }}
        />
        <input type="file" name="file" accept="image/*" required />
        <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
          Update Easter Egg
        </button>
      </form>
      {status && <p style={{ marginTop: "20px" }}>{status}</p>}
    </div>
  );
}
