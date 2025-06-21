
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { loginWithPassword } from "@evex/linejs";
import { loginWithAuthToken } from "@evex/linejs";
import { Client } from "jsr:@evex/linejs";
import { FileStorage } from "jsr:@evex/linejs/storage";
import { mod } from "jsr:@evex/linejs";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";
import { BaseClient } from "jsr:@evex/linejs";



// 仮のログイン関数

serve(async (req: Request) => {
  if (req.method === "POST" && new URL(req.url).pathname === "/login") {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return new Response("Invalid content-type", { status: 400 });
    }

    const { email, password } = await req.json();

    if (typeof email !== "string" || typeof password !== "string") {
      return new Response("Invalid input", { status: 400 });
    }

    const client = await loginWithPassword({
        email: email, // e-mail address
        password: password, // Password
        onPincodeRequest(pincode) {
            console.log('Enter this pincode to your LINE app:', pincode)
        }
    }, { device: "DESKTOPWIN" })
    

    return new Response(
      JSON.stringify({
        client:true,
        authtoken: await client.authToken,
      }),
      {
        status: client ? 200 : 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response("Not Found", { status: 404 });
});
