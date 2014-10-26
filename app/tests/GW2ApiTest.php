<?php

class GW2ApiTest extends TestCase {

	public function testGetItem() {
		$gw2api = new GW2Api();

		$item = $gw2api->getItem( 19721 );

		$this->assertEquals( 19721, $item['en']->id );
		$this->assertEquals( 'Glob of Ectoplasm', $item['en']->name );
		$this->assertEquals( 'Ektoplasmakugel', $item['de']->name );
	}

	public function testGetItems() {
		$gw2api = new GW2Api();

		$items = $gw2api->getItems( array( 46746, 49523, 'invalid' ) );

		$this->assertArrayHasKey( 49523, $items );
		$this->assertArrayHasKey( 'invalid', $items );
		$this->assertNull( $items[ 'invalid' ] );
		$this->assertEquals( 'Ascended', $items[49523]['en']->rarity );
	}

	public function testGetItemIds() {
		$gw2api = new GW2Api();

		$ids = $gw2api->getItemIds();

		$this->assertInternalType( 'array', $ids );
		$this->assertNotEmpty( $ids );
		$this->assertContains( 19721, $ids );
	}

	public function testGetItemsBatch() {
		$gw2api = new GW2Api();

		$ids = array_slice( $gw2api->getItemIds(), 0, 1000 );

		$processedItems = 0;

		$gw2api->getItemsBatch( $ids, function( array $items ) use ( &$processedItems ) {
			$processedItems += count( $items );
		});

		$this->assertEquals( count($ids), $processedItems );
	}
}
