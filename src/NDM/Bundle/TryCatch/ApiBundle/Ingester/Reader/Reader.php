<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Reader;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\Resource;

/**
 * Reader
 *
 * Contract for a reader to implement.
 *
 * A reader is the object which iscapable of converting the data from a single format
 * to an internal key=>value array.
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
interface Reader {

	/**
	 * Read a resource and convert to an array
	 *
	 * @param Resource $resource The resource to read
	 * @return array The read data
	 */
	public function read(Resource $resource);

	/**
	 * Check if this reader thinks it's capable of reading a particular resource
	 *
	 * @param Resource $resource
	 */
	public function supports(Resource $resource);
}