<?php
namespace NDM\TryCatchBundle\Tests\Ingester\Map\Filter;

use NDM\TryCatchBundle\Ingester\Map\Filter\FloatFilter;

class FloatFilterTest extends FilterTest {

	public function provideFilterData() {
		$coll = new FloatFilter();

		return array(
			array($coll, '1.0', 1.0),
			array($coll, 'foo bar', 0.0)
		);
	}
}