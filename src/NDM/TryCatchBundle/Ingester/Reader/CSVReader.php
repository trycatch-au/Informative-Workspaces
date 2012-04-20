<?php
namespace NDM\TryCatchBundle\Ingester\Reader;
use NDM\TryCatchBundle\Ingester\Resource\Resource;

class CSVReader implements Reader{

	public function read(Resource $resource) {
		try {
			$file = new \SplFileObject($resource->getTmpFile(), 'rb');
		} catch (\RuntimeException $e) {
			throw new \InvalidArgumentException(sprintf('Error opening file "%s".', $resource));
		}

		$file->setFlags(\SplFileObject::READ_CSV | \SplFileObject::SKIP_EMPTY);
		$file->setCsvControl(',', '"', "\\");

		$headers = false;
		$data = array();
		foreach($file as $rowNum => $row) {

			$row = array_values($row);
			if($headers === false) {
				$headers = array_map('strtolower', $row);
			}else{
				if(count($headers) !== count($row)) {
					throw new \InvalidArgumentException(sprintf('Row "%s" contains an invalid number of columns', $rowNum));
				}

				$data[] = array_combine($headers, $row);
			}
		}

		return $data;
	}

	public function supports(Resource $resource) {
		try {
			$this->read($resource);

			return true;
		}catch(\Exception $e) {
			return false;
		}
	}

}