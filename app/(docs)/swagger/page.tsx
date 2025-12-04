import ReactSwagger from '@/components/swagger/swagger-ui';
import { getApiDocs } from '@/lib/swagger';

export default async function SwaggerDocsPage() {
  const spec = await getApiDocs();
  return (
    <section className="site-container">
      <ReactSwagger spec={spec as never} />
    </section>
  );
}
