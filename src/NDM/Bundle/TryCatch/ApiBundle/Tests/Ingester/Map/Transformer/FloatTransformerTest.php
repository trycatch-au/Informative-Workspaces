<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Map\Transformer;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer\FloatTransformer;

class FloatTransformerTest extends TransformerTest {

	public function provideTransformerData() {
		$coll = new FloatTransformer();

		return array(
			array($coll, '1.0', 1.0),
			array($coll, 'foo bar', 0.0)
		);
	}
}