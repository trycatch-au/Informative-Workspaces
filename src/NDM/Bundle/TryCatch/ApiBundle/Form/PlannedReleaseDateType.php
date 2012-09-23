<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Form;

use Symfony\Component\Form\FormBuilderInterface;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class PlannedReleaseDateType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('date')
            ->add('freezeDate')
            ->add('channel')
            ->add('component')
        ;
    }

    public function getName()
    {
        return 'ndm_trycatchbundle_plannedreleasedatetype';
    }
}
