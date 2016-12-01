<?php
use GW2Treasures\GW2Tools\Chatlinks\ItemChatlink;
use GW2Treasures\GW2Tools\Common\ItemStack;

/**
 * Class Item
 *
 * @property-read \Illuminate\Database\Eloquent\Collection|\Recipe[] $recipes
 * @property-read \Recipe                                            $unlocks
 * @property-read \Skin                                              $unlocksSkin
 * @method static \Item hasUpgrade($item)
 * @method static \Item search($term, $or = false)
 * @method static \BaseModel random($count = 1)
 * @property integer                                                 $id
 * @property string                                                  $signature
 * @property integer                                                 $file_id
 * @property string                                                  $rarity
 * @property string                                                  $weight
 * @property string                                                  $type
 * @property string                                                  $subtype
 * @property string                                                  $unlock_type
 * @property integer                                                 $level
 * @property integer                                                 $value
 * @property boolean                                                 $pvp
 * @property string                                                  $attr1
 * @property string                                                  $attr2
 * @property string                                                  $attr3
 * @property string                                                  $attr_name
 * @property integer                                                 $unlock_id
 * @property integer                                                 $suffix_item_id
 * @property integer                                                 $secondary_suffix_item_id
 * @property integer                                                 $skin_id
 * @property string                                                  $name_de
 * @property string                                                  $name_en
 * @property string                                                  $name_es
 * @property string                                                  $name_fr
 * @property string                                                  $desc_de
 * @property string                                                  $desc_en
 * @property string                                                  $desc_es
 * @property string                                                  $desc_fr
 * @property string                                                  $data_de
 * @property string                                                  $data_en
 * @property string                                                  $data_es
 * @property string                                                  $data_fr
 * @property integer                                                 $wikipage_de
 * @property integer                                                 $wikipage_en
 * @property integer                                                 $wikipage_es
 * @property integer                                                 $wikipage_fr
 * @property boolean                                                 $wiki_de
 * @property boolean                                                 $wiki_en
 * @property boolean                                                 $wiki_es
 * @property boolean                                                 $wiki_fr
 * @property boolean                                                 $wiki_checked
 * @property boolean                                                 $updated
 * @property integer                                                 $update_time
 * @property string                                                  $date_added
 * @method static \Illuminate\Database\Query\Builder|\Item whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereSignature($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereFileId($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereRarity($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereWeight($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereType($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereSubtype($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereUnlockType($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereLevel($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereValue($value)
 * @method static \Illuminate\Database\Query\Builder|\Item wherePvp($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereAttr1($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereAttr2($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereAttr3($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereAttrName($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereUnlockId($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereSuffixItemId($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereSecondarySuffixItemId($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereSkinId($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereNameDe($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereNameEn($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereNameEs($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereNameFr($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereDescDe($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereDescEn($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereDescEs($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereDescFr($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereDataDe($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereDataEn($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereDataEs($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereDataFr($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereWikipageDe($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereWikipageEn($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereWikipageEs($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereWikipageFr($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereWikiDe($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereWikiEn($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereWikiEs($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereWikiFr($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereWikiChecked($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereUpdated($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereUpdateTime($value)
 * @method static \Illuminate\Database\Query\Builder|\Item whereDateAdded($value)
 */
class Item extends BaseModel {
    use HasLocalizedData, HasIcon, HasLink;

    /**
     * Gets the name of the item
     *
     * @param null|string $lang
     * @return string
     */
    public function getName( $lang = null ) {
        $name = $this->localized( 'name', $lang );
        if( $this->isPvP() && !preg_match('/\bPvP\b/i', $name )) {
            $name = trans( 'item.pvp' ) . ' ' . $name;
        }
        return $name;
    }

    /**
     * Gets the localized description
     *
     * @param null|string $lang
     * @return mixed|string
     */
    public function getDescription( $lang = null ) {
        if( !isset($this->getData( $lang )->description) ) {
            return '';
        }

        return $this->formatForDisplay($this->getData( $lang )->description);
    }

