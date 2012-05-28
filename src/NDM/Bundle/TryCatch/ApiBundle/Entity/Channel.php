<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * NDM\Bundle\TryCatch\ApiBundle\Entity\Channel
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="NDM\Bundle\TryCatch\ApiBundle\Entity\ChannelRepository")
 */
class Channel {
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
	 * @var ArrayCollection $components
	 *
	 * @ORM\OneToMany(targetEntity="ComponentChannel", mappedBy="component")
	 */
	private $components;

	/**
	 * @var ArrayCollection $components
	 *
	 * @ORM\OneToMany(targetEntity="PlannedReleaseDate", mappedBy="channel")
	 */
	private $releases;

	/**
	 * Get id
	 *
	 * @return integer
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * Set name
	 *
	 * @param string $name
	 * @return Channel
	 */
	public function setName($name) {
		$this->name = $name;
		return $this;
	}

	/**
	 * Get name
	 *
	 * @return string
	 */
	public function getName() {
		return $this->name;
	}

	public function getComponents() {
		return $this->components;
	}

	public function setComponents(ArrayCollection $components) {
		$this->components = $components;
	}
	/**
	 * @return the $releases
	 */
	public function getReleases() {
		return $this->releases;
	}

	/**
	 * @param \Doctrine\Common\Collections\ArrayCollection $releases
	 */
	public function setReleases($releases) {
		$this->releases = $releases;
	}

	public function __toString() {
		return $this->getName();
	}

}
