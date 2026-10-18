import unittest
from scripts.priority_feed_review import classify_directory_result

class DirectoryReviewTests(unittest.TestCase):
    def test_directory_is_never_proof_of_official_host(self):
        row=classify_directory_result(101,{"trackId":101,"feedUrl":"https://show.example/feed"})
        self.assertEqual(row["status"],"FEED_FOUND_REQUIRES_HOST_AND_RSS_REVIEW")
        self.assertFalse(row["host_verified"])
    def test_wrong_entry_and_unsafe_urls_rejected(self):
        self.assertEqual(classify_directory_result(101,{"trackId":102})["status"],"ID_MISMATCH")
        for url in ("http://localhost/feed","https://u:p@example.org/","https://show.example/feed?token=x","javascript:foo"):
            self.assertEqual(classify_directory_result(101,{"trackId":101,"feedUrl":url})["status"],"UNSAFE_FEED_URL")
