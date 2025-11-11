import Link from "next/link";

function Home() {
  return (
    <div>
      <h1>Teste</h1>

      <p>
        Cool Image: <Link href="/image">here</Link>.
      </p>
    </div>
  );
}

export default Home;
