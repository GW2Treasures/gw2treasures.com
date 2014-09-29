<?php

class ChatlinkTest extends TestCase {

	public function testDecode() {
		$testChatlinks = array(
			Chatlink::TYPE_ITEM => array(
				// simple
				'[&AgEAAAAA]' =>     0,
				'[&AgEJTQAA]' => 19721,
				'[&AgGatgAA]' => 46746,
				'[&AgHaBQEAAA==]' => 67034,
				'[&AgGHBgEAAA==]' => 67207,

				// complex
				'[&AgGqtgAA]'                 => 46762, //Weapon
				'[&AgGqtgBA/18AAA==]'         => 46762, //Weapon + Sigil 1
				'[&AgGqtgBg/18AACdgAAA=]'     => 46762, //Weapon + Sigil 1 + Sigil 2
				'[&AgGqtgCAfQ4AAA==]'         => 46762, //Weapon + Wardrobe Skin
				'[&AgGqtgDAfQ4AAP9fAAA=]'     => 46762, //Weapon + Wardrobe Skin + Sigil 1
				'[&AgGqtgDgfQ4AAP9fAAAnYAAA]' => 46762, //Weapon + Wardrobe Skin + Sigil 1 + Sigil 2
			), Chatlink::TYPE_RECIPE => array(
				'[&CgEAAAA=]' =>     1,
				'[&ClDDAAA=]' => 50000,
			)
		);

		foreach( $testChatlinks as $type => $chatlinks ) {
			foreach( $chatlinks as $chatlink => $id ) {
				$decoded = Chatlink::Decode( $chatlink );
				$this->assertEquals( $id, $decoded->id );
				$this->assertEquals( $type, $decoded->type );
			}
		}
	}

	public function testEncode() {
		$testChatlinks = array(
			Chatlink::TYPE_ITEM => array(
				'[&AgEAAAAA]' =>     0,
				'[&AgEJTQAA]' => 19721,
				'[&AgGatgAA]' => 46746,
				'[&AgHaBQEA]' => 67034,
				'[&AgGHBgEA]' => 67207,
				'[&AgEUBwEA]' => 67348,
			), Chatlink::TYPE_RECIPE => array(
				'[&CgEAAAA=]' =>     1,
				'[&ClDDAAA=]' => 50000,
			)
		);

		foreach( $testChatlinks as $type => $chatlinks ) {
			foreach( $chatlinks as $chatlink => $id ) {
				$encoded = Chatlink::Encode( $type, $id );

				$this->assertEquals( $type, $encoded->type );
				$this->assertEquals( $chatlink, $encoded->chatlink, 'Wrong chatlink for ' . $id );
			}
		}
	}
}