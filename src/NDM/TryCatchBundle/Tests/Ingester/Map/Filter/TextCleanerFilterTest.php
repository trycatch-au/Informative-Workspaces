<?php
namespace NDM\TryCatchBundle\Tests\Ingester\Map\Filter;

use NDM\TryCatchBundle\Ingester\Map\Filter\TextCleanerFilter;

class TextCleanerFilterTest extends FilterTest {

	public function provideFilterData() {
		$coll = new TextCleanerFilter();

		return array(
			array($coll, 'foo bar ', 'foo bar'),
			array($coll, ' foo bar', 'foo bar'),
			array($coll, ' foo    bar', 'foo bar'),
			array($coll, 'foo bar', 'foo bar')
		);
	}
}