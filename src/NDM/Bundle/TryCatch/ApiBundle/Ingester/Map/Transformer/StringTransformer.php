<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer;

/**
 * StringTransformer
 *
 * Transforms data to it's string equivelant
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class StringTransformer {

	public function transform($value) {
		return strval($value);
	}

}