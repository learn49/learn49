import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `
      select
          id,
          coalesce(base_lesson_id, id) as proxyId,
          account_id as accountId,
          module_id as moduloId,
          course_version_id as courseVersionId,
          course_id as courseId,
          status as status
        from
          lesson_proxy
      `,
})
export class LessonProxy {
  @ViewColumn()
  id: string;

  @ViewColumn({ name: 'proxy_id' })
  proxyId: string;

  @ViewColumn({ name: 'account_id' })
  accountId: string;

  @ViewColumn({ name: 'module_id' })
  moduleId: string;

  @ViewColumn({ name: 'course_version_id' })
  courseVersionId: string;

  @ViewColumn({ name: 'course_id' })
  courseId: string;

  @ViewColumn({ name: 'status' })
  status: string;
}
