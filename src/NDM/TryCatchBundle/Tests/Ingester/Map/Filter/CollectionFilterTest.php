<?php
namespace NDM\TryCatchBundle\Tests\Ingester\Map\Filter;
use NDM\TryCatchBundle\Ingester\Map\Filter\CollectionFilter;

class CollectionFilterTest extends FilterTest {

	public function provideFilterData() {
		$coll = new CollectionFilter();

		return array(
			array($coll, 'a|b', array('a', 'b')),
			array($coll, 'a', array('a')),
			array($coll, 'foo\|bar|foo|bar', array('foo|bar', 'foo', 'bar'))
		);
	}
}