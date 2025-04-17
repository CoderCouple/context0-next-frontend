import db from "@/db";

export default async function Home() {
  const result = await db.execute("SELECT * FROM pg_catalog.pg_tables");
  //console.log(result);
  return (
    <main className="flex flex-col items-center justify-center">
      <p>Hello World!</p>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  );
}
