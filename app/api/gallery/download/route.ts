import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/download?url=<encoded_url>&filename=<optional_filename>
 *
 * Proxies a file download through the server to avoid CORS issues.
 * The file is fetched server-side and streamed back to the client with
 * appropriate Content-Disposition headers.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const fileUrl = searchParams.get('url');
  const filename = searchParams.get('filename');

  if (!fileUrl) {
    return NextResponse.json({ error: 'Missing "url" query parameter' }, { status: 400 });
  }

  let decodedUrl: string;
  try {
    decodedUrl = decodeURIComponent(fileUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid "url" parameter' }, { status: 400 });
  }

  // Basic SSRF guard — only allow http/https
  if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
    return NextResponse.json({ error: 'Only http/https URLs are allowed' }, { status: 400 });
  }

  try {
    const upstream = await fetch(decodedUrl);

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream fetch failed: ${upstream.status} ${upstream.statusText}` },
        { status: upstream.status },
      );
    }

    const headers = new Headers();

    // Forward content-type from upstream
    const contentType = upstream.headers.get('content-type');
    if (contentType) {
      headers.set('content-type', contentType);
    }

    // Content-Disposition for download
    const dispositionFilename = filename ?? decodedUrl.split('/').pop() ?? 'download';
    headers.set(
      'content-disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(dispositionFilename)}`,
    );

    // Forward content-length if available
    const contentLength = upstream.headers.get('content-length');
    if (contentLength) {
      headers.set('content-length', contentLength);
    }

    // Cache control — prevent stale downloads
    headers.set('cache-control', 'no-cache, no-store, must-revalidate');

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[Download] Proxy error:', error);
    return NextResponse.json(
      {
        error: 'Failed to download file',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
