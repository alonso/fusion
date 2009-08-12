<?php
// set the flag to setup the mapsession
if(!defined("LOAD_MAPSESSION"))
    define("LOAD_MAPSESSION", 1);

include(dirname(__FILE__).'/../../common/php/Utilities.php');
include(dirname(__FILE__).'/Common.php');
include(dirname(__FILE__).'/Utilities.php');
include(dirname(__FILE__)."/../../../chameleon/htdocs/common/ogr/ogr2ogr.php");

error_reporting(0);
    
//include(COMMON."/ogr/ogr2ogr.php");
//
//// check ifthe ogr module is available
//$szOGRModuleName = '';
//$bModuleFound = checkOGRModule($szOGRModuleName);

$debug = fopen('debug.txt', 'w');

fwrite($debug, dirname(__FILE__)."\n");

if(isset($_REQUEST['mapfile']) && $_REQUEST['mapfile'] != '' &&
   isset($_REQUEST['ROIRENDERER']) && count($_REQUEST['ROIRENDERER']) > 0 &&
   isset($_REQUEST['formats']) && $_REQUEST['formats'] != ''){
   
    fwrite($debug, '$_REQUEST = '.print_r($_REQUEST, true));
   
    $jsonPoly = str_replace('\\', '', $_REQUEST['ROIRENDERER']);
    fwrite($debug, '$jsonPoly = '.print_r($jsonPoly, true)."\n");
    $_REQUEST['ROIRENDERER'] = json_decode($jsonPoly, true);
    $jsonFormats = str_replace('\\', '', $_REQUEST['formats']);
    $formats = json_decode($jsonFormats, true);

    fwrite($debug, '$_REQUEST = '.print_r($_REQUEST, true));
    fwrite($debug, '$_REQUEST[ROIRENDERER] = '.print_r($_REQUEST['ROIRENDERER'], true));
    fwrite($debug, '$formats = '.print_r($formats, true));
    fwrite($debug, '$mapfile = '.$_REQUEST['mapfile']."\n");
   
    //Obtener el mapa y la proyección de éste
    $oMap = ms_newMapObj($_REQUEST['mapfile']);
//    fwrite($debug, '$oMap = '.print_r($oMap, true)."\n");
    $mapProj = ms_newProjectionObj($oMap->getProjection());
    //Proyección geográfica para gml y kml
    $geoProj = ms_newProjectionObj("proj=latlong");
    
    $nROI = count($_REQUEST['ROIRENDERER']);
    $szFileNamePol = getUniqueName('Poligonos_usuario');
    $szFileNameLin = getUniqueName('Lineas_usuario');
    $szFileNamePto = getUniqueName('Puntos_usuario');
    for($i = 0; $i<$nROI; $i++){
        $aROI = $_REQUEST['ROIRENDERER'][$i];
        fwrite($debug, '$aRoi = $_REQUEST[ROIRENDERER]['.i.'] = '.print_r($aROI, true)."\n");
        switch($aROI['type']){
//            case 'rectangle':
//                $szHayPol=true;
//                break;
            case 'polygon':
                $szHayPol=true;
                break;
            case 'line':
                $szHayLin=true;
                break;
            case 'point':
                $szHayPto=true;
                break;
            default:
                break;
        }
    }
    if($szHayPol && $formats['shp']){
        fwrite($debug, "Creando base files\n");
        CreaBase($szFileNamePol, "pol", $debug);
        fwrite($debug, "base files creados\n");
    }
    if($szHayLin && $formats['shp'])
        CreaBase($szFileNameLin, "lin");
    if($szHayPto && $formats['shp'])
        CreaBase($szFileNamePto, "pto");
    fwrite($debug, '$szFileNamePol = ' .print_r($szFileNamePol, true)."\n");
    // graba Roi
    for($i = 0; $i<$nROI; $i++){
        $aROI = &$_REQUEST['ROIRENDERER'][$i];        
        fwrite($debug, "Creando shapes del poligono $i de $nROI poligonos\n");
        fwrite($debug, print_r($aROI, true));
//        switch($aROI['type']){
//            case 'rectangle':
//                SaveROI($aROI, $szFileNamePol);
//                break;
//            case 'polygon':
                fwrite($debug, "agregando shape a \$aROI $i\n");
                $aROI['shapeObj'] = getShapeObj($aROI, $debug);
//                break;
//            case 'line':
//                $aROI['shapeObj'] = getShapeObj($aROI, 'lin', $debug);
//                break;
//            case 'point':
//                $aROI['shapeObj'] = getShapeObj($aROI, 'pto', $debug);
//                break;
//            default:
//                break;
//       }
    }
    
    $aSzFiles = array();
    /**
     * @FIXME : El orden de aplición saveROI saveGoogleFormat importa tal como esta implementado ahora.
     *          Esto porque saveGoogleFormat projecta el "shapeObj" de $_REQUEST['ROIRENDERER'][i]
     *          mutándolo. Se puede solucionar haciendo un clone del "shapeObj"
     */
    fwrite($debug, "Guardando archivos\n");
    
    if($szHayPol && $formats['shp']){
        fwrite($debug, "Guardando shapefile\n");
        saveToShapeFile($_REQUEST['ROIRENDERER'], $szFileNamePol, $debug);
        array_push($aSzFiles, $szFileNamePol.".shp");
        array_push($aSzFiles, $szFileNamePol.".shx");
        array_push($aSzFiles, $szFileNamePol.".dbf");
        fwrite($debug, "Shapefile guardado\n");     
    }
    if($szHayLin){
        fwrite($debug, "Guardando shapefile\n");
        saveToShapeFile($_REQUEST['ROIRENDERER'], $szFileNamePol, $debug);
        array_push($aSzFiles, $szFileNameLin.".shp");
        array_push($aSzFiles, $szFileNameLin.".shx");
        array_push($aSzFiles, $szFileNameLin.".dbf");
        fwrite($debug, "Shapefile guardado\n");
    }
    if($szHayPto){
        fwrite($debug, "Guardando shapefile\n");
        saveToShapeFile($_REQUEST['ROIRENDERER'], $szFileNamePol, $debug);
        array_push($aSzFiles, $szFileNamePto.".shp");
        array_push($aSzFiles, $szFileNamePto.".shx");
        array_push($aSzFiles, $szFileNamePto.".dbf");
        fwrite($debug, "Shapefile guardado\n");
    }
    if($formats['gml'] || $formats['kml']){
//        saveGeoShapeFile($_REQUEST['ROIRENDERER'], $szFileNamePol.'_geo', 'GML', $mapProj, $geoProj, $debug);
//        if($formats['gml']){
//            fwrite($debug, "Guardando gml\n");
//            saveToGoogleFormat($szFileNamePol.'_geo', 'GML', $debug);
//            array_push($aSzFziles, $szFileNamePto.".gml");
//            fwrite($debug, "gml guardado\n");
//        }
        if($formats['kml']){
            fwrite($debug, "Guardando kml\n");
            saveToGoogleFormat($_REQUEST['ROIRENDERER'], $szFileNamePol.'.kml', $mapProj, $geoProj, $debug);
            array_push($aSzFiles, $szFileNamePol.".kml");
            fwrite($debug, "kml guardado\n");
        }
//        unlink($szFileName.'.dbf');
//        unlink($szFileName.'.shp');
//        unlink($szFileName.'.shx');
    }
    freeShapeObjects($_REQUEST['ROIRENDERER'], $debug);

    fwrite($debug, 'arreglo archivos = '.print_r($aSzFiles, true));
    
    //download directory
    $sTmpDir = 'C:\ms4w\tmp\ms_tmp\\';
    $szFile = getUniqueName('.zip');
    
    //compress files
    fwrite($debug, "Comprimiendo archos\n");
    zip($aSzFiles, $sTmpDir.$szFile);
    fwrite($debug, "Archivos comprimidos\n");
    
//    delete files
    foreach($aSzFiles as $file)
        unlink($file);

    fclose($debug);
    //return the url of the file
    $result = NULL;
    $result->hasSelection = true;
    $result->value = '/ms_tmp/'.$szFile;
    
    header('Content-type: text/x-json');
    header('X-JSON: true');

    echo var2json($result);
}


