<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;

use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

class FloatFilter {

	public function filter($value, $entity, array $record = array(), ColumnDefinition $to) {
		return (float) $value;
	}
}