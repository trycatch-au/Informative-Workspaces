<?php
namespace NDM\TryCatchBundle\Tests\Ingester\Map\Transformer;

use NDM\TryCatchBundle\Ingester\Map\Transformer\IntegerTransformer;

class IntegerTransformerTest extends TransformerTest {

	public function provideTransformerData() {
		$coll = new IntegerTransformer();

		return array(
			array($coll, '1', 1),
			array($coll, 'foo bar', 0)
		);
	}
}