function getUniqueName($suffix = ''){
    return uniqid(mt_rand()).$suffix;
}

function CreaBase($szFileName, $szTipo, $debug){
    if(!extension_loaded('dbase')){
        $dbasemodulename = 'php_dbase.'.PHP_SHLIB_SUFFIX;
        dl($dbasemodulename);
    }
        
    // init vars
    $bCreateDBF = true;

    // delete file if it exists
    if(file_exists($szFileName.".dbf")){
        // remove & flag
        unlink($szFileName.".dbf");
        $bCreateDBF = false;
    }

    // create if necessary
    if($bCreateDBF){
        // create an array for the dbf structure

        // delete files if they exist
        
    	if(file_exists($szFileName.".shp"))
            unlink($szFileName.".shp");
    	if(file_exists($szFileName.".shx"))
    	    unlink($szFileName.".shx");

        // create new file
        switch($szTipo){
            case 'pol':
                $aDbfStruct = array(
                              array('id'       ,'N', 7, 0),
                              array('tipo'     ,'C', 15),
                              array('Perim_km' ,'N', 11, 2),
                              array('Area_km2' ,'N', 11, 2),
                              array('descrip'  ,'C', 255),
                              );

                // create the dbase file
                $dbfFile = dbase_create($szFileName.'.dbf', $aDbfStruct);
                fwrite($debug, "Creando shapefile ".dirname(__FILE__).'\\'.$szFileName."\n");
                $shpFile = ms_newShapefileObj(dirname(__FILE__).'\\'.$szFileName, MS_SHP_POLYGON);
                fwrite($debug, "Shapefile creado\n");
                break;
            case 'lin':
                $aDbfStruct = array(
                              array('id'       ,'N', 7, 0),
                              array('largo'    ,'N', 11, 2),
                              array('descrip'  ,'C', 255),
                              );

            		// create the dbase file
                $dbfFile = dbase_create($szFileName.'.dbf', $aDbfStruct);
                $shpFile = ms_newShapefileObj(dirname(__FILE__).'\\'.$szFileName, MS_SHP_ARC);
                break;
            case 'pto':
                $aDbfStruct = array(
                              array('id'       ,'N', 7, 0),
                              array('Coord_X'  ,'N', 11, 0),
                              array('Coord_Y'  ,'N', 11, 0),
                              array('descrip'  ,'C', 255),
                              );

                // create the dbase file
                $dbfFile = dbase_create($szFileName.'.dbf', $aDbfStruct);
                $shpFile = ms_newShapefileObj(dirname(__FILE__).'\\'.$szFileName, MS_SHP_POINT);
                break;
        }
        $shpFile->free();
    	// close the dbf
    	dbase_close($dbfFile);
    }
    return true;
}

