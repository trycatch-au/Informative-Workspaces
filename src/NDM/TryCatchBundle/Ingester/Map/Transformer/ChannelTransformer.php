<?php
namespace NDM\TryCatchBundle\Ingester\Map\Transformer;

use NDM\TryCatchBundle\Entity;
use Doctrine\ORM\EntityManager;
use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Channel Transformer
 *
 * Transforms data from
 * 'dev@1.0.5|prod@2.0.0' into
 *
 * array(ComponentChannel(channel=dev,version=1.0.5), ComponentChannel(channel=prod, version=2.0.0));
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class ChannelTransformer extends CollectionTransformer {

	/**
	 * @var EntityManager
	 */
	private $om;

	/**
	 * @param EntityManager $om
	 */
	public function __construct(EntityManager $om) {
		$this->om = $om;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @see NDM\TryCatchBundle\Ingester\Map\Transformer.CollectionTransformer::Transformer()
	 */
	public function transform($value, $entity, array $record = array(), ColumnDefinition $to) {
		$items = parent::transform($value, $entity, $record, $to);

		if(!count($items)) {
			return new ArrayCollection();
		}

		foreach($items as $i => $item) {
			$items[$i] = $this->writeChannel($item, $entity, $record);
			$this->om->flush();
		}

		return new ArrayCollection($items);
	}

	/**
	 * Write a single channel
	 *
	 * This function recieves each components channels ("dev@1.05.6") and converts it to a
	 * ComponentChannel and updates the entity with the latest version information
	 *
	 * @param string $channel The channel in string format (<channel>@<version>)
	 * @param Component $component The component being ingested
	 * @param array $record The record being ingested
	 * @return \NDM\TryCatchBundle\Entity\ComponentChannel
	 */
	protected function writeChannel($channel, Entity\Component $component, array $record = array()) {
		list($name, $version) = explode('@', $channel);


		foreach($component->getChannels() as $recordEntity) { // Look for an already existing relationship and update if possible
			if(trim(strtolower($name)) == trim(strtolower($recordEntity->getChannel()->getName()))) {
				$recordEntity->setVersion($version);
				$this->om->persist($recordEntity);
				return $recordEntity;
			}
		}

		// No ComponentChannel yet, create one
		// Make sure the channel exists
		$channel = $this->om->getRepository('NDMTryCatchBundle:Channel')->findOneBy(array('name' => trim($name)));
		if(!$channel) {
			// Otherwise create it
			$channel = new Entity\Channel();
			$channel->setName($name);
			$this->om->persist($channel);
		}

		$recordEntity = new Entity\ComponentChannel();
		$recordEntity->setVersion($version);
		$recordEntity->setComponent($component);
		$recordEntity->setChannel($channel);

		$this->om->persist($recordEntity);

		return $recordEntity;
	}
}