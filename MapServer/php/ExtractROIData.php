<?php
/**
 * @project     Chameleon
 * @revision    $Id: ExtractROIData.php,v 1.10 2004/12/02 16:55:08 wbronsema Exp $
 * @purpose     This contains the supporting php code.
 * @author      William A. Bronsema, C.E.T. (dev@dmsolutions.ca)
 * @copyright
 * <b>Copyright (c) 2003, DM Solutions Group Inc.</b>
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
 **/

// set the time limit
set_time_limit( 120 );

//set the language resource file
$szLanguageResource = str_replace("\\","/",dirname(__FILE__))."/ExtractROIData";

// set the flag to setup the mapsession
if ( !defined("LOAD_MAPSESSION") )
    define("LOAD_MAPSESSION", 1);

// include the session handling file (currently only required for MLT)
include_once("../session.inc.php");
include_once("../CWC2ButtonCache.php");

// include the ogr handling functions
include( COMMON."/ogr/ogr2ogr.php" );

// check if the ogr module is available
$szOGRModuleName = '';
$bModuleFound = checkOGRModule( $szOGRModuleName );

// get the form vars
$_FORM = array_merge( $_GET, $_POST );

/* ============================================================================
 * Determine the layer specific info
 * ========================================================================= */
// init vars
$nCount = 0;
$nSelectedLayer = '';
$szSelectedLayerName = "";
$szErrorNotice = "";
$szWFSConnection = "";
$szLayerType = "";
$bSkipGetFeature = false;
$szHayPol=false;
$szHayLin=false;
$szHayPto=false;
$bClearFilter = false;
$nLayerCount = $oMapSession->oMap->numlayers;
$szSpacialFilter = '';
$szExistingWFSFilter = '';
$szROIExists = '';
$szFileNamePol ="";
$szFileNameLin = "";
$szFileNamePto = "";
$aCoords = array();
//echo "num Elementos:".$_SESSION['ROIRENDERER_COUNT'].";";
if ( isset( $_FORM["txtDLFilename"] ) &&
             	strlen( trim( $_FORM["txtDLFilename"] ) ) > 0 )
{

     if (isset($_SESSION['ROIRENDERER']) || count($_SESSION['ROIRENDERER']) > 0 )
     {
        $nROI =count($_SESSION['ROIRENDERER']);
        $szFileNamePol = getUniqueName1();
        $szFileNameLin = getUniqueName2();
        $szFileNamePto = getUniqueName3();
        for($i=0; $i<$nROI; $i++)
        {
           $aROI = $_SESSION['ROIRENDERER'][$i];
           //echo "tipo de elemento:".$aROI['type'].";";
           if($aROI['mode'] = 1 or $aROI['mode'] = 2)
           {
        		switch($aROI['type'])
        		{
          			case 'rectangle':
            			$szHayPol=true;
                	break;
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
        }
        //echo "num Elementos:".$_SESSION['ROIRENDERER_COUNT']."-".$szHayPol;
        if ($szHayPol) CreaBase( $szFileNamePol,"pol" );

        if ($szHayLin) CreaBase( $szFileNameLin, "lin" );

        if ($szHayPto) CreaBase( $szFileNamePto, "pto" );
        // graba Roi
        for($i=0; $i<$nROI; $i++)
        {
           $aROI = $_SESSION['ROIRENDERER'][$i];
           if($aROI['mode'] = 1 or $aROI['mode'] = 2)
           {
           		switch($aROI['type'])
        		{
          			case 'rectangle':
            			SaveROI($aROI, $szFileNamePol);
                	break;
          			case 'polygon':
            			SaveROI($aROI, $szFileNamePol);
                	break;
          			case 'line':
                		SaveROI($aROI, $szFileNameLin);
                	break;
          			case 'point':
            			SaveROI($aROI, $szFileNamePto);
                	break;
          			default:

            		break;
           		}

           }
        }
        //clean up after feature ROIs ...
        unset($_SESSION['ROIRENDERER']);

        $_FORM["txtExtract"] == 1;
     }
}

/* ============================================================================
 * Perform extraction
 * ========================================================================= */
if ( isset( $_FORM["txtExtract"] ) && $_FORM["txtExtract"] == 1 )
{
        //if ( isset( $_SESSION['ROILayerDataPath'] ) )
        //{
          //	$szDownloadPath = $_SESSION['ROILayerDataPath'];
            if ($szHayPol && $szHayLin && $szHayPto)
            {
        	   $aSzFiles = array($szFileNamePol.".shp", $szFileNamePol.".shx", $szFileNamePol.".dbf", $szFileNameLin.".shp", $szFileNameLin.".shx", $szFileNameLin.".dbf", $szFileNamePto.".shp", $szFileNamePto.".shx", $szFileNamePto.".dbf");
            }
            elseif ($szHayPol && $szHayLin && !$szHayPto)
            {
               $aSzFiles = array($szFileNamePol.".shp", $szFileNamePol.".shx", $szFileNamePol.".dbf", $szFileNameLin.".shp", $szFileNameLin.".shx", $szFileNameLin.".dbf");
            }
            elseif ($szHayPol && !$szHayLin && $szHayPto)
            {
               $aSzFiles = array($szFileNamePol.".shp", $szFileNamePol.".shx", $szFileNamePol.".dbf", $szFileNamePto.".shp", $szFileNamePto.".shx", $szFileNamePto.".dbf");
            }
            elseif (!$szHayPol && $szHayLin && $szHayPto)
            {
               $aSzFiles = array($szFileNameLin.".shp", $szFileNameLin.".shx", $szFileNameLin.".dbf", $szFileNamePto.".shp", $szFileNamePto.".shx", $szFileNamePto.".dbf");
            }
            elseif ($szHayPol && !$szHayLin && !$szHayPto)
            {
               $aSzFiles = array($szFileNamePol.".shp", $szFileNamePol.".shx", $szFileNamePol.".dbf");
            }
            elseif (!$szHayPol && $szHayLin && !$szHayPto)
            {
               $aSzFiles = array($szFileNameLin.".shp", $szFileNameLin.".shx", $szFileNameLin.".dbf");
            }
            elseif (!$szHayPol && !$szHayLin && $szHayPto)
            {
               $aSzFiles = array($szFileNamePto.".shp", $szFileNamePto.".shx", $szFileNamePto.".dbf");
            }
            // create the temp download directory
        	$szDownloadPath = cleanPath( $_SESSION["gszTmpImgPath"] );
        	$szDownloadUrl = cleanPath( $_SESSION["gszTmpWebPath"] );
        	$szUniqid = md5( uniqid( rand(), true ) );

        	// check if directory exists
        	if ( !is_dir( $szDownloadPath.$szUniqid."/" ) )
            	@mkdir( $szDownloadPath.$szUniqid."/", 0777 );

        	// check for failure
        	if ( !is_dir( $szDownloadPath.$szUniqid."/" ) )
        	{
            	// set flag
            	$bSkipExtract = true;

            	// set error message
            	$szErrorNotice .= $oMLT->get("17",
                                    "Error al crear directorio temporal de bajada." );
       		}
        	else
        	{
            	// set flag
            	$bSkipExtract = false;

            	// update paths
            	$szDownloadPath .= $szUniqid."/";
            	$szDownloadUrl .= $szUniqid."/";
        	}
        //}

        	if ( isset( $_FORM["txtDLFilename"] ) &&
             	strlen( trim( $_FORM["txtDLFilename"] ) ) > 0 )
            	$szFile = $_FORM["txtDLFilename"];
        	else
            	$szFile = "Pol_".$szUniqid;

        	if ( isset( $_FORM["selCompressType"] ) &&
                     strtoupper($_FORM["selCompressType"]) == "TGZ" )
        	{

                    	if ( !tar( $aSzFiles, $szDownloadPath.$szFile.".tar" ))
                    	    $szErrorNotice .= $oMLT->get("10", "No se pudo crear archivo comprimido" );


                    	// set the ext name to download
		                $szExt = ".tar.gz";

		                // compress
		                gZip( $szDownloadPath.$szFile.".tar", $szDownloadPath.$szFile.$szExt );

		                // delete the original file
		                if ( file_exists( $szDownloadPath.$szFile.".tar" ) )
		                    unlink( $szDownloadPath.$szFile.".tar" );
                            //$szErrorNotice .= "Listo, cierre la ventana";
	    	}
        	else if ( isset( $_FORM["selCompressType"] ) &&
                      strtoupper($_FORM["selCompressType"]) == "ZIP" )
        	{
                      // combine shape files into zip (compressed)
                      $szExt = ".zip";
                      zip( $aSzFiles, $szDownloadPath.$szFile.$szExt );
                      //$szErrorNotice .= $szDownloadUrl;
        	}
        	else
        	{
               // give error message
         		$szErrorNotice .= $oMLT->get("4", "Falta Grabar Poligonos.  ".
         		"o no se han dibujado." );
          		//$szErrorNotice .=$_SERVER['HTTP_HOST']
        	}

}

/* ============================================================================
 * Determine the output filename to display
 * ========================================================================= */
if ( isset( $_FORM["txtDLFilename"] ) &&
     strlen( trim( $_FORM["txtDLFilename"] ) ) > 0 )
{
    $szDLFilename = $_FORM["txtDLFilename"];
}
else
{
    $szDLFilename = "Dibujos_usuario";
}

/* ============================================================================
 * Make close button
 * ========================================================================= */
$szCloseButton = makeButton( 'CloseWindow', '', 'ExtractROIData',
        "icons/icon_cancel.png", $oMLT->get( 'common', 'Cancel', 'Cancel' ),
        "Cierra el Diálogo", array( 'width' => 75) );


function tar( $aszSource, $szDestination )
{
    // include file
    include( COMMON."/tar/tar.php" );

    // specify filename for output file
    $tar = new Archive_Tar( $szDestination );

    // build archive
    if ( !$tar->create( $aszSource ) )
        return false;
    else
        return true;
}

function gZip( $szSource, $szDestination )
{
    $fp = fopen( $szSource, "r" );
    $data = fread ( $fp, filesize( $szSource ) );
    fclose( $fp );
    $zp = gzopen( $szDestination, "w9" );
    gzwrite( $zp, $data );
    gzclose( $zp );
}

function zip( $aszSource, $szDestination )
{
    // include file
    include_once( COMMON."/zip/zip.php" );

    // build archive
    $szDirName = dirname( $szDestination );

    // specify filename for output file
    $aParams = array();
    $aParams[ARCHIVE_ZIP_PARAM_REMOVE_ALL_PATH] = true;
    $zip = new Archive_Zip( $szDestination );
    if( ! $zip->create( $aszSource, $aParams ) )
        return false;
    else
        return true;
}

/**
 * cleanPath()
 *
 * Postcondition:  This function takes a path and converts all "\" to "/" and
 *                 guarantees that the path will end with "/" with no whitespaces.
 *
 * @param szPath string - path to clean.
 * @return string - clean path.
 * @desc Cleans path and guarantees closing "/".
 */
function cleanPath( $szPath )
{
    // replace "\" and trim whitespace
    $szReturn = trim( str_replace( "\\", "/", $szPath ) );

    // check for closing "/"
    if ( substr( $szReturn, -1 ) != "/" )
        $szReturn .= "/";

    // return
    return $szReturn;
}

function getUniqueName1()
{
    return $_SESSION['gszTmpPath']."Poligonos_usuario";
}

function getUniqueName2()
{
    return $_SESSION['gszTmpPath']."Lineas_usuario";
}

function getUniqueName3()
{
    return $_SESSION['gszTmpPath']."Puntos_usuario";

}

/**
 * Create dbf, shp and shx files
 */
function CreaBase($szFileName, $szTipo)
{
		if (!extension_loaded('dbase'))
        {
          $dbasemodulename = 'php_dbase.'.PHP_SHLIB_SUFFIX;
          dl( $dbasemodulename );
        }
 // init vars
    $bCreateDBF = true;

    // delete file if it exists
    if ( file_exists( $szFileName.".dbf" ) )
    {
        // remove & flag
        //unlink( $szFileName.".dbf" );
        $bCreateDBF = false;
    }

    // create if necessary
    if ( $bCreateDBF )
    {
        // create an array for the dbf structure

      // delete files if they exist
    	if ( file_exists( $szFileName.".shp" ) )  unlink( $szFileName.".shp" );
    	if ( file_exists( $szFileName.".shx" ) )  unlink( $szFileName.".shx" );

        // create new file
    		switch($szTipo)
        	{
          	case 'pol':
            $aDbfStruct =   array(
                            array( 'id'       ,'N', 7, 0),
                            array( 'tipo'     ,'C', 15  ),
                            array( 'Perim_km' ,'N', 11, 2),
                            array( 'Area_km2' ,'N', 11, 2),
                            array( 'descrip'  ,'C', 255 ),
                        );

        		// create the dbase file
                $dbfFile = dbase_create( $szFileName.'.dbf', $aDbfStruct);
            	$shpFile = ms_newShapeFileObj( $szFileName, MS_SHP_POLYGON);
            	break;
          	case 'lin':
            $aDbfStruct =   array(
                            array( 'id'       ,'N', 7, 0),
                            array( 'largo'    ,'N', 11, 2),
                            array( 'descrip'  ,'C', 255 ),
                        );

        		// create the dbase file
                $dbfFile = dbase_create( $szFileName.'.dbf', $aDbfStruct);
            	$shpFile = ms_newShapeFileObj( $szFileName, MS_SHP_ARC);
            	break;
          	case 'pto':
            $aDbfStruct =   array(
                            array( 'id'       ,'N', 7, 0),
                            array( 'Coord_X'  ,'N', 11, 0),
                            array( 'Coord_Y'  ,'N', 11, 0),
                            array( 'descrip'  ,'C', 255 ),
                        );

                // create the dbase file
                $dbfFile = dbase_create( $szFileName.'.dbf', $aDbfStruct);
                $shpFile = ms_newShapeFileObj( $szFileName, MS_SHP_POINT);
            	break;
             }
    	$shpFile->free();
    	// close the dbf
    	dbase_close( $dbfFile );
    }
    return true;
}


function SaveROI(&$aROI, $szFileName)
{
    $aPuntos = ProcesaROI(&$aROI);

    $nPoints = count($aPuntos);
    if ($nPoints > 0)
    {
         if ($aROI['type'] == 'rectangle')
          {
             updatePolDBFRecord($szFileName, array( -1, $aROI['type'], -1, -1, $aROI['label']),-1, $aPuntos );
          }
          elseif ( $aROI['type'] == 'polygon' )
          {
             updatePolDBFRecord($szFileName, array( -1, $aROI['type'], -1,-1, $aROI['label']),-1, $aPuntos );
          }
          elseif ($aROI['type'] == 'line')
    	  {
             updateLinDBFRecord($szFileName, array( -1, -1, $aROI['label']),-1, $aPuntos );
          }
          elseif ($aROI['type'] == 'point')
    	  {
             updatePtoDBFRecord($szFileName, array( -1, $aPuntos[0], $aPuntos[1], $aROI['label']),-1, $aPuntos );
          }
    }
  return true;
}

// clean up after an ROI, specifically Feature ROIs ...
function cleanUpROI( $aROI )
{
    if ($aROI['type'] == 'feature' && file_exists($aROI['query_file']))
    {
        unlink( $aROI['query_file'] );
        if (file_exists($aROI['query_file'].".txt"))
            unlink($aROI['query_file'].".txt");
    }
}

//use this to put text into the output image (for debugging :))
function renderText( $szText )
{
    $x = 10;
    if (!isset($GLOBALS['y']))
        $GLOBALS['y'] = 10;
    else
        $GLOBALS['y'] += 20;
    imagestring( $GLOBALS['oImage'], 2, $x, $GLOBALS['y'], $szText, $GLOBALS['nBlack'] );

}

function colorhexa2rgb( $szHexColor )
{
    if (substr($szHexColor, 0, 1) == "#")
    	$szHexColor = substr($szHexColor, 1 );
    $nRed = intval(substr($szHexColor,0,2),16);
    $nGreen = intval(substr($szHexColor,2,2),16);
    $nBlue = intval(substr($szHexColor,4,2),16);
    $aColor = $nRed." ".$nGreen." ".$nBlue;
    return $aColor;
}

/*
 * return a color index from the given image for a given hex color.  If opacity
 * is not false, then assume that it is either a percent or a number from 0-100 and
 * massage accordingly into a value between 0 (transparent) and 127 (opaque).
 */
function ProcesaROI( &$aROI )
{
    // debug
    //renderText(count($_SESSION['ROIRENDERER']));

    $aPoints = array();
     if ($aROI['type'] == 'rectangle')
    {
        //for rectangles, we assume that there are two coordinates, top left and bottom right.
        array_push( $aPoints, $aROI['aGeoCoords'][0] );
        array_push( $aPoints, $aROI['aGeoCoords'][1] );

        array_push( $aPoints, $aROI['aGeoCoords'][2] );
        array_push( $aPoints, $aROI['aGeoCoords'][1] );

        array_push( $aPoints, $aROI['aGeoCoords'][2] );
        array_push( $aPoints, $aROI['aGeoCoords'][3] );

        array_push( $aPoints, $aROI['aGeoCoords'][0] );
        array_push( $aPoints, $aROI['aGeoCoords'][3] );

        array_push( $aPoints, $aROI['aGeoCoords'][0] );
        array_push( $aPoints, $aROI['aGeoCoords'][1] );
        $nPoints = 5;

        // flag for poly
        $bPoly = true;
    }
    elseif ( $aROI['type'] == 'circle' )
    {
        // convert center and radius to pixel
        $dCenterX = $aROI['aGeoCoords'][0];
        $dCenterY = $aROI['aGeoCoords'][1];
        $dRadiusX = $aROI['aGeoCoords'][2];

        $dRadius = abs( $dRadiusX - $dCenterX );

        // flag for non-poly
        $bPoly = false;
    }
    elseif ( $aROI['type'] == 'polygon' )
    {
        // loop and set coordinates
        $nCount = count( $aROI['aGeoCoords'] );
        for( $i=0;$i<$nCount; $i++ )
        {
                array_push( $aPoints, $aROI['aGeoCoords'][$i]);
        }
         array_push( $aPoints, $aROI['aGeoCoords'][0]);
         array_push( $aPoints, $aROI['aGeoCoords'][1] );
        $nPoints = round( $nCount/2 );

        // flag for poly
        $bPoly = true;
    }
    elseif ($aROI['type'] == 'line')
    {
            // Only mode 1 and 2 (add) is supported for now.
            if($aROI['mode'] != 1 and $aROI['mode'] != 2)
            {
                $this->maszErrorMsg[] = "Tipo de Elemento inválido. ".
                    "Sólo agregar elementos está habilitado";
            }

            // For a line, we have a pair of value for each vertex.
            $nVertex = count($aROI['aGeoCoords']);
            for($i=0; $i<$nVertex; $i++)
            {
                array_push( $aPoints, $aROI['aGeoCoords'][$i]);
            }
    }
    elseif ($aROI['type'] == 'point')
    {
            // Only mode 1 and 2 (add) is supported for now.
            if($aROI['mode'] != 1 and $aROI['mode'] != 2)
            {
                $this->maszErrorMsg[] = "Tipo de Elemento inválido. ".
                    "Sólo agregar elementos está habilitado";
            }

            array_push( $aPoints, $aROI['aGeoCoords'][0] );
            array_push( $aPoints, $aROI['aGeoCoords'][1] );

	}
    elseif ($aROI['type'] == 'feature')
    {
        $nPoints = 0;
        $nLayers = $GLOBALS['oMapSession']->oMap->numlayers;
        for ($i=0; $i<$nLayers; $i++ )
        {
            $oLayer  = $GLOBALS['oMapSession']->oMap->getLayer( $i );
            $oLayer->set( 'status', MS_OFF );
        }
        $oLayer = @$GLOBALS['oMapSession']->oMap->getLayerByName( $aROI['selectedLayer'] );

        if ($oLayer && $oLayer->type == MS_LAYER_POLYGON)
        {
            $nResults = 0;
            //create the query template that turns polygons into something useful.
            $szTemplatePath = getSessionSavePath()."roirenderer_template.html";
            if (!file_exists( $szTemplatePath ) )
            {
                $szTemplate = '[shpxy xf="," yf="," sf="|" proj="image"]';
                $hTemplate = fopen( $szTemplatePath, "w+" );
                fwrite( $hTemplate, $szTemplate );
                fclose( $hTemplate );
            }
            //put the template on each class ... is this necessary?
            for ($i=0; $i<$oLayer->numclasses; $i++)
            {
                $oClass = $oLayer->getClass( $i );
                $oClass->set( "template", $szTemplatePath );
            }
            //make sure the layer is on (doh)
            $oLayer->set( "status", MS_ON );
            $oLayer->set( 'tolerance', 0 );
            $oLayer->set( 'toleranceunits', MS_PIXELS );
            //its a new query ...
            if (count($aROI['aGeoCoords']) == 2)
            {
                $aROI['aOrigCoords'] = $aROI['aGeoCoords'];
                $oPoint = ms_newPointObj( );
                $oPoint->setXY( $aROI['aGeoCoords'][0], $aROI['aGeoCoords'][1] );
                @$oLayer->queryByPoint( $oPoint, MS_SINGLE, 0 );
                $nResults = $oLayer->getNumResults();
                unset( $aROI['aGeoCoords'] );

                if ($nResults > 0)
                {
                    //save the query results for future passes ...
                    $aROI['query_file'] = getSessionSavePath()."/".uniqid("").".qry";
                    $GLOBALS['oMapSession']->oMap->saveQuery( $aROI['query_file'] );
                }
            }
            else if (isset($aROI['query_file']) && file_exists( $aROI['query_file'] ))
            {
                //load the query and find a layer with query results ...
                $GLOBALS['oMapSession']->oMap->loadQuery( $aROI['query_file'] );
                $nResults = $oLayer->getNumResults();
            }

            if ($nResults > 0)
            {
                $szCode = $GLOBALS['oMapSession']->oMap->processQueryTemplate( array(), false );
                //there seems to be a bug ... query results are not getting reset ... so we
                //introduce a | after each shape and then only take the first shape ...
                $aszCode = explode( "|", $szCode );
                $szCode = substr($aszCode[0], 0, -1 );
                $szCode = '$'.'aPoints = array('.$szCode.');';
                //?? aqui se debería procesar los puntos de coord mapa a Pix
                eval( $szCode );
                $nPoints = count($aPoints)/2;
                $bPoly = true;
            }
        }
    }
    
    return $aPoints;
}

/**
  _____________________________________________________________________________
 |
 |  updateDBFRecord()
 |
 |  Postcondition:  This function updates the the given dbf file.
 |
 |  @params $szFileName string - dbf path and filename.
 |  @params $aszPointProperties array - Array of point properties.
 |  @return boolean - True if successful, false if not.
 |  @desc Updates given dbf file.
 |_____________________________________________________________________________

 **/

function updatePtoDBFRecord( $szFileName, $aszPointProperties, $nId = -1, $aPuntos )
{
    // open the dbase file if necessary
    //if ( !isset( $dbfFile ) )
    //{
        $dbfFile = dbase_open( $szFileName.'.dbf', 2 );
    //}

    // loop through the database and match the id
    $nCount = dbase_numrecords( $dbfFile );
    //$nMaxID = 0;
    $nMaxID = $nCount + 1;

        $aszPointProperties[0] = $nMaxID;

    // add the record to the dbase file if the array is populated
    if ( count($aszPointProperties) > 0 )
    {
        $shpFile = ms_newShapeFileObj( $szFileName, -2 );
        $nPoints = count($aPuntos);
        if ($nPoints > 0 )
        	{
                $oShp = ms_newShapeObj(MS_SHP_POINT);
           		$oPoint = ms_newLineObj();
                $oPoint->addXY($aPuntos[0], $aPuntos[1]);
                $oShp->add($oPoint);
		        $oPoint->free();
                $shpFile->addShape($oShp);
                $oShp->free();
                dbase_add_record( $dbfFile, array_values( $aszPointProperties ) );
            }
    }
     $shpFile->free();
    // close the dbf
    dbase_close( $dbfFile );

    // return success
    return true;

// end updatePtoDBFRecord() function
}
function updateLinDBFRecord( $szFileName, $aszPointProperties, $nId = -1, $aPuntos )
{
        $dbfFile = dbase_open( $szFileName.'.dbf', 2 );
    $nCount = dbase_numrecords( $dbfFile );
    $nMaxID = $nCount + 1;

        $aszPointProperties[0] = $nMaxID;

    // add the record to the dbase file if the array is populated
    if ( count($aszPointProperties) > 0 )
    {
        $shpFile = ms_newShapeFileObj( $szFileName, -2 );
        $oShp = ms_newShapeObj(MS_SHP_LINE);
        $oLine = ms_newLineObj();
        $nPoints = count($aPuntos);
          for ( $i=0; $i<$nPoints; $i++ )
    	  {
            	if ( fmod( $i, 2 ) == 0 )
      			{
                    //$aX = $aPuntos[$i];
      			}
      			else
      			{
         			$j =  $i - 1;
                    //$aPuntos[$i];
                    $oLine->addXY($aPuntos[$j], $aPuntos[$i]);

      			}

    	  }

                    $oShp->add( $oLine );
		            $oLine->free();
                    $shpFile->addShape($oShp);

                    $aszPointProperties[1] = $oShp->getLength();
                    dbase_add_record( $dbfFile, array_values( $aszPointProperties ) );
    }               $oShp->free();
     $shpFile->free();
    // close the dbf
    dbase_close( $dbfFile );

    // return success
    return true;

// end updateLinDBFRecord() function
}
function updatePolDBFRecord( $szFileName, $aszPointProperties, $nId = -1, $aPuntos )
{
    $dbfFile = dbase_open( $szFileName.'.dbf', 2 );
    $nCount = dbase_numrecords( $dbfFile );
    $nMaxID = $nCount + 1;
    $aszPointProperties[0] = $nMaxID;
    // add the record to the dbase file if the array is populated
    if ( count($aszPointProperties) > 0 )
    {
        $shpFile = ms_newShapeFileObj( $szFileName, -2 );
        $oShp = ms_newShapeObj(MS_SHP_LINE);
        $oLine = ms_newLineObj();
        //$oLine->addXY($aPuntos[0], $aPuntos[1]);
        //$oLine->addXY($aPuntos[2], $aPuntos[3]);
        $nPoints = count($aPuntos);
          for ( $i=0; $i<$nPoints; $i++ )
    	  {
            	if ( fmod( $i, 2 ) == 0 )
      			{
        			//$aX = $aPuntos[$i];
      			}
      			else
      			{
         			$j =  $i - 1;
                    //$aPuntos[$i];
                    $oLine->addXY($aPuntos[$j], $aPuntos[$i]);

      			}

    	  }
                    $oShp->add( $oLine );

		               $oLine->free();
                     $shpFile->addShape($oShp);
                     $aszPointProperties[2] =  $oShp->getLength();
                     $aszPointProperties[3] = $oShp->getArea();
                    dbase_add_record( $dbfFile, array_values( $aszPointProperties ) );
    }               $oShp->free();
     $shpFile->free();
    // close the dbf
    dbase_close( $dbfFile );

    // return success
    return true;

// end updatePolDBFRecord() function
}

?>