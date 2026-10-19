"""Strict directory-record classification before human production-role review."""
from urllib.parse import urlsplit

def valid_https_url(value):
    if not isinstance(value, str) or not 1 <= len(value) <= 2048:
        return False
    try:
        u=urlsplit(value)
        return u.scheme=="https" and bool(u.hostname) and not u.username and not u.password and not u.fragment and not u.query
    except ValueError:
        return False

def classify_directory_result(expected_id, result):
    if type(expected_id) is not int or expected_id<=0 or type(result) is not dict:
        raise ValueError("invalid directory record")
    if result.get("trackId") != expected_id:
        return {"status":"ID_MISMATCH","host_verified":False}
    feed=result.get("feedUrl")
    page=result.get("trackViewUrl")
    if feed and not valid_https_url(feed):
        return {"status":"UNSAFE_FEED_URL","host_verified":False}
    if page and not valid_https_url(page):
        return {"status":"UNSAFE_DIRECTORY_URL","host_verified":False}
    return {"status":"FEED_FOUND_REQUIRES_HOST_AND_RSS_REVIEW" if feed else "NO_PUBLIC_RSS_IN_DIRECTORY",
            "host_verified":False}
