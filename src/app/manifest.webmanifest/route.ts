export const dynamic = "force-static";

export async function GET() {
  return new Response(
    JSON.stringify({
      name: "Queueing Theory Calculator",
      short_name: "Queue",
      description: "Queueing Theory Calculator",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#000000",
      lang: "en-US",
      orientation: "portrait",
      icons: [
        {
          src: "/icon-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
