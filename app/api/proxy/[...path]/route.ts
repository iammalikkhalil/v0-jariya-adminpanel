import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://api.jariya.net/api"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/");
    // Get query string from request
    const queryString = request.nextUrl.search;
    const url = `${API_BASE_URL}/${path}${queryString}`;

    console.log("[v0] Proxy GET request:", { path, url });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log("[v0] Proxy GET response:", {
      path,
      status: response.status,
      success: response.ok,
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[v0] Proxy GET error:", error);
    return NextResponse.json({ success: false, message: "Proxy request failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const url = `${API_BASE_URL}/${path}`
    const body = await request.json()

    console.log("[v0] Proxy POST request:", { path, url, hasBody: !!body, body })




    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    console.log("[v0] Proxy POST response:", {
      path,
      status: response.status,
      success: response.ok,
    })

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] Proxy POST error:", error)
    return NextResponse.json({ success: false, message: "Proxy request failed" }, { status: 500 })
  }
}
