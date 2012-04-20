<?php
namespace NDM\TryCatchBundle\Ingester\Writer;
interface Writer {
	public function write(array $records);
}