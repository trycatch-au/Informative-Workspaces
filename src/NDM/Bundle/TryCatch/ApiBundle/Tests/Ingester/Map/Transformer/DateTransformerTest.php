<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Map\Transformer;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer\DateTransformer;

class DateTransformerTest extends TransformerTest {

	public function provideTransformerData() {
		$coll = new DateTransformer();

		return array(
			array($coll, '2012-04-02 00:00:00', new \DateTime('2012-04-02 00:00:00')),
			array($coll, '15th aug 2012', new \DateTime('15-8-2012'))
		);
	}

	protected function makeAssertion($filter, $input, $entity, $record, $colMock, $expected) {
		$this->assertSame($expected->format('Y-m-d h:i:a'), $filter->transform($input, $entity, $record, $colMock)->format('Y-m-d h:i:a'));
	}
}