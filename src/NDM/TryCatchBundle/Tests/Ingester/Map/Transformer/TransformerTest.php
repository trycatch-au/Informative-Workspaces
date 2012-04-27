<?php
namespace NDM\TryCatchBundle\Tests\Ingester\Map\Transformer;
use NDM\TryCatchBundle\Ingester\Map\Transformer\CollectionTransformer;

abstract class TransformerTest extends \PHPUnit_Framework_TestCase {
	/**
	 * @param unknown_type $filter
	 * @param unknown_type $input
	 * @param unknown_type $expected
	 * @param unknown_type $entity
	 * @param array $record
	 * @dataProvider provideTransformerData
	 */
	public function testCollection($filter, $input, $expected, $entity = null, array $record = array()) {
		if(!$entity) {
			$entity = new \stdClass();
		}

		$this->makeAssertion($filter, $input, $entity, $record, $this->getColDefMock(), $expected);
	}

	protected function makeAssertion($filter, $input, $entity, $record, $colMock, $expected) {
		$this->assertSame($expected, $filter->transform($input, $entity, $record, $colMock));
	}

	protected function getColDefMock() {
		return $this->getMock('NDM\TryCatchBundle\Ingester\Map\ColumnDefinition', array(), array(), '', false);
	}

	protected abstract function provideTransformerData();
}