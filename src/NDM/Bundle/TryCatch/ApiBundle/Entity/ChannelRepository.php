<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Entity;


/**
 * ChannelRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
use Doctrine\ORM\Query;

use Doctrine\ORM\Query\Expr;

class ChannelRepository extends EntityRepository
{
	public function findAllAsArray() {
		return $this->createQueryBuilder('c')->getQuery()->execute(array(), Query::HYDRATE_ARRAY);
	}
}