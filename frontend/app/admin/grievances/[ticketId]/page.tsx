import { GrievanceDetailClient } from '@/components/grievance/GrievanceDetailClient';

export function generateStaticParams() {
  return [
    { ticketId: 'DIGT4012' },
    { ticketId: 'DIGT4015' },
    { ticketId: 'DIGT3990' },
  ];
}

export default async function GrievanceDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  return <GrievanceDetailClient ticketId={ticketId} />;
}
