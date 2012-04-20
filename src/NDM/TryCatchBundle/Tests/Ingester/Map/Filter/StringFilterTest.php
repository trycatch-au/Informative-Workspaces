<?php
namespace NDM\TryCatchBundle\Tests\Ingester\Map\Filter;

use NDM\TryCatchBundle\Ingester\Map\Filter\StringFilter;

class StringFilterTest extends FilterTest {

	public function provideFilterData() {
		$coll = new StringFilter();

		return array(
			array($coll, 1, '1'),
			array($coll, array('a' => 'b'), 'Array')
		);
	}
}