function getShapeObj($aROI, $debug){
    fwrite($debug, "Creando shape\n");
    $aPuntos = ProcesaROI($aROI);
    $oShp = ms_newShapeObj(MS_SHP_LINE);
    $oLine = ms_newLineObj();
    $nPoints = count($aPuntos);
    fwrite($debug, "Creanndo shape con $nPoints puntos\n");
    for($i = 0; $i<$nPoints-1; $i += 2)
        $oLine->addXY($aPuntos[$i], $aPuntos[$i+1]);
    $oShp->add($oLine);
    fwrite($debug, print_r($oLine, true));
    $oLine->free();
    fwrite($debug, print_r($oShp, true));
    fwrite($debug, "Shape creado\n");
    return $oShp;
}

//Solo polígonos
function saveGeoShapeFile($aROIs, $szFileName, $format, $inProj, $outProj, $debug){
    foreach($aROIs as $aROI){
        $oShape = $aROI['shapeObj'];
        fwrite($debug, "Projecting shape with in = ".print_r($inProj, true)."and out = ".print_r($outProj, true)."...\n");
        $oShape->project($inProj, $outProj);
        fwrite($debug, "Shape projected. Now adding record to shapefile ...\n");
        addRecord($szFileName,
                  $oShape,
                  array(-1, $aROI['type'], -1, -1, $aROI['label']),
                  $debug);
        fwrite($debug, "Record added\n");
    }
}


