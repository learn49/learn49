import React from 'react'

import Head from '@/elements/Head'

const Terms = () => {
  return (
    <>
      <Head title='Termos de Uso' />
      <div className='flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900'>
        <div className='flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800'>
          <div className='flex flex-col overflow-y-auto md:flex-row'>
            <div className='h-32 md:h-auto md:w-1/2'>
              <img
                aria-hidden='true'
                className='object-cover w-full h-full'
                src={'/img/login-office.jpeg'}
                alt='Logo'
              />
            </div>
            <main className='flex items-center justify-center p-6 sm:px-8  md:w-1/2'>
              <div className='w-full'>
                <h1 className='mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200'>
                  Termos de Uso do Sistema ALUNO.TV
                </h1>

                <hr className='my-3' />
                <p className='flex justify-between'>
                  <a className='text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline'>
                    Termos de uso aceito em 10/03/2015 às 15:06.
                  </a>
                  <a className='text-gray-200 text-right'>ID49</a>
                </p>
              </div>
            </main>
          </div>
          <p className='m-6 dark:text-gray-200'>
            1. Os materiais necessários para transmissão das imagens, como
            câmeras, DVR, fontes, cabeamento, entre outros são por conta do
            cliente;
          </p>
          <p className='m-6 dark:text-gray-200'>
            2. Se necessário, o cliente deverá, em um prazo máximo de 15 dias
            corridos, deixar a infraestrutura e equipamentos pertinentes prontos
            para a ativação do sistema;
          </p>
          <p className='m-6 dark:text-gray-200'>
            3. Não é fator impeditivo de pagamento da solução Maxin o não
            fornecimento do item anterior;
          </p>
          <p className='m-6 dark:text-gray-200'>
            4. O prazo de ativação do sistema pela MaxinTV será de no máximo 3
            dias úteis;
          </p>
          <p className='m-6 dark:text-gray-200'>
            5. O documento MaxinTV-Cadastro e Dados para Ativação e todo seu
            conteúdo fazem parte deste documento, Termos de uso do sistema;
          </p>
          <p className='m-6 dark:text-gray-200'>
            6. A Taxa de SETUP deverá ser paga diretamente para a empresa
            revendedora do sistema, após a ativação do mesmo;
          </p>
          <p className='m-6 dark:text-gray-200'>
            7. A cobrança da mensalidade iniciará 30 dias após a ativação do
            sistema, respeitando o dia indicado no documento MaxinTV-Cadastro e
            Dados para Ativação;
          </p>
          <p className='m-6 dark:text-gray-200'>
            8. Todo e qualquer pagamento referente à mensalidade deverá ser
            feito via BOLETO EMITIDO EXCLUSIVAMENTE PELA MAXINTV ou DEPÓSITO EM
            SUA CONTA BANCÁRIA;
          </p>
          <p className='m-6 dark:text-gray-200'>
            {' '}
            9. O não pagamento da mensalidade implicará na suspensão do serviço
            até sua regularização;{' '}
          </p>
          <p className='m-6 dark:text-gray-200'>
            10. A internet banda larga do local deverá ter compatibilidade
            técnica mínima para o envio das imagens das câmeras, ou seja, o
            UPLOAD necessário para a quantidade de câmeras selecionadas;{' '}
          </p>
          <p className='m-6 dark:text-gray-200'>
            11. A taxa máxima de transmissão (bit-rate) deve ser de 350kbps por
            câmera. O serviço poderá ser interrompido se a transmissão superar
            esse valor. Recomendamos transmitir com taxa de 256kbps;{' '}
          </p>
          <p className='m-6 dark:text-gray-200'>
            12. A MaxinTV durante a vigência do contrato fornecerá em comodato a
            licença de uso de software de sua exclusiva propriedade e data
            center com servidores de tráfego e armazenamento de dados;{' '}
          </p>
          <p className='m-6 dark:text-gray-200'>
            13. O Cliente receberá sem custo as “funcionalidades”, atualizações
            e melhorias, e não customizações que a MaxinTV aprimorar no
            software;
          </p>
          <p className='m-6 dark:text-gray-200'>
            14. Toda customização será avaliada e seu custo acordado entre as
            partes;{' '}
          </p>
          <p className='m-6 dark:text-gray-200'>
            15. É proibida a comercialização, distribuição ou cessão do uso do
            software, responsabilizando-se o Cliente penal e civilmente pelo
            eventual descumprimento desta cláusula;
          </p>
          <p className='m-6 dark:text-gray-200'>
            {' '}
            16. O Cliente poderá rescindir esse fornecimento sem incidência de
            multa, desde que notificado a MaxinTV com 30 (trinta) dias de
            antecedência, exceto em caso de customização do sistema antes de 6
            (seis) meses de fornecimento quando haverá incidência de multa de 3
            (três) mensalidades para cobrir parte dos custos de desenvolvimento;{' '}
          </p>
          <p className='m-6 dark:text-gray-200'>
            17. A efetivação da rescisão somente se dará quando quitados todos
            os débitos pendentes até a respectiva data;{' '}
          </p>
          <p className='m-6 dark:text-gray-200'>
            18. Toda instalação, equipamentos ou outra estrutura que seja
            fornecida por terceiros ou implementada pelo Cliente que se
            interligue ao sistema da MaxinTV, não será de responsabilidade da
            MaxinTV;
          </p>
          <p className='m-6 dark:text-gray-200'>
            {' '}
            19. A MaxinTV não assumirá quaisquer responsabilidades por
            interrupção ou deficiência de funcionamento seja qual for a
            respectiva duração, por fatos imputáveis exclusivamente ao Cliente
            ou por avaria nos Equipamentos ou por operadoras e/ou prestadoras de
            serviços de banda larga, contratados pelo Cliente;
          </p>
          <p className='m-6 dark:text-gray-200'>
            {' '}
            20. Caso haja problemas técnicos de responsabilidade direta da
            MaxinTV, no que diz respeito a seus sistemas e que não forem
            solucionados no prazo de 10 dias úteis, o presente fornecimento
            poderá ser rescindido de pleno direito pelo Cliente;{' '}
          </p>
          <p className='m-6 dark:text-gray-200'>
            21. O Cliente na forma das leis brasileiras, civil e penal,
            respeitará os direitos autorais, segredos comerciais dos SOFTWARES,
            hardwares, marcas, tecnologias, logotipo, insígnias, símbolos,
            manuais, documentação técnica ou qualquer outro material correlato
            aos SOFTWARES, nomes, serviços, sistemas e Equipamentos de
            propriedade da MaxinTV;
          </p>
          <p className='m-6 dark:text-gray-200'>
            {' '}
            22. O Cliente reconhece expressamente que o contido no item anterior
            é direito protegido pelas legislações nacional e internacional,
            aplicáveis à propriedade intelectual e aos direitos autorais,
            especialmente pelo que contém as Leis 9.609 e 9.610 de 19/12/98 e
            suas atualizações;{' '}
          </p>
          <p className='m-6 dark:text-gray-200'>
            23. A MaxinTV, sendo apenas a fornecedora de softwares, NÃO SE
            RESPONSABILIZA PELO CONTEÚDO DA EXIBIÇÃO transmitida ao vivo ou
            gravada ou qualquer outro conteúdo inserido no sistema utilizado
            pelo seu Cliente, bem como o Cliente deverá respeitar os direitos
            autorais de terceiros e responder civil ou criminalmente pelo
            conteúdo da sua programação;{' '}
          </p>
          <p className='m-6 dark:text-gray-200'>
            24. Para dirimir quaisquer controvérsias ou pendências decorrentes
            deste fornecimento, elegem as partes com exclusividade o Foro de
            Santa Rita do Sapucaí, MG
          </p>
        </div>
      </div>
    </>
  )
}

export default Terms