    protected function formatForDisplay($subject) {
        $replacements = [
            '/<c=@([^>]+)>(.*?)<\/?c>/s' => '<span class="color-format-$1">$2</span>',
            '/<c=#([^>]+)>(.*?)<\/?c>/s' => '<span class="color-format" style="color:#$1">$2</span>',
            '/\n/' => '<br>'
        ];
        return preg_replace(array_keys($replacements), array_values($replacements), $subject);
    }

    protected function normalizeRawData($data) {
        return $data;
    }

    /**
     * Gets localied details
     *
     * @param null $lang
     * @return stdClass
     */
    public function getTypeData( $lang = null ) {
        switch( $this->type ) {
            case 'CraftingMaterial':
                $t = 'crafting_material';
                break;
            case 'MiniPet':
                $t = 'mini_pet';
                break;
            case 'UpgradeComponent':
                $t = 'upgrade_component';
                break;
            default:
                $t = strtolower( $this->type );
                break;
        }
        if( isset($this->getData( $lang )->{$t}) ) {
            return $this->getData( $lang )->{$t};
        }

        return new stdClass();
    }

    /**
     * Gets flags
     *
     * @return mixed
     */
    public function getFlags() { return $this->getData()->flags; }

    /**
     * Checks if specific flag is set
     *
     * @param string $flag
     * @return bool
     */
    public function hasFlag( $flag ) { return in_array( $flag, $this->getFlags() ); }

    /**
     * Checks if the item is only available in pvp (Pvp|PvpLobby)
     *
     * @return bool
     */
    public function isPvP() {
        return isset($this->getData()->game_types) && $this->getData()->game_types == array( 'Pvp', 'PvpLobby' );
    }

    /** @var Item|null cache for suffix item */
    private $si;
    /** @var Item|null cache for secondary suffix item */
    private $si2;

    /**
     * @return static|null
     */
    public function getSuffixItem() {
        return isset($this->si) ? $this->si : ($this->si = Item::find( $this->getTypeData()->suffix_item_id ));
    }

    /**
     * @return static|null
     */
    public function getSecondarySuffixItem() {
        return isset($this->si2) ? $this->si2
            : ($this->si2 = Item::find( $this->getTypeData()->secondary_suffix_item_id ));
    }

    /**
     * Gets localized url to the item detail page (route itemdetails)
     *
     * @param string|null $lang
     * @return string
     */
    public function getUrl( $lang = null ) {
        if( is_null( $lang ) ) {
            $lang = App::getLocale();
        }
        return URL::route( 'itemdetails', array( 'language' => $lang, 'item' => $this->id ) );
    }

    protected function getAdditionalLinkAttributes(array $defaults = []) {
        return ['data-item-id' => $this->id, 'class' => $defaults['class'] . ' border-'.$this->rarity];
    }

    /**
     * Gets the url to the icon on the cdn.
     *
     * @param int $size Minimum size of the icon
     * @return string
     */
    public function getIconUrl( $size = 64 ) {
        if( $this->file_id == 960304 ) {
            if( !is_null( $this->unlocksSkin )) {
                return $this->unlocksSkin->getIconUrl($size);
            } elseif( isset( $this->getData()->default_skin )) {
                $skin = Skin::find($this->getData()->default_skin);

                if( !is_null( $skin ) && $skin->exists ) {
                    return $skin->getIconUrl( $size );
                }
            }
        }

        return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
    }

    /**
     * Gets the chatlink of the item.
     *
     * @return string
     * @throws Exception
     */
    public function getChatLink() {
        return (new ItemChatlink(ItemStack::fromArray(['id' => $this->id])))->encode();
    }

    //---- Relations

    /**
     * Gets recipes that craft this item
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function recipes() {
        return $this->hasMany( 'Recipe', 'output_id' );
    }

    /**
     * Gets recipes that are unlocked by this item
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function unlocks() {
        return $this->belongsTo( 'Recipe', 'unlock_id', 'recipe_id' );
    }

    /**
     * Gets recipes that use this item as recipe
     *
     * @return mixed
     */
    public function ingredientForRecipes() {
        return Recipe::hasIngredient( $this )->withAll();
    }

