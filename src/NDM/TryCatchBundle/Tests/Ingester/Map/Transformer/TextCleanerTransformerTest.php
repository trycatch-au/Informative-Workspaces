<?php
namespace NDM\TryCatchBundle\Tests\Ingester\Map\Transformer;

use NDM\TryCatchBundle\Ingester\Map\Transformer\TextCleanerTransformer;

class TextCleanerTransformerTest extends TransformerTest {

	public function provideTransformerData() {
		$coll = new TextCleanerTransformer();

		return array(
			array($coll, 'foo bar ', 'foo bar'),
			array($coll, ' foo bar', 'foo bar'),
			array($coll, ' foo    bar', 'foo bar'),
			array($coll, 'foo bar', 'foo bar')
		);
	}
}