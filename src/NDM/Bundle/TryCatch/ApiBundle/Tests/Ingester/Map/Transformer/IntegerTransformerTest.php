<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Map\Transformer;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer\IntegerTransformer;

class IntegerTransformerTest extends TransformerTest {

	public function provideTransformerData() {
		$coll = new IntegerTransformer();

		return array(
			array($coll, '1', 1),
			array($coll, 'foo bar', 0)
		);
	}
}