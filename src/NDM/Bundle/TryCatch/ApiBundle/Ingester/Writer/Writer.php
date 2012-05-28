<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Writer;

/**
 * Contract for a writer to implement
 *
 * A Writer is an aobject which is capable of mapping ingested data to
 * an internal data structure.
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
use Doctrine\Common\Collections\ArrayCollection;

interface Writer {

	/**
	 * Write
	 *
	 * Write the record data to an internal data structure
	 * and return the written data
	 *
	 * @param array $records The records to write
	 * @return ArrayCollection
	 */
	public function write(array $records);
}