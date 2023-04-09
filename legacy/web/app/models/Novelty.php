<?php

/**
 * Novelty
 *
 * @property integer $id 
 * @property string $slot 
 * @property string $signature 
 * @property integer $file_id 
 * @property string $name_de 
 * @property string $name_en 
 * @property string $name_es 
 * @property string $name_fr 
 * @property string $description_de 
 * @property string $description_en 
 * @property string $description_es 
 * @property string $description_fr 
 * @property string $data_de 
 * @property string $data_en 
 * @property string $data_es 
 * @property string $data_fr 
 * @property \Carbon\Carbon $created_at 
 * @property \Carbon\Carbon $updated_at 
 * @property-read \Illuminate\Database\Eloquent\Collection|Item[] $unlockItems 
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereSlot($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereSignature($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereFileId($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereNameDe($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereNameEn($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereNameEs($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereNameFr($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereDescriptionDe($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereDescriptionEn($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereDescriptionEs($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereDescriptionFr($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereDataDe($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereDataEn($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereDataEs($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereDataFr($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Novelty whereUpdatedAt($value)
 * @method static \BaseModel random($count = 1)
 */
class Novelty extends BaseModel {
	use HasLocalizedData, HasIcon, HasLink;

	public function unlockItems() {
	    return $this->belongsToMany(Item::class, 'novelty_unlock_items', 'novelty_id', 'item_id');
    }

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

	public function getDescription($lang = null) {
	    return $this->formatForDisplay($this->localized('description', $lang));
    }

    public function getIconUrl($size = 64) {
        return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
    }

    public function getUrl($lang = null) {
        if(is_null($lang)) {
            $lang = App::getLocale();
        }

        return route('novelty.details', ['language' => $lang, 'novelty' => $this->id]);
    }
}
