<?php

class ItemController extends BaseController {
    /** @var \Illuminate\View\View|stdClass $layout  */
    protected $layout = 'layout';


    public function showDetails( $language, Item $item ) {
        $this->layout->title = $item->getName();

        $key = CacheHelper::ItemDetails( $item, $language );

        if( Cache::has( $key ) && !isset($_GET[ 'nocache' ]) ) {
            $this->layout->content = Cache::get( $key );
            $this->layout->cached = true;
        } else {
            $content = View::make( 'item.details', array( 'item' => $item ) )->render();
            $this->layout->content = $content;

            Cache::forever( $key, $content );
        }

        if( isset($item->getTypeData()->type) ) {
            $type = trans( 'item.type.' . $item->type ) . ' (' .
                    trans( 'item.subtype.' . $item->type . '.' . $item->getTypeData()->type ) . ')';
        } elseif( $item->sub_type != '' ) {
            $type = trans( 'item.type.' . $item->type ) . ' (' .
                    trans( 'item.subtype.' . $item->type . '.' . $item->subtype ) . ')';
        } else {
            $type = trans( 'item.type.' . $item->type );
        }

        $this->layout->metaTitle = $item->getName();
        $this->layout->metaImage = 'https:' . $item->getIconUrl(64);
        $this->layout->metaDescription = trans( 'item.rarity.' . $item->rarity ) . ' ' . $type;

        DB::table('item_views')->insert(array(
            'item_id' => $item->id,
            'language' => $language,
        ));
    }
    public function json( $language, Item $item ) {
        return Response::json( $item->getData() );
    }

    public function random( $language ) {
        $id = Item::random()->first()->id;
        return Redirect::route( 'itemdetails', array( $language, $id ));
    }

    public function tooltip( $language, Item $item ) {
        return $item->getTooltip( $language );
    }

    public function search( $language ) {
        $searchTerm = trim( Input::get('q') );
        $items = array();

        if( strlen( $searchTerm ) > 0 ) {
            // item id
            if( preg_match('/^[0-9]+$/', $searchTerm ) ) {
                $item = Item::find( intval( $searchTerm ) );
                if( !is_null( $item ) ) {
                    return Redirect::route( 'itemdetails', array( $language, $searchTerm ));
                }
            }

            // chatlink
            if(( $chatlink = Chatlink::TryDecode( $searchTerm )) !== false ) {
                switch( $chatlink->type ) {
                    case Chatlink::TYPE_ITEM:
                        return Redirect::route( 'itemdetails', array( $language, $chatlink->id ));
                    case Chatlink::TYPE_RECIPE:
                        $recipe = Recipe::find( $chatlink->id );
                        return Redirect::route( 'itemdetails', array( $language, $recipe->output_id ));
                }
            }

            $items = Item::search( $searchTerm )->take( 1000 )->get();
            if( $items->count() == 0 ) {
                $items = Item::search( $searchTerm, true )->take( 1000 )->get();
            }
            $items = Item::sortSearchResult( $items , $searchTerm );
        }

        $this->layout->content = View::make( 'item.searchresults', array(
            'items' => $items, 'searchterm' => $searchTerm ));
        $this->layout->title = 'searchresults';
    }

    public function searchAutocomplete( $language ) {
        $searchTerm = trim( Input::get('q') );

        if(( $chatlink = Chatlink::TryDecode( $searchTerm )) !== false ) {
            switch( $chatlink->type ) {
                case Chatlink::TYPE_ITEM:
                    $items = array( Item::find( $chatlink->id ));
                    break;
                case Chatlink::TYPE_RECIPE:
                    $recipe = Recipe::find( $chatlink->id );
                    $items = array( Item::find( $recipe->output_id ));
                    break;
            }
        } else {
            $items = Item::search( $searchTerm )->take( 10 )->get();
        }

        $response = new stdClass();
        $response->items = array();

        foreach ( $items as $item ) {
            if( is_null($item) ) {
                continue;
            }
            $i = new stdClass();
            $i->id = $item->id;
            $i->name = $item->getName();
            $i->icon16 = Helper::cdn( 'icons/' . $item->signature . '/' . $item->file_id . '-16px.png', $item->file_id );
            $i->icon32 = Helper::cdn( 'icons/' . $item->signature . '/' . $item->file_id . '-32px.png', $item->file_id );
            $i->icon64 = Helper::cdn( 'icons/' . $item->signature . '/' . $item->file_id . '-64px.png', $item->file_id );
            $response->items[] = $i;
        }

        return Response::json( $response );
    }
}
