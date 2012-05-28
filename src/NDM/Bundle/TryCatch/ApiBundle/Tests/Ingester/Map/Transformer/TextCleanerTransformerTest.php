<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Map\Transformer;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer\TextCleanerTransformer;

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