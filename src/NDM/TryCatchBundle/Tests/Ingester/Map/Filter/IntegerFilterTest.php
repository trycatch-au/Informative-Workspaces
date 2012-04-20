<?php
namespace NDM\TryCatchBundle\Tests\Ingester\Map\Filter;

use NDM\TryCatchBundle\Ingester\Map\Filter\IntegerFilter;

class IntegerFilterTest extends FilterTest {

	public function provideFilterData() {
		$coll = new IntegerFilter();

		return array(
			array($coll, '1', 1),
			array($coll, 'foo bar', 0)
		);
	}
}