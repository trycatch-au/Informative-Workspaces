<?php

namespace NDM\TryCatchBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class ComponentChannelType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder
            ->add('version')
            ->add('component')
            ->add('channel')
        ;
    }

    public function getName()
    {
        return 'ndm_trycatchbundle_componentchanneltype';
    }
}