function saveToGoogleFormat($aROIs, $szFileName, $inProj, $outProj, $debug){

    $kml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".
           '<kml xmlns="http://www.opengis.net/kml/2.2">'."\n".
               '<Document>'."\n".
                   '<Folder>'."\n".
                       '<name>Mis Figuras</name>'."\n";
    foreach($aROIs as $aROI){
        $kml .= '<Placemark>'."\n".
                   '<name>'.$aROI['label'].'</name>'."\n";
        if($aROI['type'] == 'polygon')
            $kml .= '<Polygon>'."\n".
                        '<extrude>1</extrude>'."\n".
                           '<altitudeMode>clampedToGround</altitudeMode>'."\n".
                           '<outerBoundaryIs>'."\n".
                               '<LinearRing>'."\n".
                                   '<coordinates>'."\n";
        if($aROI['type'] == 'line')
            $kml .= '<LineString>'."\n".
                        '<extrude>1</extrude>'."\n".
                        '<tessellate>1</tessellate>'."\n".
                        '<altitudeMode>clampedToGround</altitudeMode>'."\n".
                        '<coordinates>'."\n";
        if($aROI['type'] == 'point')
            $kml .= '<Point>'."\n".
                        '<coordinates>'."\n";
        $oShape = $aROI['shapeObj'];
        $oShape->project($inProj, $outProj);
        $oLine = $oShape->line(0);
        fwrite($debug, "Recorriendo lineas ($oLine->numpoints lineas) ...\n");
        for($i = 0; $i<$oLine->numpoints-1; $i++){
            fwrite($debug, print_r($oLine->point($i), true));
            $oPoint = $oLine->point($i);
            $kml .= $oPoint->x.', '.$oPoint->y.", 0\n";
            fwrite($debug, $oPoint->x.', '.$oPoint->y.", 0\n");
        }
        $oPoint = $oLine->point($oLine->numpoints-1);
        $kml .= $oPoint->x.', '.$oPoint->y.", 0\n";
        fwrite($debug, $oPoint->x.', '.$oPoint->y.", 0\n");
        if($aROI['type'] == 'polygon')
            $kml .= '</coordinates>'."\n".
                    '</LinearRing>'."\n".
                    '</outerBoundaryIs>'."\n".
                    '</Polygon>'."\n".
                    '</Placemark>'."\n";
        if($aROI['type'] == 'line')
            $kml .= '</coordinates>'."\n".
                    '</LineString>'."\n".
                    '</Placemark>'."\n";   
        if($aROI['type'] == 'point')
            $kml .= '</coordinates>'."\n".
                    '</Point>'."\n".
                    '</Placemark>'."\n"; 
    }
    $kml .= '</Folder>'."\n".
            '</Document>'."\n".
            '</kml>';
    $fKml = fopen($szFileName, 'w');
    fwrite($fKml, $kml);
    fclose($fKml);
}

//Solo polígonos
function saveToShapeFile($aROIs, $szFileName, $debug){
    foreach($aROIs as $aROI){
        fwrite($debug, "adding record to $szFileName\n");
        $oShape = $aROI['shapeObj'];
        addRecord($szFileName,
                  $oShape,
                  array(-1, $aROI['type'], -1, -1, $aROI['label']),
                  $debug);
        fwrite($debug, "record added\n");
    }
}

