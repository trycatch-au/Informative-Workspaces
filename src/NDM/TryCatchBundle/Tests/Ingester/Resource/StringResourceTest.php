<?php

namespace NDM\TryCatchBundle\Tests\Ingester\Resource;


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
		return 'NDM\TryCatchBundle\Ingester\Resource\StringResource';
	}

}