<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
 * NDM\Bundle\TryCatch\ApiBundle\Entity\Issue
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="NDM\Bundle\TryCatch\ApiBundle\Entity\IssueRepository")
 */
class Issue {
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
	 * @ORM\Column(name="name", type="string", length=255, nullable=true)
	 */
	private $name;

	/**
	 * @var integer $priority
	 *
	 * @ORM\Column(name="priority", type="integer")
	 */
	private $priority;

	/**
	 * @var datetime $createdAt
	 *
	 * @ORM\Column(name="createdAt", type="datetime", nullable=true)
	 */
	private $createdAt;

	/**
	 * @var date $closedAt
	 *
	 * @ORM\Column(name="closedAt", type="date", nullable=true)
	 */
	private $closedAt;

	/**
	 * @var integer $uid
	 *
	 * @ORM\Column(name="uid", type="string", length=255)
	 */
	private $uid;

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
	 * @return Issue
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

	/**
	 * Set priority
	 *
	 * @param integer $priority
	 * @return Issue
	 */
	public function setPriority($priority) {
		$this->priority = $priority;
		return $this;
	}

	/**
	 * Get priority
	 *
	 * @return integer
	 */
	public function getPriority() {
		return $this->priority;
	}

	/**
	 * Set createdAt
	 *
	 * @param datetime $createdAt
	 * @return Issue
	 */
	public function setCreatedAt($createdAt) {
		$this->createdAt = $createdAt;
		return $this;
	}

	/**
	 * Get createdAt
	 *
	 * @return datetime
	 */
	public function getCreatedAt() {
		return $this->createdAt;
	}

	/**
	 * Set closedAt
	 *
	 * @param date $closedAt
	 * @return Issue
	 */
	public function setClosedAt($closedAt) {
		$this->closedAt = $closedAt;
		return $this;
	}

	/**
	 * Get closedAt
	 *
	 * @return date
	 */
	public function getClosedAt() {
		return $this->closedAt;
	}

	/**
	 * @return number
	 */
	public function getUid() {
		return $this->uid;
	}

	/**
	 * @param unknown_type $uid
	 */
	public function setUid($uid) {
		$this->uid = $uid;
	}

	public function wasOpenOn(\DateTime $date) {
		return $date >= $this->getCreatedAt() && $date <= $this->getClosedAt();
	}
}
