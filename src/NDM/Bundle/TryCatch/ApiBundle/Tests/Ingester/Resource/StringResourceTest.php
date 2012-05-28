<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Resource;


class StringResourceTest extends ResourceTest  {

	public function provideSupportsData() {
		return array(
			array('asdasdt', true),
			array('asd', true)
		);
	}

	public function provideGetContentData() {
		return array(
			array('test1', 'test1')
		);
	}

	public function getResourceClass() {
		return 'NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\StringResource';
	}

}