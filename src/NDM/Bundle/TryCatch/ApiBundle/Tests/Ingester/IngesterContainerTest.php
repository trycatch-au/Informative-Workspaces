<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester;

use NDM\Bundle\TryCatch\ApiBundle\Ingester;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\StringResource;
use NDM\Bundle\TryCatch\ApiBundle\Entity\Component;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\IngesterContainer;

class IngesterContainerTest extends \PHPUnit_Framework_TestCase {
	public function testIngesterIsContained() {
		$ingestMock = new TestIngester();

		$csvData = array(array('id' => '1', 'foo' => 'bar'));
		$csvMock = new StringResource("id,foo\n1,bar");
		;
		$readerMock = $this->getMock('NDM\\Bundle\\TryCatch\\ApiBundle\\Ingester\\Reader\\Reader');

		$readerMock->expects($this->exactly(1))
			->method('read')
			->with($csvMock)
			->will($this->returnValue($csvData))
		;

		$writerMock = $this->getMock('NDM\\Bundle\\TryCatch\\ApiBundle\\Ingester\\Writer\\Writer');

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