<?php
/**
 * Query
 *
 * $Id: Query.php 1361 2008-04-07 15:49:45Z aboudreault $
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

/*****************************************************************************
 * Purpose: create a new selection based on one or more attribute filters and
 *          a spatial filter
 *****************************************************************************/

/* set up the session */
include ("Common.php");
include ("Utilities.php");
include('../../common/php/Utilities.php');

/* the name of the layer in the map to query */
if ($_REQUEST['layers'] != '') {
    $layers = explode(',',$_REQUEST['layers']);
} else {
    $layers = array();
}

if (!isset($mapName)) {
    die('mapname not set');
}
if (isset($_SESSION['maps']) && isset($_SESSION['maps'][$mapName])) {
    $oMap = ms_newMapObj($_SESSION['maps'][$mapName]);
}

if (isset($_REQUEST['x']) && isset[$_REQUEST['y']] && isset($_REQUEST['proj'])) {
    $oPoint = ms_newPointObj();
    $oPoint->setXY($_REQUEST['x'], $_REQUEST['y']); 
    $oProj = ms_newProjectionObj($_REQUEST['proj']);
}

oPoint->project(oMap->projection, oProj);

$result = NULL;
$result->hasSelection = true;
$result->values = array();

$result->values['x'] = $oPoint->x;
$result->values['y'] = $oPoint->y;

header('Content-type: text/x-json');
header('X-JSON: true');

echo var2json($result);

?>
