<?php

use GW2Treasures\GW2Tools\Chatlinks\ItemChatlink;
use GW2Treasures\GW2Tools\Chatlinks\RecipeChatlink;
use GW2Treasures\GW2Tools\Chatlinks\SkinChatlink;

class ItemController extends BaseController {
    /** @var \Illuminate\View\View|stdClass $layout  */
    protected $layout = 'layout';


    public function showDetails( $language, Item $item ) {
        $this->layout->title = $item->getName();
        $this->layout->fullWidth = true;

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
        $this->layout->canonical = $item->getUrl();

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
}
