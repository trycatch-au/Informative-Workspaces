<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;
class StringFilter {

	public function filter($value) {
		return strval($value);
	}

}