function addRecord($szFileName, $oShape, $aszProperties, $debug){
    fwrite($debug, "oppening dbf file\n");
    $dbfFile = dbase_open($szFileName.'.dbf', 2);
    $nCount = dbase_numrecords($dbfFile);
    $nMaxID = $nCount + 1;
    $aszProperties[0] = $nMaxID;
    fwrite($debug, "dbf file opened\n");
    if(count($aszProperties) > 0){
        fwrite($debug, "oppening ".dirname(__FILE__).'\\'.$szFileName."\n");
        $shpFile = ms_newShapefileObj(dirname(__FILE__).'\\'.$szFileName, -2);
        fwrite($debug, "adding shape\n");
        $shpFile->addShape($oShape);
        fwrite($debug, "shape added\n");
        if($aszProperties == 'polygon' || $aszProperties == 'line')
            $aszPointProperties[2] = $oShape->getLength();
        if($aszProperties == 'polygon')    
            $aszPointProperties[3] = $oShape->getArea();
        fwrite($debug, "adding properties to dbf\n");
        dbase_add_record($dbfFile, array_values($aszPointProperties));
        fwrite($debug, "properties added\n");
    }
    $shpFile->free();
    // close the dbf
    dbase_close($dbfFile);
    // return success
    return true;
}

function freeShapeObjects($aROIs, $debug){
    foreach($aROIs as $aROI){
        $oShape = $aROI['shapeObj'];
        $oShape->free();
    }
}

function SaveROI(&$aROI, $szFileName, $sZFileNameGeo, $formats, $mapProj, $geoProj, $debug){
    $aPuntos = ProcesaROI(&$aROI);
    fwrite($debug, "\$aPuntos = ".print_r($aPuntos, true)."\n");
    $nPoints = count($aPuntos);
    if($nPoints > 0){
        switch($aROI['type']){
            case 'rectangle':
                updatePolDBFRecord($szFileName,
                                   array(-1, $aROI['type'], -1, -1, $aROI['label']),
                                   -1,
                                   $aPuntos);
                break;
            case 'polygon':
                fwrite($debug, "Updating shapefile $szFileName\n");
                updatePolDBFRecord($szFileName,
                                   $sZFileNameGeo,
                                   $formats,
                                   $mapProj,
                                   $geoProj,
                                   array(-1, $aROI['type'], -1, -1, $aROI['label']),
                                   -1,
                                   $aPuntos,
                                   $debug);
                fwrite($debug, "Shapefile $szFileName updated\n");
                break;
            case 'line':
                updateLinDBFRecord($szFileName,
                                   array(-1, -1, $aROI['label']),
                                   -1,
                                   $aPuntos);
                break;
            case 'point':
                updatePtoDBFRecord($szFileName,
                                   array(-1, $aPuntos[0], $aPuntos[1], $aROI['label']),
                                   -1,
                                   $aPuntos);
                break;
            default:
                break;
        }
    }
  return true;
}

