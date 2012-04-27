<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester\Resource;

abstract class ResourceTest extends \PHPUnit_Framework_TestCase {

	/**
	 * @dataProvider provideSupportsData
	 * @param unknown_type $resource
	 * @param unknown_type $supports
	 */
	public function testSupports($resource, $supports) {
		$class = $this->getResourceClass();
		try {
			$resource = new $class($resource);
			if($supports === false) {
				$this->fail(sprintf('Resource "%s" should not be supported by "%s"', $resource, $class));
			}
		}catch(\InvalidArgumentException $e) {
			if($supports === true) {
				$this->fail(sprintf('Resource "%s" should be supported by "%s"', $resource, $class));
			}
		}
	}

	/**
	 * @dataProvider provideGetContentData
	 * @param unknown_type $resource
	 * @param unknown_type $supports
	 */
	public function testGetContent($resource, $expected) {
		$class = $this->getResourceClass();

		$resource = new $class($resource);
		$this->assertSame($expected, $resource->getContent());
	}

	public abstract function provideSupportsData();

	public abstract function provideGetContentData();

	public abstract function getResourceClass();
}