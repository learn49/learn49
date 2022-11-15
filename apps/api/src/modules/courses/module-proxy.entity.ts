import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `
      select
              id,
              proxy_id as proxyId,
              course_version_id as courseVersionId,
            from
              modulo_proxy
      `,
})
export class ModuleProxy {
  @ViewColumn()
  id: string;

  @ViewColumn({ name: 'proxy_id' })
  proxyId: string;

  @ViewColumn({ name: 'course_version_id' })
  courseVersionId: string;
}
