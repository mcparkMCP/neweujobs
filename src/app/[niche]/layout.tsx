import { Metadata } from 'next';
import dbConnect from '@/lib/dbConnect';
import { findNicheBySlug, getAllNicheSlugs } from '@/models/Niche';

export async function generateStaticParams() {
  try {
    await dbConnect();
    const slugs = await getAllNicheSlugs();
    return slugs.map((niche) => ({ niche }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niche: string }>;
}): Promise<Metadata> {
  const { niche: slug } = await params;

  try {
    await dbConnect();
    const niche = await findNicheBySlug(slug);

    if (!niche) {
      return {
        title: 'Not Found - EUJobs.co',
      };
    }

    return {
      title: `${niche.name} - EUJobs.co`,
      description: niche.description,
      keywords: niche.keywords.join(', '),
      openGraph: {
        title: `${niche.name} - EUJobs.co`,
        description: niche.description,
        url: `https://eujobs.co/${niche.slug}`,
        siteName: 'EUJobs.co',
        locale: 'en_EU',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: niche.name,
        description: niche.description,
      },
    };
  } catch {
    return {
      title: 'EUJobs.co',
    };
  }
}

export default function NicheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
