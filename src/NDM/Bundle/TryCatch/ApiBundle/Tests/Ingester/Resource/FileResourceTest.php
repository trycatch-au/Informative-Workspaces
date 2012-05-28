<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Resource;


class FileResourceTest extends ResourceTest  {

	public function setUp() {
		touch('/tmp/test');
		touch('/tmp/test3');
		chmod('/tmp/test3', '666');

	}
	public function tearDown() {
		unlink('/tmp/test');
		unlink('/tmp/test3');
	}

	public function provideSupportsData() {
		return array(
			array('/tmp/test', true),
			array('/tmp/test', true),
			array('/tmp/test2', false),
			array('file://asd', false),
			array('php://input', false)
		);
	}

	public function provideGetContentData() {
		file_put_contents('/tmp/test1', 'test1');
		return array(
			array('/tmp/test1', 'test1')
		);
	}

	public function getResourceClass() {
		return 'NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\FileResource';
	}

}