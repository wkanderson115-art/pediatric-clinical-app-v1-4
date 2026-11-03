import UIKit
import WebKit

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let configuration = WKWebViewConfiguration()
        configuration.setURLSchemeHandler(BundleSchemeHandler(), forURLScheme: "pediatric")
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.isOpaque = false
        webView.backgroundColor = .systemBackground

        let controller = UIViewController()
        controller.view = webView
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = controller
        window?.makeKeyAndVisible()
        webView.load(URLRequest(url: URL(string: "pediatric://app/index.html")!))
        return true
    }
}

final class BundleSchemeHandler: NSObject, WKURLSchemeHandler {
    private let mimeTypes = [
        "html": "text/html", "js": "text/javascript", "css": "text/css",
        "json": "application/json", "png": "image/png", "jpg": "image/jpeg",
        "jpeg": "image/jpeg", "svg": "image/svg+xml", "webmanifest": "application/manifest+json"
    ]

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard let url = urlSchemeTask.request.url else {
            urlSchemeTask.didFailWithError(NSError(domain: "PediatricApp", code: 1)); return
        }
        let requested = url.path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let relative = requested.isEmpty ? "index.html" : requested
        guard !relative.contains(".."),
              let root = Bundle.main.url(forResource: "web", withExtension: nil),
              let file = URL(string: relative, relativeTo: root)?.standardizedFileURL,
              file.path.hasPrefix(root.standardizedFileURL.path),
              let data = try? Data(contentsOf: file) else {
            urlSchemeTask.didFailWithError(NSError(domain: "PediatricApp", code: 404)); return
        }
        let ext = file.pathExtension.lowercased()
        let response = URLResponse(url: url,
                                   mimeType: mimeTypes[ext] ?? "application/octet-stream",
                                   expectedContentLength: data.count,
                                   textEncodingName: ["html", "js", "css", "json", "webmanifest"].contains(ext) ? "utf-8" : nil)
        urlSchemeTask.didReceive(response)
        urlSchemeTask.didReceive(data)
        urlSchemeTask.didFinish()
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}
}
