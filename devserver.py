#!/usr/bin/env python3
"""Local static server for previewing the site.

Two things the stdlib's `python3 -m http.server` gets wrong for this workflow:

  * It sends no Cache-Control, so browsers apply heuristic caching and keep
    serving a stale styles.css after an edit — the page looks unchanged even
    though the file on disk is current.
  * Threading matters here: hero.mp4 is a long-lived streaming response, and a
    single-threaded server lets it block every other asset until the page
    times out.

Usage:  python3 devserver.py <directory> <port>
"""
import functools
import http.server
import sys


class NoCache(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_head(self):
        # Drop conditional headers so a stale copy can never revalidate to 304.
        for header in ("If-Modified-Since", "If-None-Match"):
            if header in self.headers:
                del self.headers[header]
        return super().send_head()

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    directory, port = sys.argv[1], int(sys.argv[2])
    handler = functools.partial(NoCache, directory=directory)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    server.daemon_threads = True
    print("serving %s on http://127.0.0.1:%d" % (directory, port), flush=True)
    server.serve_forever()
