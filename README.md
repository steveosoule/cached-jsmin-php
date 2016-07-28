# basic-jsmin-php

PHP file that will concatenate & minify JavaScript files depending on their file-modification dates.

The `all.js.php` file will compare the modified time of the source files, compare it to the modified time of the output file, and it will concatenate & minify the files as necessary.

## Usage

1. Update the file paths in `all-js.php`
2. Upload `all-js.php` & `JSmin.php` to the server.
3. Add the script tag to your HTML page.
```
<script src="path/to/js/all-js.php"></script>
```
---

JavaScript minification done with [https://github.com/rgrove/jsmin-php](https://github.com/rgrove/jsmin-php)