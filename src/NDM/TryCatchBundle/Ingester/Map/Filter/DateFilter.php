<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;
use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

class DateFilter {

	public function filter($value, $entity, array $record = array(), ColumnDefinition $to) {
		try {
			$date = new \DateTime($value);

			return $date;
		}catch(\Exception $e) {
			$value = strtotime($value);
			if(empty($value)) {
				return null;
			}

			return new \DateTime('@' . $value);
		}
	}
}