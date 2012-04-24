<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;

/**
 * StringFilter
 *
 * Transforms data to it's string equivelant
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class StringFilter {

	public function filter($value) {
		return strval($value);
	}

}