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


    def test_different_presenters_cannot_supply_name_tokens(self):
        williams = {"first": "John", "last": "Williams", "full_name": "John Williams"}
        self.assertEqual(
            module.matches(williams, {"artistName": "Justin Williams and John Dyer"}),
            (False, ""),
        )
        self.assertEqual(
            module.matches(williams, {"collectionName": "John Dyer with Justin Williams"}),
            (False, ""),
        )

    def test_cross_presenter_description_remains_unmatched(self):
        anderson = {"first": "John", "last": "Anderson", "full_name": "John Anderson"}
        self.assertEqual(
            module.matches(
                anderson,
                {"collectionDescription": "Brandon Anderson and John Kehayias host the show."},
            ),
            (False, ""),
        )

    def test_genuine_full_name_in_publisher_description_still_matches(self):
        williams = {"first": "John", "last": "Williams", "full_name": "John Williams"}
        self.assertEqual(
            module.matches(
                williams,
                {
                    "artistName": "Independent Media",
                    "collectionDescription": "Presented by former representative John Williams.",
                },
            ),
            (True, "show-description"),
        )

    def test_single_middle_initial_in_a_presenters_name(self):
        williams = {"first": "John", "last": "Williams", "full_name": "John Williams"}
        self.assertEqual(
            module.matches(williams, {"artistName": "John R. Williams"}),
            (True, "creator-middle-initial"),
        )

    def test_separate_initial_cannot_bridge_two_presenters(self):
        williams = {"first": "John", "last": "Williams", "full_name": "John Williams"}
        self.assertEqual(
            module.matches(williams, {"artistName": "John R Jones and Amy Williams"}),
            (False, ""),
        )


if __name__ == "__main__":
    unittest.main()
