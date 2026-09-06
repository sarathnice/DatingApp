export async function GET() {
  return Response.json(
    {
      status: "ok",
      service: "mila-dating-app",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
