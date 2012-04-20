<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;
use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

use Doctrine\Common\Collections\ArrayCollection;

class CollectionFilter implements Filter {
	public function filter($value, $entity, array $record = array(), ColumnDefinition $to) {
		if(!is_string($value)) {
			return $value;
		}

		if(!strpos($value, '|')) {
			return array($value);
		}

		$data = preg_split('#(?<!\\\)\\|#', $value);

		array_walk($data, function(&$value, $key = null§) {
			$value = str_replace('\|', '|', $value);

			return $value;
		});

		return $data;
	}
}