<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;

use Doctrine\ORM\Mapping as ORM;

/**
 * NDM\Bundle\TryCatch\ApiBundle\Entity\Component
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="NDM\Bundle\TryCatch\ApiBundle\Entity\ComponentRepository")
 */
class Component
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
     * @var string $name
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var string $displayName
     *
     * @ORM\Column(name="display_name", type="string", length=255, nullable=true)
     */
    private $displayName;

    /**
     * @var string $version Represents the latest available version for any environment
     *
     * @ORM\Column(name="version", type="string", length=255)
     */
    private $version;

    /**
     * @var ArrayCollection $channels
     *
     * @ORM\OneToMany(targetEntity="ComponentChannel", mappedBy="component")
     */
    private $channels;

	/**
	 * @var ArrayCollection $components
	 *
	 * @ORM\OneToMany(targetEntity="PlannedReleaseDate", mappedBy="component")
	 */
	private $releases;

	/**
	 * @var array $lastBuildState
	 *
	 * @ORM\Column(name="last_build_state", type="array")
	 */
	private $lastBuildState;

	public function __construct() {
		$this->channels = new ArrayCollection();
		$this->releases = new ArrayCollection();
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

    /**
     * Set name
     *
     * @param string $name
     * @return Component
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Component
     */
    public function setDisplayName($name)
    {
        $this->displayName = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getDisplayName()
    {
        return $this->displayName;
    }

    /**
     * Set version
     *
     * @param string $version
     * @return Component
     */
    public function setVersion($version)
    {
    	if(!strpos($version, '.')) {
    		$version = $version . '.0';
    	}

        $this->version = $version;
        return $this;
    }

    /**
     * Get version
     *
     * @return string
     */
    public function getVersion()
    {
        return $this->version;
    }
	/**
	 * @return ArrayCollection $channels
	 */
	public function getChannels() {
		return $this->channels;
	}

	/**
	 * @param \NDM\Bundle\TryCatch\ApiBundle\Entity\ArrayCollection $channels
	 */
	public function setChannels(ArrayCollection $channels) {
		$this->channels = $channels;
	}

	/**
	 * @return ArrayCollection $releases
	 */
	public function getReleases() {
		return $this->releases;
	}

	/**
	 * @param \NDM\Bundle\TryCatch\ApiBundle\Entity\ArrayCollection $releases
	 */
	public function setReleases(ArrayCollection $releases) {
		$this->releases = $releases;
	}

	public function __toString() {
		return $this->getName();
	}

	/**
	 * @return array $lastBuildState
	 */
	public function getLastBuildState() {
		return $this->lastBuildState;
	}

	/**
	 * @param array $lastBuildState
	 */
	public function setLastBuildState(array $lastBuildState) {
		$this->lastBuildState = $lastBuildState;
	}

	public function setIsBuilding($state = true) {
		$this->lastBuildState['building'] = $state;

		return $this;
	}

	public function setLastBuildDate(\DateTime $date) {
		$this->lastBuildState['date'] = $date;

		return $this;
	}

	public function setLastBuildStatus($state) {
		$this->lastBuildState['status'] = $state;

		return $this;
	}

}
