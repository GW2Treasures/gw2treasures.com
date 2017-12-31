<?php

use Carbon\Carbon;

class SitemapController extends BaseController {
    private static $pageSize = 25000;

    private $sitemaps = [];

    public function __construct() {
        $this->add('items', DB::table('items')->select(['id', 'update_time']), [$this, 'renderItem']);
        $this->add('skins', Skin::select('id'), [$this, 'renderSkin']);

        $this->addSimple('achievements', 'achievement', Achievement::select(['id', 'updated_at']));
        $this->addSimple('skills', 'skill', Skill::select(['id', 'updated_at']));
        $this->addSimple('professions', 'profession', Profession::select(['id', 'updated_at']));
        $this->addSimple('traits', 'trait', Traits::select(['id', 'updated_at']));
        $this->addSimple('specializations', 'specialization', Specialization::select(['id', 'updated_at']));
        $this->addSimple('worlds', 'wvw/world', World::select(['id']));
    }

    protected function add($name, $query, callable $render) {
        $this->sitemaps[$name] = (object)[
            'name' => $name,
            'query' => $query,
            'render' => $render
        ];
    }

    protected function addSimple($name, $urlPrefix, $query) {
        $this->add($name, $query, function(BaseModel $model) use ($urlPrefix) {
            return (isset($model->updated_at) ? [
                'lastmod' => $model->updated_at->format('c')
            ] : []) + $this->urls($urlPrefix.'/'.$model->id);
        });
    }

    protected function renderItem($item) {
        return [
            'lastmod' => date('c', $item->update_time)
        ] + $this->urls('item/'.$item->id);
    }

    protected function renderSkin(Skin $skin) {
        return $this->urls('skin/'.$skin->id);
    }

    protected function url($url, $lang) {
        $urlPrefix = Request::isSecure()
            ? 'https://'
            : 'http://';

        $domain = Config::get('app.domain').'/';

        $url = ltrim($url, '/');

        if($lang === 'x-default') {
            return $urlPrefix.$domain.$url;
        }

        return $urlPrefix.$lang.'.'.$domain.$url;
    }

    protected function urls($url) {
        $urls = [];
        $currentLang = App::getLocale();

        foreach(['x-default', 'de', 'en', 'es', 'fr'] as $lang) {
            if($lang !== $currentLang) {
                $urls['xhtml:link rel="alternate" hreflang="'.$lang.'" href="'.$this->url($url, $lang).'"'] = null;
            } else {
                $urls['loc'] = $this->url($url, $lang);
            }
        }

        return $urls;
    }

    protected function sitemapIndex() {
        $all = [];

        foreach($this->sitemaps as $sitemap) {
            $all = array_merge($all, $this->sitemapPages($sitemap));
        }

        return $all;
    }

    protected function sitemapPages($sitemap) {
        $pages = [];
        $pageCount = $sitemap->query->count() / self::$pageSize;

        for($page = 0; $page < $pageCount; $page++) {
            $pages[] = route('sitemap', [App::getLocale(), $sitemap->name, $page]);
        }

        return $pages;
    }

    protected function renderSitemapIndex($pages) {
        return $this->streamXml(function() use ($pages) {
            echo '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

            foreach($pages as $page) {
                echo '<sitemap><loc>'.$page.'</loc></sitemap>';
            }

            echo '</sitemapindex>';
        });
    }

    protected function renderUrlSet($sitemap, $page) {
        if(!is_numeric($page)) {
            return $this->renderError(400, 'Invalid page.');
        }

        $pageCount = floor($sitemap->query->count() / self::$pageSize);
        if($page < 0 || $page > $pageCount) {
            return $this->renderError(400, "Page out of range (0-$pageCount).");
        }

        return $this->streamXml(function() use ($sitemap, $page) {
            $entries = $sitemap->query->skip($page * self::$pageSize)->take(self::$pageSize)->get();

            echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
            echo '<!--'.count($entries).' '.$sitemap->name.'-->';


            foreach($entries as $entry) {
                $data = call_user_func($sitemap->render, $entry);

                echo '<url>';
                foreach($data as $k => $v) {
                    if(is_null($v)) {
                        echo "<$k/>";
                    } else {
                        $v = htmlspecialchars($v, ENT_XML1);
                        echo "<$k>$v</$k>";
                    }
                }
                echo '</url>';
            }

            echo '</urlset>';
        });
    }

    protected function renderError($status, $message, $extra = []) {
        return $this->streamXml(function() use ($status, $message, $extra) {
            echo '<error>';

            foreach(['status' => $status, 'message' => $message] + $extra as $k => $v) {
                $v = htmlspecialchars($v, ENT_XML1);
                echo "<$k>$v</$k>";
            }

            echo '</error>';
        }, $status);
    }

    protected function streamXml(callable $callback, $status = 200, $extraHeader = []) {
        return Response::stream(function() use ($callback) {
            echo '<?xml version="1.0" encoding="UTF-8"?>';
            $callback();
        }, $status, ['Content-Type' =>  'application/xml; charset=utf8'] + $extraHeader);
    }

    public function getIndex($language, $sitemap = null, $page = null) {
        if(is_null($sitemap) && is_null($page)) {
            return $this->renderSitemapIndex($this->sitemapIndex());
        } elseif(!is_null($sitemap)) {
            if(!array_key_exists($sitemap, $this->sitemaps)) {
                return $this->renderError(404, 'Not found');
            }

            if(is_null($page)) {
                return $this->renderSitemapIndex($this->sitemapPages($this->sitemaps[$sitemap]));
            }

            return $this->renderUrlSet($this->sitemaps[$sitemap], $page);
        }

        return $this->renderError(400, 'Bad request.');
    }
}
