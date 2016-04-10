<?php

use GW2Treasures\GW2Tools\Chatlinks\SkinChatlink;

class Skin extends BaseModel {
	use HasLocalizedData, HasIcon, HasLink;

	public function getName( $lang = null ) {
		return $this->localized( 'name', $lang );
	}

	public function getTypeData( $lang = null ) {
		$type = strtolower( $this->type );
        if( isset( $this->getData( $lang )->details )) {
            return $this->getData( $lang )->details;
        } elseif( isset( $this->getData( $lang )->{$type} )) {
			return $this->getData( $lang )->{$type};
		} else {
            return new stdClass();
        }
	}

	public function getIconUrl($size = 64) {
		return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
	}

	protected function getAdditionalLinkAttributes(array $defaults = []) {
		$attributes = [ 'data-skin-id' => $this->id ];

		if(isset($this->getData()->rarity)) {
			$attributes['class'] = $defaults['class'].' border-'.$this->getData()->rarity;
		}

		return $attributes;
	}

	public function getUrl( $lang = null ) {
		if( is_null( $lang ) ) {
			$lang = App::getLocale();
		}
		return URL::route( 'skin.details', array( 'language' => $lang, 'skin' => $this->id ) );
	}

	public function getChatLink() {
		return (new SkinChatlink($this->id))->encode();
	}

	public function items() {
		return $this->hasMany( 'Item', 'skin_id' );
	}
}
