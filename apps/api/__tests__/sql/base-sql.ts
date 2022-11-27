export const sqlBaseInserts = [
  "INSERT INTO public.extensions VALUES ('1aa561d0-25ac-488c-b3c9-f997c8450e2a', 'a42e2032-8d12-412c-a016-b14238194585', 'hotmart', NULL, '2021-01-20 00:54:26.642', '2021-01-20 00:54:26.642', 1, NULL, NULL, NULL);",
  "INSERT INTO public.accounts VALUES ('3566f823-5993-47f3-88a1-38669ea07944', 'DevPleno', 'devpleno', NULL, NULL, NULL, NULL, '2020-11-07 13:54:37.469', '2020-11-07 13:54:37.469');",
  "INSERT INTO public.accounts VALUES ('6b2c446a-bf72-4d46-8fba-b6f353312a06', NULL, 'matheusacc', NULL, NULL, NULL, NULL, '2020-11-07 14:04:29.213', '2020-11-07 14:04:29.213');",
  "INSERT INTO public.accounts VALUES ('9d9a4855-28b4-4271-ade9-eb2ba60e2daf', NULL, 'matheus', NULL, NULL, NULL, NULL, '2020-11-20 13:27:13.231', '2020-11-20 13:27:13.231');",
  "INSERT INTO public.accounts VALUES ('7a3351ca-b86d-47f5-a099-ceee9052b327', NULL, 'devacc', NULL, NULL, NULL, NULL, '2021-09-30 00:19:54.432', '2021-09-30 00:19:54.432');",
  "INSERT INTO public.extension_installations VALUES ('7af4e631-e8ed-4a22-a497-b2367aa88e2f', '1aa561d0-25ac-488c-b3c9-f997c8450e2a', '3566f823-5993-47f3-88a1-38669ea07944', true, '2021-01-20 00:54:32.329', '2021-01-20 00:54:32.329', NULL, NULL);",
  "INSERT INTO public.courses VALUES ('7c93efc4-fef1-4e86-99e7-5722c25caeb2', '6b2c446a-bf72-4d46-8fba-b6f353312a06', 'Curso de GraphQL', 'Curso avanÃ§ado de GraphQL.', NULL, NULL, NULL, 'd995cbcb-a217-4fbd-8c4e-2bcd49f48f48', '2020-11-07 14:10:45.246', '2020-11-07 14:10:45.246');",
  "INSERT INTO public.courses VALUES ('d40d42a1-c941-4ec2-9380-d6ec9dcafef9', '3566f823-5993-47f3-88a1-38669ea07944', 'DevPlenoClub', 'ConteÃºdo e acompanhamento para sua carreira decolar.', NULL, NULL, NULL, '273076ac-6ac5-49ca-ac9a-7010f59937c1', '2020-11-07 14:56:13.402', '2020-11-07 14:56:13.402');",
  "INSERT INTO public.courses VALUES ('3c5ec0e4-40f1-4433-880a-5671b67cfd9b', '9d9a4855-28b4-4271-ade9-eb2ba60e2daf', 'Fullstack Master', 'Top', NULL, NULL, NULL, '3e4aa33f-6569-4f7e-8fba-fe28a7626fe3', '2020-11-20 13:30:31.808', '2020-11-20 13:30:31.808');",
  "INSERT INTO public.courses VALUES ('ee03502f-1abe-436b-8aa0-af46c6077df4', '9d9a4855-28b4-4271-ade9-eb2ba60e2daf', 'asdasd', 'asda', NULL, NULL, NULL, '1d283fe9-e3de-4c1f-898f-4fb92a7bc0c4', '2020-11-20 13:30:49.79', '2020-11-20 13:30:49.79');",
  "INSERT INTO public.courses VALUES ('d85dd8b6-6029-4d25-b27f-3358339cd16c', '9d9a4855-28b4-4271-ade9-eb2ba60e2daf', 'Devpleno Club', 'asdads', NULL, NULL, NULL, 'ce3d0df2-f9ba-4349-af7e-ca1eeb1bd712', '2020-11-20 13:31:12.275', '2020-11-20 13:31:12.275');",
  "INSERT INTO public.courses VALUES ('6b415f2d-e4a6-4b7b-bac6-aadfba09addc', '7a3351ca-b86d-47f5-a099-ceee9052b327', 'curso01', 'curso', NULL, NULL, NULL, 'df48c73f-c81f-4222-987e-a1f417779104', '2021-09-30 01:57:40.953', '2021-09-30 01:57:40.953');",
  "INSERT INTO public.courses VALUES ('0ae9dbdf-b26e-464f-9399-54f0d57343b7', '7a3351ca-b86d-47f5-a099-ceee9052b327', 'Curso02', 'Curso02', NULL, NULL, NULL, '0f959dc4-eb17-41ab-884f-aa62e1c5d30e', '2021-09-30 14:04:00.657', '2021-09-30 14:04:00.657');",
  "INSERT INTO public.courses VALUES ('7333ef25-b2ba-4ff2-9a69-7c68f1a091ec', '3566f823-5993-47f3-88a1-38669ea07944', 'Criando anÃºncios no Google Ads', 'Como criar e administrar campanhas na rede de pesquisa do Google Ads para sites. ', NULL, NULL, NULL, '268d1cdd-1467-4f57-89a9-5957a5eba39d', '2021-11-01 19:01:29.335', '2021-11-06 03:08:27.837');",
  "INSERT INTO public.courses VALUES ('a334fa88-2dff-4f9e-8946-a60d2d05a71f', '3566f823-5993-47f3-88a1-38669ea07944', 'Google Meu NegÃ³cio', 'Aprenda a criar e gerenciar o \"Google Meu NegÃ³cio\"', NULL, NULL, NULL, '98fb5148-2d27-437f-acd6-246c7a1ff394', '2021-11-01 19:04:43.35', '2021-11-06 03:08:43.662');",
  "INSERT INTO public.courses VALUES ('78de96e5-1146-41d7-a462-a2097fe26bee', '3566f823-5993-47f3-88a1-38669ea07944', 'Fullstack Master', 'Fullstack Master.', NULL, NULL, NULL, '8bc118b0-a124-4d83-b26f-9582fa6c7c88', '2021-01-20 01:49:42.156', '2021-11-06 03:02:45.12');",
  "INSERT INTO public.courses VALUES ('7945dbab-8ed7-4a26-9145-6b7f0b73327d', '3566f823-5993-47f3-88a1-38669ea07944', 'DevReact', 'No DevReactJS, vocÃª vai do zero Ã  entrega aplicaÃ§Ãµes profissionais em React. As aulas trazem toda a experiÃªncia do instrutor, que utiliza ReactJS e React Native diariamente em projetos dentro e fora do Brasil.', NULL, NULL, NULL, '5dbe4c13-0dc1-47c3-9eaf-d022f0e44fa9', '2021-11-01 22:48:30.494', '2021-11-06 03:03:42.664');",
  "INSERT INTO public.courses VALUES ('6e334eb5-6b1f-4830-9329-c5efa2255692', '3566f823-5993-47f3-88a1-38669ea07944', 'PowerSites', 'O PowerSites Ã© um treinamento Premium que vai te ajudar a faturar na internet com um modelo de negÃ³cio simples e recorrente. VocÃª terÃ¡ tudo que precisa para entregar sites que performam e geram resultados positivos para seus futuros clientes.', NULL, NULL, NULL, '7592308d-bbf6-4d33-92b9-636eb4958174', '2021-11-01 13:33:31.834', '2021-11-06 03:04:24.975');",
  "INSERT INTO public.courses VALUES ('f65e97b1-dab7-4f29-8588-7169dab71ba6', '3566f823-5993-47f3-88a1-38669ea07944', 'ContextAPI em React', 'NÃ£o entendo ContextAPI! Afinal, por onde comeÃ§o? Existe no React Native? Posso usar ContextAPI dentro de outro? Quais os benefÃ­cios de usar? Aprenda a importÃ¢ncia deste recurso em uma aula incrÃ­vel, com exemplos reais e prÃ¡ticos. Entenda o funcionamento, organizaÃ§Ã£o e a implementaÃ§Ã£o da funcionalidade com cÃ³digos diretos e explicaÃ§Ãµes detalhadas.', NULL, NULL, NULL, '8070819c-9895-4382-8144-6fe19b570cda', '2021-10-26 21:49:12.537', '2021-11-06 03:06:02.856');",
  "INSERT INTO public.courses VALUES ('a3137083-ef14-4672-9dbb-b1872879b890', '3566f823-5993-47f3-88a1-38669ea07944', 'FormulÃ¡rios em React', 'Qual a diferenÃ§a de formulÃ¡rios controlados e nÃ£o controlados? como usar cada um deles? AlÃ©m disso, aprenda a utilizar os populares Formik e React-hook-forms; aplicando tambem ValidaÃ§Ãµes e relacionados.', NULL, NULL, NULL, '0b89fe8b-dba3-4296-87f1-244e0a276592', '2021-10-27 12:56:17.261', '2021-11-06 03:06:28.08');",
  "INSERT INTO public.courses VALUES ('5c550fe9-e971-4390-904d-e202d7fbe1f6', '3566f823-5993-47f3-88a1-38669ea07944', 'Tudo Sobre React Hooks', 'O que Ã© e como funciona os famosos Hooks do React? Aprenda os conceitos e as regras que regem a construÃ§Ã£o destas funÃ§Ãµes; como criar hooks personalizados e muitas outras dÃºvidas esclarecidas em um conteÃºdo completo. Aqui vocÃª verÃ¡ explicaÃ§Ãµes detalhadas sobre como funcionam cada um dos hooks useState, useEffect, useCallBack, useMemo, useRef e tambÃ©m o Swr!', NULL, NULL, NULL, '3b6d5d0b-0fb5-4e87-8bd6-556392630649', '2021-10-26 22:29:30.667', '2021-11-06 03:06:47.038');",
  "INSERT INTO public.courses VALUES ('a1127bf8-cbf4-435b-b2f4-68471b3cd262', '3566f823-5993-47f3-88a1-38669ea07944', 'Tudo Sobre NextJS', 'Entenda o que Ã© e como o NextJS Ã© capaz de criar Rotas estÃ¡ticas, Server Side Rendering (SSR), Server Side Generation (SSG) e Incremental Static Regeneration (ISR). Saiba como aplicar Revalidate, motivos de usar o \"Link\", observando seguranÃ§a e privacidade dos dados e a utilizaÃ§Ã£o da API.', NULL, NULL, NULL, '0227f2ad-2f42-479b-9755-999d8c392a1a', '2021-10-26 22:31:17.037', '2021-11-06 03:07:05.695');",
  "INSERT INTO public.courses VALUES ('8a3c0bfa-8e1b-4a12-8b95-91b92763ea08', '3566f823-5993-47f3-88a1-38669ea07944', 'Contratos de Sites', 'Como formalizar de forma correta a sua prestaÃ§Ã£o de serviÃ§os. Inclusive, iremos fornecer o contrato que eu utilizava e todos os porquÃªs que ele contÃ©m.', NULL, NULL, NULL, 'f846b8ac-4d4e-4527-a398-8d8a96d3fdda', '2021-11-01 19:06:42.639', '2021-11-06 03:09:13.394');",
  "INSERT INTO public.courses VALUES ('891fe854-1f0f-4854-b7d3-f3746a92585a', '3566f823-5993-47f3-88a1-38669ea07944', 'Dominando DomÃ­nios e DNS para sites', 'Neste bÃ´nus vocÃª conhecerÃ¡ tudo sobre domÃ­nios e DNS para sites. Como configurar, cuidados e para que serve cada tipo de registro no DNS.', NULL, NULL, NULL, 'df48b6d6-efcb-4e62-82d6-0611c73e58cb', '2021-11-01 19:09:18.72', '2021-11-06 03:10:08.481');",
  "INSERT INTO public.courses VALUES ('9c19b9ea-e12a-48e9-960b-511523e2612f', '3566f823-5993-47f3-88a1-38669ea07944', 'CI/CD: Continuous Integration / Continuous Deployment', 'Como adicionar ainda mais qualidade ao seu projeto com processo de integraÃ§Ã£o contÃ­nua e entrega contÃ­nua.', NULL, NULL, NULL, '18e0a1d5-c3a9-4d28-87d1-332ff3b1e6e7', '2021-10-26 22:37:39.541', '2021-11-06 03:10:29.69');",
  "INSERT INTO public.courses VALUES ('1bfc1906-04a0-4ee5-8667-cbaef3b5c1ad', '3566f823-5993-47f3-88a1-38669ea07944', 'AgendaLÃ¡', 'Entenda e aplique a estratÃ©gia de provas de conceito e transforme em cÃ³digo prÃ¡tico no projeto AgendaLÃ¡ utilizando NextJS, API Routes e SWR para consumir dados da api do Notion!', NULL, NULL, NULL, '00be7654-9f37-48c5-b784-9c93302cefec', '2021-11-18 14:49:35.15', '2021-11-18 14:49:35.15');",
  "INSERT INTO public.offers VALUES ('8d6adf0f-e338-4dfa-b152-c012a86dd3bf', '3566f823-5993-47f3-88a1-38669ea07944', '1aa561d0-25ac-488c-b3c9-f997c8450e2a', 'Smoke', '40000', 'paid', 'devpleno.com', '2021-01-20 01:02:16.186', '2021-01-20 01:02:16.186', '{\"offer_id\": [\"test\"], \"product_id\": \"00000\"}');",
  "INSERT INTO public.offers VALUES ('a29e5d76-d4f8-44b4-83fa-73c3565b705c', '3566f823-5993-47f3-88a1-38669ea07944', '1aa561d0-25ac-488c-b3c9-f997c8450e2a', 'Fullstack Master - PadrÃ£o', '99700', 'paid', 'https://lp.devpleno.com/fsm-inscricao', '2021-01-20 01:53:00.188', '2021-01-20 01:53:00.188', '{\"offer_id\": [\"os3lpzh3\"], \"product_id\": \"161358\"}');",
  "INSERT INTO public.offers VALUES ('b2342ed5-f711-4848-af32-5d12f659206d', '3566f823-5993-47f3-88a1-38669ea07944', '1aa561d0-25ac-488c-b3c9-f997c8450e2a', 'FormaÃ§Ã£o Fullstack Master', '99700', 'paid', 'https://lp.devpleno.com/fsm-inscricao', '2021-11-07 01:53:00.188', '2021-11-07 01:53:00.188', '{\"offer_id\": [\"vc38dnir\"], \"product_id\": \"1742276\"}');",
  "INSERT INTO public.offer_courses VALUES ('34d31104-5454-400f-afcf-1e188e93829b', '3566f823-5993-47f3-88a1-38669ea07944', '8d6adf0f-e338-4dfa-b152-c012a86dd3bf', 'd40d42a1-c941-4ec2-9380-d6ec9dcafef9', 'allVersions', NULL, 'lifetime', '2021-01-20 01:02:16.212', '2021-01-20 01:02:16.212');",
  "INSERT INTO public.offer_courses VALUES ('f4863d4b-27dd-447f-8c37-5aa826b5b919', '3566f823-5993-47f3-88a1-38669ea07944', 'a29e5d76-d4f8-44b4-83fa-73c3565b705c', '78de96e5-1146-41d7-a462-a2097fe26bee', 'allVersions', NULL, 'lifetime', '2021-01-20 01:53:00.211', '2021-01-20 01:53:00.211');",
  "INSERT INTO public.labels VALUES ('61d22879-6436-47f1-beb2-03d80b938b49', 'formacao-fsm-anual', '3566f823-5993-47f3-88a1-38669ea07944', true, '2021-11-04 01:34:59.398', '2021-11-04 01:34:59.398');",
  "INSERT INTO public.labels VALUES ('20b8866f-aefa-413b-8d88-61a3ebbb24cc', 'ReactJS', '3566f823-5993-47f3-88a1-38669ea07944', false, '2021-11-04 01:37:06.133', '2021-11-04 01:37:06.133');",
  "INSERT INTO public.labels VALUES ('b5ff37ca-f368-4ece-a049-fd55ad0d9fb0', 'Curso Completo', '3566f823-5993-47f3-88a1-38669ea07944', false, '2021-11-06 02:56:25.598', '2021-11-06 02:56:25.598');",
  "INSERT INTO public.labels VALUES ('edfaf4db-0450-40f6-93eb-3ec24cba47fd', 'NegÃ³cios em Software', '3566f823-5993-47f3-88a1-38669ea07944', false, '2021-11-06 02:56:45.873', '2021-11-06 02:56:45.873');",
  "INSERT INTO public.labels VALUES ('3b01f41d-3bcd-4eaf-a36c-a2215ddce98e', 'Infra', '3566f823-5993-47f3-88a1-38669ea07944', false, '2021-11-06 02:57:07.375', '2021-11-06 02:57:07.375');",
];