    /**
     * Gets unlocked skin
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function unlocksSkin() {
        return $this->belongsTo( 'Skin', 'skin_id', 'id' );
    }

    /**
     * Searches for items matching the query
     *
     * @param \Illuminate\Database\Query\Builder $query
     * @param string                             $term    The search term to search for
     * @param bool                               $or      Return items that match any of the parts of the search term
     *                                                    instead of matching all
     * @return \Illuminate\Database\Query\Builder
     */
    public static function searchQuery( $query, $term, $or = false ) {
        $term = mb_strtoupper( trim( $term ) );

        preg_match_all( '/\S+/', $term, $matches, PREG_SET_ORDER );

        $query->where( function ( $query ) use ( $matches, $or ) {
            /** @var \Illuminate\Database\Query\Builder $query */
            foreach( $matches as $match ) {
                $match = $match[ 0 ];

                if( $or ) {
                    $query->orWhereRaw( 'UPPER(name_de) LIKE ?', array( '%' . $match . '%' ) )
                          ->orWhereRaw( 'UPPER(name_en) LIKE ?', array( '%' . $match . '%' ) )
                          ->orWhereRaw( 'UPPER(name_es) LIKE ?', array( '%' . $match . '%' ) )
                          ->orWhereRaw( 'UPPER(name_fr) LIKE ?', array( '%' . $match . '%' ) );
                } else {
                    $query->where( function ( $query ) use ( $match ) {
                        /** @var \Illuminate\Database\Query\Builder $query */
                        $query->whereRaw( 'UPPER(name_de) LIKE ?', array( '%' . $match . '%' ) )
                              ->orWhereRaw( 'UPPER(name_en) LIKE ?', array( '%' . $match . '%' ) )
                              ->orWhereRaw( 'UPPER(name_es) LIKE ?', array( '%' . $match . '%' ) )
                              ->orWhereRaw( 'UPPER(name_fr) LIKE ?', array( '%' . $match . '%' ) );
                    });
                }
            }
        } );

        $query->where( 'data_en', '!=', '' );

        return $query;
    }

    /**
     * Gets items that use $item as upgrade
     *
     * @param \Illuminate\Database\Query\Builder $query
     * @param Item                               $item
     * @return mixed
     */
    public function scopeHasUpgrade( $query, Item $item ) {
        return $query->where( 'suffix_item_id', '=', $item->id )
                     ->orWhere( 'secondary_suffix_item_id', '=', $item->id );
    }

    /**
     * All items that match the search term
     *
     * @param Illuminate\Database\Query\Builder $query
     * @param string                            $term     The search term to search for
     * @param bool                              $or       Return items that match any of the parts of the search term
     *                                                    instead of matching all
     * @return \Illuminate\Database\Query\Builder
     */
    public function scopeSearch( $query, $term, $or = false ) {
        return self::searchQuery( $query, $term, $or );
    }

    /**
     * Sorts the search results by best match
     *
     * @param \Illuminate\Database\Eloquent\Collection $collection
     * @param string                                   $searchterm
     * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection
     */
    public static function sortSearchResult( Illuminate\Database\Eloquent\Collection $collection, $searchterm ) {
        if( strlen( $searchterm ) < 3 ) {
            return $collection->sort( function ( Item $a, Item $b ) {
                return strcmp( $a->getName(), $b->getName() );
            });
        }

        $cache = array();

        $collection->sort( function ( Item $a, Item $b ) use ( $searchterm, &$cache ) {
            if( $a->getName() == $searchterm ) {
                return 1;
            }
            if( $b->getName() == $searchterm ) {
                return -1;
            }

            $parts = explode( ' ', $searchterm );

            $scoreA = isset($cache[ $a->id ])
                ? $cache[ $a->id ]
                : ($cache[ $a->id ] = round( $a->getScore( $parts ) ));
            $scoreB = isset($cache[ $b->id ])
                ? $cache[ $b->id ]
                : ($cache[ $b->id ] = round( $b->getScore( $parts ) ));

            if( $scoreA == $scoreB ) {
                return strcmp( $a->getName(), $b->getName() );
            }

            return $scoreB - $scoreA;
        } );
        return $collection;
    }

