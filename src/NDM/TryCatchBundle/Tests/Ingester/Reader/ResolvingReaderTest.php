<?php

/**
 * CSVReader test case.
 */
use NDM\TryCatchBundle\Ingester\Reader\ResolvingReader;

use NDM\TryCatchBundle\Ingester\Reader\CSVReader;

use NDM\TryCatchBundle\Ingester\Resource\StringResource;

use NDM\TryCatchBundle\Tests\Ingester\Reader\ReaderTest;

class ResolvingReaderTes extends \PHPUnit_Framework_TestCase {

	public function testResolver() {
		$jsonResource = new StringResource(json_encode(array(array('foo' => 'bar'))));
		$csvResource = new StringResource("foo\nbar");

		$jsonReader = $this->getMock('NDM\\TryCatchBundle\\Ingester\\Reader\\Reader');
		$jsonReader
			->expects($this->at(0))
			->method('supports')
			->with($csvResource)
			->will($this->returnValue(false))
		;
		$jsonReader
			->expects($this->at(1))
			->method('supports')
			->with($jsonResource)
			->will($this->returnValue(true))
		;
		$jsonReader
			->expects($this->at(3))
			->method('supports')
			->with($jsonResource)
			->will($this->returnValue(true))
		;

		$jsonReader
			->expects($this->at(2))
			->method('read')
			->with($jsonResource)
			->will($this->returnValue(array()))
		;

		$csvReader = $this->getMock('NDM\\TryCatchBundle\\Ingester\\Reader\\Reader');

		$csvReader
			->expects($this->at(0))
			->method('supports')
			->with($csvResource)
			->will($this->returnValue(true))
		;

		$csvReader
			->expects($this->at(1))
			->method('read')
			->with($csvResource)
			->will($this->returnValue(array()))
		;


		$this->reader = new ResolvingReader(array($jsonReader, $csvReader));
		$this->reader->read($csvResource);
		$this->reader->read($jsonResource);
		$this->assertTrue($this->reader->supports($jsonResource));
	}

	/**
	 * @expectedException \InvalidArgumentException
	 */
	public function testExceptionOnUnsupported() {
		$reader = new ResolvingReader();
		$reader->read(new StringResource("foo,bar\nbar,foo"));
	}
}