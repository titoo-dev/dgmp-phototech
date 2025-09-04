import { Container } from "@/components/container/container";
import ReactSwagger from "./react-swagger";
import { getApiDocs } from "@/lib/swagger";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <Container>
      <ReactSwagger spec={spec} />
    </Container>
  );
}