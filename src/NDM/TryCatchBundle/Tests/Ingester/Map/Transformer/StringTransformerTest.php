<?php
namespace NDM\TryCatchBundle\Tests\Ingester\Map\Transformer;

use NDM\TryCatchBundle\Ingester\Map\Transformer\StringTransformer;

class StringTransformerTest extends TransformerTest {

	public function provideTransformerData() {
		$coll = new StringTransformer();

		return array(
			array($coll, 1, '1'),
			array($coll, array('a' => 'b'), 'Array')
		);
	}
}