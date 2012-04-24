<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;
use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

/**
 * Date Filter
 *
 * Transforms data from any valid date format into a \DateTime object
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class DateFilter {

	/**
	 * @param unknown_type $value
	 * @param unknown_type $entity
	 * @param array $record
	 * @param ColumnDefinition $to
	 * @return \DateTime|NULL
	 */
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