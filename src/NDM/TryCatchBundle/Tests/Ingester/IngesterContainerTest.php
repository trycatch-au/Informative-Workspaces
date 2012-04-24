<?php
namespace NDM\TryCatchBundle\Tests\Ingester;

use NDM\TryCatchBundle\Ingester;
use NDM\TryCatchBundle\Ingester\Resource\StringResource;
use NDM\TryCatchBundle\Entity\Component;
use NDM\TryCatchBundle\Ingester\IngesterContainer;

class IngesterContainerTest extends \PHPUnit_Framework_TestCase {
	public function testIngesterIsContained() {
		$ingestMock = new TestIngester();

		$csvData = array(array('id' => '1', 'foo' => 'bar'));
		$csvMock = new StringResource("id,foo\n1,bar");
		;
		$readerMock = $this->getMock('NDM\\TryCatchBundle\\Ingester\\Reader\\Reader');

		$readerMock->expects($this->exactly(1))
			->method('read')
			->with($csvMock)
			->will($this->returnValue($csvData))
		;

		$writerMock = $this->getMock('NDM\\TryCatchBundle\\Ingester\\Writer\\Writer');

		$writerMock->expects($this->exactly(1))
			->method('write')
			->with(array(array(array(), array('foo' => 'bar', 'id' => 1))))
			->will($this->returnValue($csvData))
		;
		$container = new IngesterContainer($ingestMock, $readerMock, $writerMock);
		$this->assertSame($csvData, $container->ingest($csvMock));

	}
}

class TestIngester extends Ingester {

	public function __construct() {}
	public function getExisting(array $record) {
		return array();
	}
}