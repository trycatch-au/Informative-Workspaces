<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Map\Transformer;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer\CollectionTransformer;

class CollectionTransformerTest extends TransformerTest {

	public function provideTransformerData() {
		$coll = new CollectionTransformer();

		return array(
			array($coll, 'a|b', array('a', 'b')),
			array($coll, 'a', array('a')),
			array($coll, 'foo\|bar|foo|bar', array('foo|bar', 'foo', 'bar'))
		);
	}
}