function ProcesaROI(&$aROI){
    $aPoints = array();
    switch($aROI['type']){
//        case 'rectangle':
//            //for rectangles, we assume that there are two coordinates, top left and bottom right.
//            array_push($aPoints, $aROI['aGeoCoords'][0]);
//            array_push($aPoints, $aROI['aGeoCoords'][1]);
//
//            array_push($aPoints, $aROI['aGeoCoords'][2]);
//            array_push($aPoints, $aROI['aGeoCoords'][1]);
//
//            array_push($aPoints, $aROI['aGeoCoords'][2]);
//            array_push($aPoints, $aROI['aGeoCoords'][3]);
//
//            array_push($aPoints, $aROI['aGeoCoords'][0]);
//            array_push($aPoints, $aROI['aGeoCoords'][3]);
//
//            array_push($aPoints, $aROI['aGeoCoords'][0]);
//            array_push($aPoints, $aROI['aGeoCoords'][1]);
//            $nPoints = 5;
//
//            // flag for poly
//            $bPoly = true;
//            break;
//        case 'circle':
//            // convert center and radius to pixel
//            $dCenterX = $aROI['aGeoCoords'][0];
//            $dCenterY = $aROI['aGeoCoords'][1];
//            $dRadiusX = $aROI['aGeoCoords'][2];
//
//            $dRadius = abs($dRadiusX - $dCenterX);
//
//            // flag for non-poly
//            $bPoly = false;
//           break;
        case 'polygon':
            // loop and set coordinates
            $nCount = count($aROI['aGeoCoords']);
            for($i = 0; $i<$nCount; $i++)
                array_push($aPoints, $aROI['aGeoCoords'][$i]);
            array_push($aPoints, $aROI['aGeoCoords'][0]);
            array_push($aPoints, $aROI['aGeoCoords'][1]);
            $nPoints = round($nCount/2);

            // flag for poly
            $bPoly = true;
            break;
        case 'line':
            $nCount = count($aROI['aGeoCoords']);
            for($i=0; $i<$nCount; $i++)
                array_push($aPoints, $aROI['aGeoCoords'][$i]);
            break;
        case  'point':
            array_push($aPoints, $aROI['aGeoCoords'][0]);
            array_push($aPoints, $aROI['aGeoCoords'][1]);
            break;
        default:
            break;
    }
    return $aPoints;
}

function updatePolDBFRecord($szFileName, 
                            $sZFileNameGeo,
                            $mapProj,
                            $geoProj,
                            $aszPointProperties,
                            $nId = -1,
                            $aPuntos,
                            $debug)
{
                            
    fwrite($debug, "Linea 309\n");
    $dbfFile = dbase_open($szFileName.'.dbf', 2);
    $nCount = dbase_numrecords($dbfFile);
    fwrite($debug, "Linea 312\n");
    $nMaxID = $nCount + 1;
    $aszPointProperties[0] = $nMaxID;
    // add the record to the dbase file if the array is populated
    if(count($aszPointProperties) > 0){
        fwrite($debug, "Linea 317 $szFileName\n");
        $shpFile = ms_newShapefileObj(dirname(__FILE__).'\\'.$szFileName, -2);
        fwrite($debug, "Linea 319 \n");
        $oShp = ms_newShapeObj(MS_SHP_LINE);
        fwrite($debug, "Linea 321\n");
        $oLine = ms_newLineObj();
        fwrite($debug, "Linea 323\n");
        $nPoints = count($aPuntos);
        for($i = 0; $i<$nPoints-2; $i += 2)
            $oLine->addXY($aPuntos[$i], $aPuntos[$i+1]);
        $oShp->add($oLine);
        fwrite($debug, "Linea 328\n");
        $oLine->free();
        $shpFile->addShape($oShp);
        fwrite($debug, "Linea 331\n");
        $aszPointProperties[2] = $oShp->getLength();
        $aszPointProperties[3] = $oShp->getArea();
        dbase_add_record($dbfFile, array_values($aszPointProperties));
    }
    $oShp->free();
    $shpFile->free();
    // close the dbf
    dbase_close($dbfFile);
    // return success
    fwrite($debug, "Linea 341\n");
    return true;
}

function updateLinDBFRecord($szFileName, $aszPointProperties, $nId = -1, $aPuntos){
    $dbfFile = dbase_open($szFileName.'.dbf', 2);
    $nCount = dbase_numrecords($dbfFile);
    $nMaxID = $nCount + 1;
    $aszPointProperties[0] = $nMaxID;
    // add the record to the dbase file if the array is populated
    if(count($aszPointProperties) > 0){
        $shpFile = ms_newShapefileObj(dirname(__FILE__).'\\'.$szFileName, -2);
        $oShp = ms_newShapeObj(MS_SHP_LINE);
        $oLine = ms_newLineObj();
        $nPoints = count($aPuntos);
        for($i=0; $i<$nPoints-2; $i += 2)
            $oLine->addXY($aPuntos[$i], $aPuntos[$i+1]);
        $oShp->add($oLine);
        $oLine->free();
        $shpFile->addShape($oShp);
        $aszPointProperties[1] = $oShp->getLength();
        dbase_add_record($dbfFile, array_values($aszPointProperties));
    }
    $oShp->free();
    $shpFile->free();
    // close the dbf
    dbase_close($dbfFile);
    // return success
    return true;
}