    /**
     * Scores an item based on given searchterm parts
     *
     * @param string[] $searchtermParts
     * @return int
     */
    public function getScore( $searchtermParts ) {
        $score = 0;

        foreach( array( 'de', 'en', 'es', 'fr' ) as $lang ) {
            $modifier = $lang == App::getLocale() ? 1 : 0.1;
            $name = mb_strtoupper( $this->getName( $lang ) );
            $nameParts = explode( ' ', $name );

            foreach( $searchtermParts as $part ) {
                $part = mb_strtoupper( $part );

                if( starts_with( $name, $part ) ) {
                    $score += 5 * $modifier;
                }

                foreach( $nameParts as $namePart ) {
                    if( $namePart == $part ) {
                        $score += 5 * $modifier;
                    } else {
                        if( starts_with( $namePart, $part ) ) {
                            $score += 3 * $modifier;
                        }
                    }
                }
            }
        }

        return $score;
    }

    /**
     * Gets items that are similar to the current item
     *
     * @return mixed
     */
    public function getSimilarItems() {
        $that = $this;
        return Item::where( 'id', '!=', $this->id )
                   ->where( 'data_en', '!=', '' )
                   ->where( function ( $query ) use ( $that ) {
                       /** @var \Illuminate\Database\Query\Builder $query */
                       return $query->where( 'name_de', '=', $that->getName( 'de' ) )
                                    ->orWhere( 'name_en', '=', $that->getName( 'en' ) )
                                    ->orWhere( 'name_es', '=', $that->getName( 'es' ) )
                                    ->orWhere( 'name_fr', '=', $that->getName( 'fr' ) )
                                    ->orWhere( function ( $q ) use ( $that ) {
                                        /** @var \Illuminate\Database\Query\Builder $q */
                                        return $q->where( 'signature', '=', $that->signature )
                                                 ->where( 'file_id', '=', $that->file_id );
                                    } )
                                    ->orWhere( function ( $q ) use ( $that ) {
                                        /** @var \Illuminate\Database\Query\Builder $q */
                                        return $q->where( 'skin_id', '!=', '0' )
                                                 ->where( 'skin_id', '=', $that->skin_id );
                                    } )
                                    ->orWhere( function ( $q ) use ( $that ) {
                                        /** @var \Illuminate\Database\Query\Builder $q */
                                        return $q->where( 'type', '=', $that->type )
                                                 ->where( 'subtype', '=', $that->subtype )
                                                 ->where( 'weight', '=', $that->weight )
                                                 ->where( 'rarity', '=', $that->rarity )
                                                 ->where( 'value', '=', $that->value )
                                                 ->where( 'level', '=', $that->level );
                                    } );
                   } )->orderBy('views', 'desc')->take( 250 )->get();
    }

    //----

    /**
     * Gets the (cached) localized tooltip
     *
     * @param string|null $lang
     * @return mixed|string
     */
    public function getTooltip( $lang = null ) {
        $lang = is_null( $lang ) ? App::getLocale() : $lang;
        $key = CacheHelper::ItemTooltip( $this, $lang );
        if( Cache::has( $key ) && !isset($_GET[ 'nocache' ]) ) {
            return Cache::get( $key );
        } else {
            $tooltip = View::make( 'item.tooltip', array( 'item' => $this ) )->render();
            $tooltip = str_replace( array( "\r", "\n", "\t" ), '', $tooltip );
            Cache::forever( $key, $tooltip );
            return $tooltip;
        }
    }

