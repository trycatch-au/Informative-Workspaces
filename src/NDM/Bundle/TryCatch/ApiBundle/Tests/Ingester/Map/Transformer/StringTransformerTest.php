<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Map\Transformer;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer\StringTransformer;

class StringTransformerTest extends TransformerTest {

	public function provideTransformerData() {
		$coll = new StringTransformer();

		return array(
			array($coll, 1, '1'),
			array($coll, array('a' => 'b'), 'Array')
		);
	}
}