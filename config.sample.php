<?php

/**
 * The primary structure in the options object is the `directory`.
 * This array defines the mapping and structure of the content
 * directory for the app. The top level items are shown by the ls
 * command, and nested items can be linked within brower pages.
 *
 * Each item has the following structure:
 *
 *     filename - Maps to the file name in the content directory.
 *     type - `browser` to open in a new window, or `show` to append to
 *            the current window.
 *     title - Text to display in the title bar of the window.
 *     items - A nested array of items.
 *
 * HTML files for these items should be placed in the content directory
 * in a path structure that corresponds to its parent's name, if
 * any. In the example below, "Writings" would be located at:
 *
 *     content/writings.html
 *
 * and "My Essay" would be located at:
 *
 *     content/writings/my-essay.html
 *
 */

$opts = [
    'name' => 'web-console',
    'directory' => [
        [
            'filename' => 'projects',
            'type' => 'browser',
            'title' => 'Projects'
        ],
        [
            'filename' => 'writings',
            'type' => 'browser',
            'title' => 'Writings',
            'items' => [
                [
                    'filename' => 'my-essay',
                    'type' => 'browser',
                    'title' => 'My Essay'
                ]
            ]
        ],
        [
            'filename' => 'contact',
            'type' => 'show'
        ]
    ]
];
