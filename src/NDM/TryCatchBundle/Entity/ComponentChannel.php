<?php

namespace NDM\TryCatchBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * NDM\TryCatchBundle\Entity\ComponentChannel
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="NDM\TryCatchBundle\Entity\ComponentChannelRepository")
 */
class ComponentChannel
{
    /**
     * @var integer $id
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string $version
     *
     * @ORM\Column(name="version", type="string", length=255, nullable=true)
     */
    private $version;

    /**
     * @var NDM\TryCatchBundle\Entity\Component $component
     *
     * @ORM\ManyToOne(targetEntity="Component")
     */
    private $component;

    /**
     * @var NDM\TryCatchBundle\Entity\Channel $channel
     *
     * @ORM\ManyToOne(targetEntity="Channel")
     */
    private $channel;


    /**
	 * @return the $version
	 */
	public function getVersion() {
		return $this->version;
	}

	/**
	 * @param string $version
	 */
	public function setVersion($version) {
    	if(!strpos($version, '.')) {
    		$version = $version . '.0';
    	}

		$this->version = $version;
	}

	/**
	 * @return the $component
	 */
	public function getComponent() {
		return $this->component;
	}

	/**
	 * @param \NDM\TryCatchBundle\Entity\Component $component
	 */
	public function setComponent($component) {
		$this->component = $component;
	}

	/**
	 * @return the $channel
	 */
	public function getChannel() {
		return $this->channel;
	}

	/**
	 * @param \NDM\TryCatchBundle\Entity\Channel $channel
	 */
	public function setChannel($channel) {
		$this->channel = $channel;
	}

	/**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    public function __toString() {
    	return sprintf('%s on channel %S@%s', $this->getComponent(), $this->getChannel() && $this->getChannel()->getName(), $this->getVersion());
    }
}