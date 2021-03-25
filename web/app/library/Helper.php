<?php

class Helper {
    public static function cdn( $path, $server = null ) {
        return $_ENV['GW2T_ASSETS'] . '/gw2treasures/' . $path;
    }

    public static function webp( $url, $fallback, $width, $height, $alt = "" ) {
        $out  = '<picture alt="'.$alt.'" width="' . $width . '" height="' . $height . '">';
        $out .= '<source type="image/webp" srcset="'.$url.'" />';
        $out .= '<img src="'.$fallback.'" width="' . $width . '" height="' . $height . '" alt="'.$alt.'" />';
        $out .= '</picture>';
        return $out;
    }

    public static function duration( $ms, $baseUnit = 'ms' ) {
        $units      = array( 'ms',   's',  'm',  'h', 'd' );
        $conversion = array( '1000', '60', '60', '24');
        if( $baseUnit != $units[0] ) {
            $index = array_search( $baseUnit, $units );
            if( $index === false ) {
                return $ms . $baseUnit; 
            }
            for ($i = $index; $i > 0 ; $i--) {
                $ms *= $conversion[ $i - 1 ];
            }
        }
        $i = 0;
        while( $i < count( $units ) - 1 && $ms >= $conversion[ $i ] ) {
            $ms /= $conversion[ $i++ ];
        }
        return $ms . $units[ $i ];
    }

    public static function cacheBustingSuffix() {
        if(!App::environment('production') || !Config::has('app.cacheBusting')) {
            return '';
        }

        return '?v='.Config::get('app.cacheBusting');
    }

    /* 
      determine which language out of an available set the user prefers most 
      
      $available_languages        array with language-tag-strings (must be lowercase) that are available 
      $http_accept_language    a HTTP_ACCEPT_LANGUAGE string (read from $_SERVER['HTTP_ACCEPT_LANGUAGE'] if left out) 
    */ 
    public static function prefered_language ($available_languages,$http_accept_language="auto") { 
        // if $http_accept_language was left out, read it from the HTTP-Header 
        if ($http_accept_language == "auto") $http_accept_language = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : ''; 

        // standard  for HTTP_ACCEPT_LANGUAGE is defined under 
        // http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4 
        // pattern to find is therefore something like this: 
        //    1#( language-range [ ";" "q" "=" qvalue ] ) 
        // where: 
        //    language-range  = ( ( 1*8ALPHA *( "-" 1*8ALPHA ) ) | "*" ) 
        //    qvalue         = ( "0" [ "." 0*3DIGIT ] ) 
        //            | ( "1" [ "." 0*3("0") ] ) 
        preg_match_all("/([[:alpha:]]{1,8})(-([[:alpha:]|-]{1,8}))?" . 
                       "(\s*;\s*q\s*=\s*(1\.0{0,3}|0\.\d{0,3}))?\s*(,|$)/i", 
                       $http_accept_language, $hits, PREG_SET_ORDER); 

        // default language (in case of no hits) is the first in the array 
        $bestlang = $available_languages[0]; 
        $bestqval = 0; 

        foreach ($hits as $arr) { 
            // read data from the array of this hit 
            $langprefix = strtolower ($arr[1]); 
            if (!empty($arr[3])) { 
                $langrange = strtolower ($arr[3]); 
                $language = $langprefix . "-" . $langrange; 
            } 
            else $language = $langprefix; 
            $qvalue = 1.0; 
            if (!empty($arr[5])) $qvalue = floatval($arr[5]); 
          
            // find q-maximal language  
            if (in_array($language,$available_languages) && ($qvalue > $bestqval)) { 
                $bestlang = $language; 
                $bestqval = $qvalue; 
            } 
            // if no direct hit, try the prefix only but decrease q-value by 10% (as http_negotiate_language does) 
            else if (in_array($langprefix,$available_languages) && (($qvalue*0.9) > $bestqval)) { 
                $bestlang = $langprefix; 
                $bestqval = $qvalue*0.9; 
            } 
        } 
        return $bestlang; 
    }

    public static function collect($collection) {
        if($collection instanceof \Illuminate\Support\Collection) {
            return $collection;
        }

        return new \Illuminate\Support\Collection($collection);
    }

    public static function compareByName($a, $b) {
        return strnatcmp($a->getName(), $b->getName());
    }

    public static function sortByName() {
        return function($a, $b) {
            return Helper::compareByName($a, $b);
        };
    }

    public static function parseIconUrl($url) {
        preg_match('/\/(?<signature>[^\/]*)\/(?<file_id>[^\/]*)\.png$/', $url, $icon);

        return (object)[
            'signature' => $icon['signature'],
            'file_id' => $icon['file_id'],
        ];
    }

    public static function getIcon($icon) {
        if(is_string($icon)) {
            return Helper::parseIconUrl($icon);
        }

        if(isset($icon->signature) && isset($icon->file_id)) {
            return $icon;
        }

        return null;
    }
}
