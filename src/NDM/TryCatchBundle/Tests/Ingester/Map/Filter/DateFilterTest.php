<?php
namespace NDM\TryCatchBundle\Tests\Ingester\Map\Filter;

use NDM\TryCatchBundle\Ingester\Map\Filter\DateFilter;

class DateFilterTest extends FilterTest {

	public function provideFilterData() {
		$coll = new DateFilter();

		return array(
			array($coll, '2012-04-02 00:00:00', new \DateTime('2012-04-02 00:00:00')),
			array($coll, '15th aug 2012', new \DateTime('15-8-2012'))
		);
	}

	protected function makeAssertion($filter, $input, $entity, $record, $colMock, $expected) {
		$this->assertSame($expected->format('Y-m-d h:i:a'), $filter->filter($input, $entity, $record, $colMock)->format('Y-m-d h:i:a'));
	}
}