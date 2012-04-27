<?php
namespace NDM\TryCatchBundle\Ingester\Map\Transformer;
use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

/**
 * Date Transformer
 *
 * Transforms data from any valid date format into a \DateTime object
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class DateTransformer {

	/**
	 * @param unknown_type $value
	 * @param unknown_type $entity
	 * @param array $record
	 * @param ColumnDefinition $to
	 * @return \DateTime|NULL
	 */
	public function transform($value, $entity, array $record = array(), ColumnDefinition $to) {
		try {
			$date = new \DateTime($value);

			return $date;
		}catch(\Exception $e) {
			$date = strtotime($value);
			if(empty($date)) {
				return null;
			}

			return new \DateTime('@' . $date);
		}
	}
}