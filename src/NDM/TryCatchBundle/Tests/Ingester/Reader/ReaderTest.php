<?php
namespace NDM\TryCatchBundle\Tests\Ingester\Reader;
use NDM\TryCatchBundle\Ingester\Resource\Resource;

abstract class ReaderTest extends \PHPUnit_Framework_Testcase {

	protected $reader;

	public abstract function provideSupportsData();

	public abstract function provideReadData();

	/**
	 * @dataProvider provideReadData
	 */
	public function testRead($shouldWork, Resource $resource, $expected) {
		$data = null;
		try {
			$data = $this->reader->read($resource);
			if($shouldWork === false) {
				throw new \Exception();
			}
		}catch(\Exception $e) {
			if($shouldWork === true) {
				throw $e;
			}
		}

		$this->assertSame($expected, $data);
	}

	/**
	 * @dataProvider provideSupportsData
	 */
	public function testSupports(Resource $resource, $shouldSupport) {
		$this->assertSame((boolean) $shouldSupport, $this->reader->supports($resource));
	}
}