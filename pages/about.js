import Link from "next/link";

export default function About() {
  return (
    <div>
      <p>About page</p>
      <p>
        Go to <Link href="/">Home</Link>
      </p>
    </div>
  );
}
