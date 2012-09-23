<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * NDM\Bundle\TryCatch\ApiBundle\Entity\PlannedReleaseDate
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="NDM\Bundle\TryCatch\ApiBundle\Entity\PlannedReleaseDateRepository")
 */
class PlannedReleaseDate
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
     * @var datetime $date
     *
     * @ORM\Column(name="freeze_date", type="datetime")
     */
    private $freezeDate;

    /**
     * @var datetime $date
     *
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;

    /**
     * @var datetime $date
     *
     * @ORM\ManyToOne(targetEntity="Channel")
     */
    private $channel;

    /**
     * @var datetime $date
     *
     * @ORM\ManyToOne(targetEntity="Component")
     */
    private $component;


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
     * Set date
     *
     * @param datetime $date
     * @return PlannedReleaseDate
     */
    public function setDate($date)
    {
        $this->date = $date;
        return $this;
    }

    /**
     * Get date
     *
     * @return datetime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set freeze date
     *
     * @param datetime $date
     * @return PlannedReleaseDate
     */
    public function setFreezeDate($date)
    {
        $this->freezeDate = $date;
        return $this;
    }

    /**
     * Get date
     *
     * @return datetime
     */
    public function getFreezeDate()
    {
        return $this->freezeDate;
    }
	/**
	 * @return the $channel
	 */
	public function getChannel() {
		return $this->channel;
	}

	/**
	 * @param \NDM\Bundle\TryCatch\ApiBundle\Entity\datetime $channel
	 */
	public function setChannel($channel) {
		$this->channel = $channel;
	}

	/**
	 * @return the $component
	 */
	public function getComponent() {
		return $this->component;
	}

	/**
	 * @param \NDM\Bundle\TryCatch\ApiBundle\Entity\datetime $component
	 */
	public function setComponent($component) {
		$this->component = $component;
	}

}
