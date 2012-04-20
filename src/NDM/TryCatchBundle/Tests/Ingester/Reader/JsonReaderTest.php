<?php

/**
 * CSVReader test case.
 */
use NDM\TryCatchBundle\Ingester\Reader\JsonReader;

use NDM\TryCatchBundle\Ingester\Reader\CSVReader;

use NDM\TryCatchBundle\Ingester\Resource\StringResource;

use NDM\TryCatchBundle\Tests\Ingester\Reader\ReaderTest;

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
	 * @see NDM\TryCatchBundle\Tests\Ingester\Reader.ReaderTest::provideSupportsData()
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