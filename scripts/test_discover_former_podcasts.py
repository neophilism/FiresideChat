#!/usr/bin/env python3
"""Regression tests for former-member podcast discovery."""
import importlib.util
import pathlib
import sys
import unittest

path = pathlib.Path(__file__).with_name("discover-former-podcasts.py")
spec = importlib.util.spec_from_file_location("former_podcasts", path)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)


class DiscoveryMatchingTests(unittest.TestCase):
    person = {"first": "John", "last": "Kasich", "full_name": "John Kasich"}
    def test_named_show_host_is_found(self):
        self.assertEqual(
            module.matches(self.person, {"collectionName": "John Kasich's Interviews"}),
            (True, "show-title"),
        )

    def test_independent_publisher_with_host_in_description_is_found(self):
        ok, source = module.matches(
            self.person,
            {
                "collectionName": "Kasich & Klepper",
                "artistName": "Treefort Media",
                "collectionDescription": "Former U.S. representative John Kasich co-hosts with Jordan Klepper",
            },
        )
        self.assertTrue(ok)
        self.assertEqual(source, "show-description")

    def test_mention_of_first_name_alone_is_not_a_match(self):
        self.assertEqual(
            module.matches(self.person, {"collectionName": "The John Show"}),
            (False, ""),
        )

    def test_others_with_similar_name_do_not_match(self):
        self.assertEqual(
            module.matches(self.person, {"collectionName": "John Cassady's Interviews"}),
            (False, ""),
        )

    def test_no_match_is_not_host_disproof(self):
        self.assertEqual(
            module.matches(self.person, {"artistName": "Treefort Media"}),
            (False, ""),
        )


if __name__ == "__main__":
    unittest.main()
