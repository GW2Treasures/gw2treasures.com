<?php

class SitemapController extends BaseController {
    private static $pageSize = 25000;

    public function getIndex($lang = null) {
        $content = '<?xml version="1.0" encoding="UTF-8"?>';
        $content .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        $pages = ceil(DB::table('items')->count() / self::$pageSize);
        for ($page=0; $page < $pages; $page++) {
            $url = action('SitemapController@getItems', compact('lang', 'page'));
            $content .= '<sitemap><loc>'.$url.'</loc></sitemap>';
        }

        $content .= '<sitemap><loc>'.action('SitemapController@getAchievements', compact('lang')).'</loc></sitemap>';

        $content .= '</sitemapindex>';

        $response = Response::make($content, 200);
        $response->header('Content-Type', 'application/xml; charset=utf8');
        return $response;
    }

    public function getItems( $lang = null, $page = 0 ) {
        $urlPrefix = Request::isSecure()
            ? 'https://'
            : 'http://';
        $urlBase = Config::get('app.domain') . '/item/';
        $pageSize = self::$pageSize;

        return Response::stream(function() use ( $urlPrefix, $urlBase, $lang, $page, $pageSize ) {
            echo '<?xml version="1.0" encoding="UTF-8"?>' .
                 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

            $items = DB::table('items')->select(['id', 'update_time'])->skip($page * $pageSize)->take($pageSize)->get();
            //$items->chunk(25000, function( $items ) use ( $urlPrefix, $urlBase, $lang ) {
                foreach( $items as $item ) {
                    $url = htmlspecialchars( $urlPrefix . $lang . '.' . $urlBase . $item->id, ENT_XML1 );
                    $lastmod = htmlspecialchars( date( 'c', $item->update_time ));
                    echo '<url>';
                    echo '<loc>' . $url . '</loc>';

                    echo '<xhtml:link rel="alternate" hreflang="x-default" href="' .
                         htmlspecialchars( $urlPrefix . $urlBase . $item->id, ENT_XML1 ) . '"/>';

                    foreach(['de', 'en', 'es', 'fr'] as $alternate ) {
                        if( $alternate !== $lang ) {
                            echo '<xhtml:link rel="alternate" hreflang="' . $alternate . '" href="' .
                                 htmlspecialchars( $urlPrefix . $alternate . '.' . $urlBase . $item->id, ENT_XML1 ) . '"/>';
                        }
                    }

                    echo '<lastmod>' . $lastmod . '</lastmod>';
                    echo '</url>';
                }
            //});

            echo '</urlset>';
            echo '<!-- ' . round(memory_get_usage() / 1024 / 1024, 2) . 'MB -->';
        }, 200, ['Content-Type' =>  'application/xml; charset=utf8']);
    }

    public function getAchievements($lang = null) {
        $urlPrefix = Request::isSecure()
            ? 'https://'
            : 'http://';
        $urlBase = Config::get('app.domain') . '/achievement/';

        return Response::stream(function() use ( $urlPrefix, $urlBase, $lang ) {
            echo '<?xml version="1.0" encoding="UTF-8"?>' .
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

            $achievements = Achievement::select(['id', 'updated_at'])->get();

            foreach($achievements as $achievement) {
                $url = htmlspecialchars( $urlPrefix . $lang . '.' . $urlBase . $achievement->id, ENT_XML1 );
                $lastmod = htmlspecialchars( $achievement->updated_at->format('c') );
                echo '<url>';
                echo '<loc>' . $url . '</loc>';

                echo '<xhtml:link rel="alternate" hreflang="x-default" href="' .
                    htmlspecialchars( $urlPrefix . $urlBase . $achievement->id, ENT_XML1 ) . '"/>';

                foreach(['de', 'en', 'es', 'fr'] as $alternate ) {
                    if( $alternate !== $lang ) {
                        echo '<xhtml:link rel="alternate" hreflang="' . $alternate . '" href="' .
                            htmlspecialchars( $urlPrefix . $alternate . '.' . $urlBase . $achievement->id, ENT_XML1 ) . '"/>';
                    }
                }

                echo '<lastmod>' . $lastmod . '</lastmod>';
                echo '</url>';
            }

            echo '</urlset>';
        }, 200, ['Content-Type' =>  'application/xml; charset=utf8']);
    }
}
