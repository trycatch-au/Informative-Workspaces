<?php

/**
 * CSVReader test case.
 */
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Reader\CSVReader;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\StringResource;

use NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Reader\ReaderTest;

class CSVReaderTest extends ReaderTest {

	public function setUp() {
		$this->reader = new CSVReader();
	}

	/**
	 *
	 */
	public function provideReadData() {
		return array(
			array(true, new StringResource("1,2,3\n3,2,1"), array(array('1' => '3', '2' => '2', '3' => '1'))),
			array(false, new StringResource("1,2,3,4\n3,2,1"), null),
			array(true, new StringResource("1,2,3\n\"This is a test of the CSV REAder\",\"this,is,a,test\\\"as\",\"1\""), array(array('1' => 'This is a test of the CSV REAder', '2' => 'this,is,a,test\\"as', '3' => '1'))),
		);
	}

	/* (non-PHPdoc)
	 * @see NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Reader.ReaderTest::provideSupportsData()
	 * The CSV reader is quite lax so it can parse anything because anything is valid CSV most of the time!
	 */
	public function provideSupportsData() {
		return array(
			array(new StringResource("1,2,3\r3,2,1"), true)
		);
	}
}