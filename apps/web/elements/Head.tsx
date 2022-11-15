import React from 'react'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

interface Props {
  title: string
}

const CustomHead = ({ title }: Props) => (
  <>
    <NextSeo
      title={title}
      description={title}
      defaultTitle={title}
      openGraph={{
        type: 'website',
        url: 'https://www.devpleno.com',
        title: 'Adquira conhecimento e evolua rápido',
        description:
          'Conhecimento direto do campo de batalha nacional e internacional para devs de todos os níveis alcançarem seus objetivos na profissão.',
        images: [
          {
            url: 'https://aura-beta.vercel.app/tulio-seo.png',
            width: 800,
            height: 600,
            alt: 'Tulio Faria'
          }
        ]
      }}
    />
    <Head>
      <title>{title} - Learn49</title>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Language' content='pt' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
  </>
)

export default CustomHead
