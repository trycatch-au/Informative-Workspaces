<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;
use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

interface Filter {
	public function filter($value, $entity, array $record = array(), ColumnDefinition $to);
}