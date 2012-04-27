<?php

namespace NDM\TryCatchBundle\Tests\Ingester\Writer;

use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

use NDM\TryCatchBundle\Ingester\Writer\MapWriter;

class MapWriterTest extends \PHPUnit_Framework_TestCase {

	/**
	 * @var MapWriter
	 */
	private $writer;

	public function setUp() {
		$this->writer = new MapWriter();
	}

	/**
	 * @param unknown_type $data
	 * @param unknown_type $expected
	 */
	public function testBasicWrite() {
		$colMock = $this->getMock('NDM\TryCatchBundle\Ingester\Map\ColumnDefinition', array(), array('created_at', 'createdAt'));
		$colMock->expects($this->exactly(2))
			->method('getFrom')
			->with()
			->will($this->returnValue('created_at'));

		$colMock->expects($this->exactly(1))
			->method('getTo')
			->with()
			->will($this->returnValue('createdAt'));

		$colMock->expects($this->exactly(1))
			->method('getFilters')
			->with()
			->will($this->returnValue(array()));

		$recordMock = $this->getMock(__NAMESPACE__.'\\Record');
		$recordMock->expects($this->exactly(1))
			->method('setCreatedAt')
			->with('2012-04-20')
			->will($this->returnValue($recordMock));

		$writer = new MapWriter(array($colMock));
		$this->assertSame(array($recordMock), $writer->write( array( array($recordMock, array('created_at' => '2012-04-20')) ) )->toArray());
	}

	/**
	 * @param unknown_type $data
	 * @param unknown_type $expected
	 */
	public function testFilteredWrite() {
		$date = new \DateTime('2012-04-20');

		$filterMock = $this->getMock('NDM\TryCatchBundle\Ingester\Map\Transformer\Transformer');
		$filterMock->expects($this->exactly(1))
			->method('transform')
			->with('2012-04-20')
			->will($this->returnValue($date))
		;

		$colMock = $this->getMock('NDM\TryCatchBundle\Ingester\Map\ColumnDefinition', array(), array('created_at', 'createdAt'));
		$colMock->expects($this->exactly(2))
			->method('getFrom')
			->with()
			->will($this->returnValue('created_at'));

		$colMock->expects($this->exactly(1))
			->method('getTo')
			->with()
			->will($this->returnValue('createdAt'));

		$colMock->expects($this->exactly(1))
			->method('getFilters')
			->with()
			->will($this->returnValue(array($filterMock)));

		$recordMock = $this->getMock(__NAMESPACE__.'\\Record');
		$recordMock->expects($this->exactly(1))
			->method('setCreatedAt')
			->with($date)
			->will($this->returnValue($recordMock));

		$writer = new MapWriter(array($colMock));
		$this->assertSame(array($recordMock), $writer->write( array( array($recordMock, array('created_at' => '2012-04-20')) ) )->toArray());
	}

	/**
	 * @param unknown_type $data
	 * @param unknown_type $expected
	 * @expectedException \InvalidArgumentException
	 * @expectedExceptionMessage Cannot map column "foo" as the setter "
	 */
	public function testInvalidSetterWrite() {
		$colMock = $this->getMock('NDM\TryCatchBundle\Ingester\Map\ColumnDefinition', array(), array('created_at', 'createdAt'));
		$colMock->expects($this->exactly(2))
			->method('getFrom')
			->with()
			->will($this->returnValue('created_at'));

		$colMock->expects($this->exactly(2))
			->method('getTo')
			->with()
			->will($this->returnValue('foo'));

		$recordMock = $this->getMock(__NAMESPACE__.'\\Record');

		$writer = new MapWriter(array($colMock));
		$this->assertSame(array($recordMock), $writer->write( array( array($recordMock, array('created_at' => '2012-04-20')) ) )->toArray());
	}

	/**
	 * @param unknown_type $data
	 * @param unknown_type $expected
	 */
	public function testUnsetRecordColumnDefaultsToNull() {
		$colMock = $this->getMock('NDM\TryCatchBundle\Ingester\Map\ColumnDefinition', array(), array('created_at', 'createdAt'));
		$colMock->expects($this->exactly(3))
			->method('getFrom')
			->with()
			->will($this->returnValue('created_at'));

		$colMock->expects($this->exactly(1))
			->method('getTo')
			->with()
			->will($this->returnValue('createdAt'));

		$colMock->expects($this->exactly(1))
			->method('getFilters')
			->with()
			->will($this->returnValue(array()));

		$recordMock = $this->getMock(__NAMESPACE__.'\\Record');
		$recordMock
			->expects($this->exactly(1))
			->method('setCreatedAt')
			->with(null)
			->will($this->returnValue(null));
		;

		$writer = new MapWriter();
		$writer->registerColumnDefinition($colMock);
		$this->assertSame(array($recordMock), $writer->write( array( array($recordMock, array('foo' => '2012-04-20')) ) )->toArray());
	}
}

class Record {
	private $createdAtT;
	public function setCreatedAt($time) {
		$this->createdAt = $time;
	}
}