    /**
     * Gets the infix upgrade
     *
     * @param string|null $lang
     * @return stdClass|null
     */
    public function getInfixUpgrade( $lang = null ) {
        if( isset($this->getTypeData( $lang )->infix_upgrade) ) {
            return $this->getTypeData( $lang )->infix_upgrade;
        }
        return null;
    }

    /**
     * @return int[string]
     */
    public function getAttributes() {
        $attributes = $this->getInfixAttributes();
        foreach( $this->getBuffDescriptionAttributes($attributes) as $attribute => $modifier ) {
            if( array_key_exists( $attribute, $attributes ) ) {
                $attributes[ $attribute ] += $modifier;
            } else {
                $attributes[ $attribute ] = $modifier;
            }
        }
        return $attributes;
    }

    /**
     * Returns the attributes from infix_upgrade.attributes
     *
     * @return int[string]
     */
    public function getInfixAttributes() {
        $infixUpgrade = $this->getInfixUpgrade( 'en' );
        if( is_null( $infixUpgrade ) || !isset($infixUpgrade->attributes) ) {
            return array();
        }
        $attributes = array();
        foreach( $infixUpgrade->attributes as $attribute ) {
            $attribute->attribute = str_replace( 'CritDamage', 'Ferocity', $attribute->attribute );
            $attributes[ $attribute->attribute ] = $attribute->modifier;
        }
        return $attributes;
    }

    /**
     * Parses infix_upgrade.buff.description and returns the attributes
     *
     * @return int[]
     */
    public function getBuffDescriptionAttributes($baseAttributes) {
        $infixUpgrade = $this->getInfixUpgrade( 'en' );
        if( is_null( $infixUpgrade ) || !isset($infixUpgrade->buff) || !isset($infixUpgrade->buff->description) ) {
            return array();
        }

        $infixUpgradeLocalized = $this->getInfixUpgrade();

        $attributes = array();
        $buffs = explode( "\n", $infixUpgrade->buff->description );
        $buffsLocalized = explode( "\n", $infixUpgradeLocalized->buff->description );

        foreach( $buffs as $i => $buff ) {
            if( preg_match( '/^\+?([0-9]+)%? (\S+(\s\S+)?)$/', $buff, $matches ) ) {
                $modifier = $matches[ 1 ];
                $attribute = $matches[ 2 ];
                $modifier = intval(str_replace(['+', '%'], [' ', ' '], $modifier));
                $attribute = str_replace(
                    ['Critical Damage', 'Healing Power', 'condition duration.', ' '],
                    ['Ferocity',        'Healing',       'ConditionDuration',   ''],
                    $attribute
                );

                if(!array_key_exists($attribute, $baseAttributes)) {
                    $attributes[ $attribute ] = $modifier;
                }
            } else {
                $attributes[ ] = $this->formatForDisplay($buffsLocalized[$i]);
            }
        }

        return $attributes;
    }

    /**
     * Parses [type].description and returns the attributes
     *
     * @return int[string]
     */
    public function getConsumableAttributes( $lang = null ) {
        if( !isset($this->getTypeData( $lang )->description) ) {
            return array();
        }

        $description = $this->getTypeData( $lang )->description;
        $description = str_replace( chr( 194 ) . chr( 160 ), ' ', $description );

        $attributes = array();
        $buffs = explode( "\n", $description );

        foreach( $buffs as $i => $buff ) {
            if( preg_match( '/^(\+?-?[0-9]+%?) (.*)$/', $buff, $matches ) ) {
                $modifier = $matches[ 1 ];
                $attribute = $this->formatForDisplay($matches[ 2 ]);
                $modifier = str_replace( '-', '−', $modifier );
                $attributes[ $attribute ] = $modifier;
            } else {
                $attributes[ ] = $this->formatForDisplay($buff);
            }
        }

        return $attributes;
    }

    //----

    /**
     * @param $attribute
     * @return bool
     */
    public function getAttributeIsPercentual($attribute) {
        return in_array($attribute, [
            'AgonyResistance',
            'BoonDuration',
            'ConditionDuration',
            'StunDuration',
            'Damage',
            'CritChance',
            'CriticalChance'
        ]);
    }
}
