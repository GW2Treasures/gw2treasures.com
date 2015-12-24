<?php

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

	protected function getAdditionalLinkAttributes() {
		return ['data-skin-id' => $this->id];
	}

	public function getUrl( $lang = null ) {
		if( is_null( $lang ) ) {
			$lang = App::getLocale();
		}
		return URL::route( 'skin.details', array( 'language' => $lang, 'skin' => $this->id ) );
	}

	public function items() {
		return $this->hasMany( 'Item', 'skin_id' );
	}
}