function updatePtoDBFRecord($szFileName, $aszPointProperties, $nId = -1, $aPuntos){
    $dbfFile = dbase_open($szFileName.'.dbf', 2);
    // loop through the database and match the id
    $nCount = dbase_numrecords($dbfFile);
    //$nMaxID = 0;
    $nMaxID = $nCount + 1;
    $aszPointProperties[0] = $nMaxID;
    // add the record to the dbase file if the array is populated
    if(count($aszPointProperties) > 0){
        $shpFile = ms_newShapefileObj(dirname(__FILE__).'\\'.$szFileName, -2);
        $nPoints = count($aPuntos);
        if($nPoints > 0){
            $oShp = ms_newShapeObj(MS_SHP_POINT);
            $oPoint = ms_newLineObj();
            $oPoint->addXY($aPuntos[0], $aPuntos[1]);
            $oShp->add($oPoint);
            $oPoint->free();
            $shpFile->addShape($oShp);
            $oShp->free();
            dbase_add_record($dbfFile, array_values($aszPointProperties));
        }
    }
    $shpFile->free();
    // close the dbf
    dbase_close($dbfFile);
    // return success
    return true;
}

function zip($aszSource, $szDestination){
    // include file
    include_once(dirname(__FILE__)."/../../../chameleon/htdocs/common/zip/zip.php");

    // build archive
    $szDirName = dirname($szDestination);

    // specify filename for output file
    $aParams = array();
    $aParams[ARCHIVE_ZIP_PARAM_REMOVE_ALL_PATH] = true;
    $zip = new Archive_Zip($szDestination);
    if(! $zip->create($aszSource, $aParams))
        return false;
    else
        return true;
}

////$fusionMGpath = '../fusion/MapServer/php/';
//include $fusionMGpath . 'Common.php';
//
//$files = '';
//if(isset($_REQUEST['kml'])) {
//  $sKml = '<?xml version="1.0" encoding="UTF-8"'.
//          '<kml xmlns="http://earth.google.com/kml/2.2">'.
//          '<Document><name>Custom kml</name>'.
//  	      '<description>polygon</description>'.
//    	  '<Style id="rangecolour">'.
//    	  '<LineStyle><color>660000FF</color><width>0.1</width></LineStyle>'.
//    	  '<PolyStyle><color>660000FF</color></PolyStyle>'.
//    	  '</Style>'.
//    	  '<Style id="linecolour">'.
//    	  '<LineStyle><color>660000FF</color><width>3</width></LineStyle>'.
//    	  '</Style>'.
//          $_REQUEST['kml'].
//          '</Document></kml>';
//  $kml = fopen('polygon.kml', 'w');
//  fwrite($kml, $sKml);
//  fclose($kml);
//  $files .= 'polygon.kml';
//}
//if(isset($_REQUEST['gml'])) {
//  $gml = fopen('polygon.gml', 'w');
//  fwrite($gml, $_REQUEST['gml']);
//  fclose($gml);
//  $files .= 'polygon.gml ';
//}
//
//if(isset($_REQUEST['shp'])) {
//  exec('C:\ms4w\tools\shapelib\shpcreate.exe polygon polygon', $ans);
//  exec('C:\ms4w\tools\shapelib\shpadd.exe polygon '.$_REQUEST['shp'], $ans);
//  $files .= 'polygon.shp polygon.shx ';
//}
//
//exec('zip C:\ms4w\apps\poligono\polygon.zip '.$files, $ans);
//exec('del '.$files, $ans);
//
//echo '';

?>