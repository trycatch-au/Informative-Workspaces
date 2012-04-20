<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;
class TextCleanerFilter extends StringFilter {

	public function filter($value) {
		return trim(preg_replace('/[ ]{1,}/', ' ', $value));
	}
}