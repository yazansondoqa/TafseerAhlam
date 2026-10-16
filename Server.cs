using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;

class SimpleServer
{
    static string root;
    static int port;

    static void Main(string[] args)
    {
        port = args.Length > 0 ? int.Parse(args[0]) : 8083;
        root = args.Length > 1 ? args[1] : Directory.GetCurrentDirectory();

        HttpListener listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:" + port + "/");
        listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
        listener.Start();

        Console.WriteLine("============================================");
        Console.WriteLine("  Dreams Website - Local Server");
        Console.WriteLine("============================================");
        Console.WriteLine("  Server running at: http://localhost:" + port);
        Console.WriteLine("  Press Ctrl+C to stop");
        Console.WriteLine("");

        // Handle multiple concurrent requests
        for (int i = 0; i < 10; i++)
        {
            listener.BeginGetContext(new AsyncCallback(HandleRequest), listener);
        }

        Console.WriteLine("  Ready. Waiting for requests...");
        Console.WriteLine("");

        while (true)
        {
            Thread.Sleep(1000);
        }
    }

    static void HandleRequest(IAsyncResult ar)
    {
        HttpListener listener = (HttpListener)ar.AsyncState;

        // Re-register for next request
        try { listener.BeginGetContext(new AsyncCallback(HandleRequest), listener); } catch { }

        HttpListenerContext context;
        try { context = listener.EndGetContext(ar); }
        catch { return; }

        HttpListenerRequest request = context.Request;
        HttpListenerResponse response = context.Response;

        string rawPath = request.Url.LocalPath;
        string urlPath = WebUtility.UrlDecode(rawPath).TrimStart('/');

        if (string.IsNullOrEmpty(urlPath))
            urlPath = "index.html";

        // Translate clean URLs (e.g. "/letter") to their actual files ("letter.html")
        if (!Path.HasExtension(urlPath) && !Directory.Exists(Path.Combine(root, urlPath)))
        {
            if (File.Exists(Path.Combine(root, urlPath + ".html")))
                urlPath = urlPath + ".html";
            else if (string.IsNullOrEmpty(urlPath))
                urlPath = "index.html";
        }

        string filePath = Path.Combine(root, urlPath);

        // Security: prevent path traversal
        if (!filePath.StartsWith(root, StringComparison.OrdinalIgnoreCase))
            filePath = Path.Combine(root, "index.html");

        if (File.Exists(filePath))
        {
            byte[] content = File.ReadAllBytes(filePath);
            string ext = Path.GetExtension(filePath).ToLower();
            response.ContentType = GetContentType(ext);
            response.ContentLength64 = content.Length;
            response.Headers.Add("Cache-Control", "no-cache");
            response.Headers.Add("Connection", "close");
            response.OutputStream.Write(content, 0, content.Length);
        }
        else
        {
            response.StatusCode = 404;
            string notFound = "<!DOCTYPE html><html dir=rtl><head><meta charset=UTF-8><title>404</title></head><body style='font-family:sans-serif;text-align:center;padding:50px'><h1>404</h1><p>Page not found</p><a href=/>Back to home</a></body></html>";
            byte[] nfBytes = Encoding.UTF8.GetBytes(notFound);
            response.ContentType = "text/html; charset=utf-8";
            response.ContentLength64 = nfBytes.Length;
            response.OutputStream.Write(nfBytes, 0, nfBytes.Length);
        }

        response.Close();
    }

    static string GetContentType(string ext)
    {
        switch (ext)
        {
            case ".html": return "text/html; charset=utf-8";
            case ".css": return "text/css; charset=utf-8";
            case ".js": return "application/javascript; charset=utf-8";
            case ".svg": return "image/svg+xml";
            case ".json": return "application/json; charset=utf-8";
            case ".ico": return "image/x-icon";
            case ".png": return "image/png";
            case ".jpg": return "image/jpeg";
            case ".webp": return "image/webp";
            case ".woff": return "font/woff";
            case ".woff2": return "font/woff2";
            case ".txt": return "text/plain; charset=utf-8";
            default: return "application/octet-stream";
        }
    }
}
