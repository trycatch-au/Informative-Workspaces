<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Entity;
use Doctrine\ORM\Query;

use Doctrine\ORM\EntityRepository as BaseEntityRepository;

class EntityRepository extends BaseEntityRepository {

	public function findOne($prop, $val) {
		$qb = $this->createQueryBuilder('c');
		$qb
		->andWhere($qb->expr()->eq('c.' . $prop, ':' . $prop))
		->setParameter(':' . $prop, $val)
		->setMaxResults(1)
		;

		return $qb->getQuery()->getOneOrNullResult(Query::HYDRATE_ARRAY);
	}
}

?>