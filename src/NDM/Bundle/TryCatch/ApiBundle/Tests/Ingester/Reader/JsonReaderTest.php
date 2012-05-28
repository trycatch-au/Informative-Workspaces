<?php

/**
 * CSVReader test case.
 */
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Reader\JsonReader;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Reader\CSVReader;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\StringResource;

use NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Reader\ReaderTest;

class JsonReaderTest extends ReaderTest {

	public function setUp() {
		$this->reader = new JsonReader();
	}

	/**
	 *
	 */
	public function provideReadData() {
		return array(
			array(true, new StringResource(json_encode(array(array('1' => '2', '3' => '4')))), array(array('1' => '2', '3' => '4')))
		);
	}

	/* (non-PHPdoc)
	 * @see NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Reader.ReaderTest::provideSupportsData()
	 * The CSV reader is quite lax so it can parse anything because anything is valid CSV most of the time!
	 */
	public function provideSupportsData() {
		return array(
			array(new StringResource("{}"), true),
			array(new StringResource("[]"), true),
			array(new StringResource("[{'foo': 'bar'}]"), false),
			array(new StringResource("[ {\"foo\": \"bar\"} ]"), true),
			array(new StringResource("[ {\"foo\": \"bar\"} ]"), true),
			array(new StringResource(" [{\"foo\": \"bar\"} ]"), true),
			array(new StringResource("{\"foo\": \"bar\"} ]"), false),
			array(new StringResource("[\"foo\": \"bar\"} ]"), false)
		);
	}
}