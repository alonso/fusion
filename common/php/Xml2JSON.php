<?php
/**
 * Xml2JSON
 *
 * $Id: Xml2JSON.php 1457 2008-08-12 20:08:17Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * Convert an XML document into our special kind of JSON
 */
include(dirname(__FILE__).'/Utilities.php');

if (isset($_FILES['xml'])) {
    $xml = file_get_contents($_FILES['xml']['tmp_name']);
} elseif (isset($_SERVER['HTTP_HOST'])) {
    $REQUEST_VARS = array_merge($_GET, $_POST);
    if (!isset($REQUEST_VARS['xml'])) {
        die('xml not set');
    }
    header('Content-type: text/plain');
    header('X-JSON: true');
    $xml = rawurldecode ($REQUEST_VARS['xml']);
    $xml = trim($xml);
    $xml = str_replace('\"', '"', $xml);
    $xml = str_replace('&quot;', "'", $xml);
    $xml = preg_replace('/\n/', ' ', $xml);
} elseif (isset($argv)) {
    $cliArgs = arguments($argv);
    if (isset($cliArgs['obj'])) {
        $jsObject = $cliArgs['obj'];
    } else {
        $jsObject = "Fusion.appDefJson";
    }
    if (isset($cliArgs['file'])) {
        $xml = file_get_contents($cliArgs['file']);
        if (!$xml) {
            die('file not found:'.$cliArgs['file']);
        }
        echo $jsObject."=";
    }
} else {
    die('no XML input');
}
//echo "/*";
//print_r($xml);
//echo "*/";
$document = DOMDocument::loadXML($xml);
if ($document == null) {
    die ('/* invalid xml document:'.$xml.' */');
}
$root = $document->documentElement;
echo '{"' . $root->tagName . '":' . xml2json($root) . '};';
?>