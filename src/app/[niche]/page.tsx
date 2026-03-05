import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import { Niche } from '@/models/Niche';
import { JobModel } from '@/models/Job';
import { NicheLanding } from '@/components/NicheLanding';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ niche: string }>;
}

function buildNicheQuery(filters: {
  cities?: string[];
  countries?: string[];
  companyPatterns?: string[];
  seniority?: string[];
  titleKeywords?: string[];
}) {
  const query: Record<string, unknown> = { status: 'active' };

  // Location filters (cities, countries, companyPatterns) are OR'd — a job
  // matches if it's in the right city OR country OR from a known org.
  const locationOr: Record<string, unknown>[] = [];

  if (filters.cities?.length) {
    locationOr.push({ city: { $in: filters.cities.map(c => new RegExp(c, 'i')) } });
  }
  if (filters.countries?.length) {
    locationOr.push({ country: { $in: filters.countries.map(c => new RegExp(c, 'i')) } });
  }
  if (filters.companyPatterns?.length) {
    locationOr.push(
      ...filters.companyPatterns.map(p => ({ companyName: { $regex: p, $options: 'i' } }))
    );
  }

  // Non-location filters (seniority, titleKeywords) are AND'd on top.
  const andConditions: Record<string, unknown>[] = [];

  if (locationOr.length > 0) {
    andConditions.push({ $or: locationOr });
  }
  if (filters.seniority?.length) {
    andConditions.push({ seniority: { $in: filters.seniority } });
  }
  if (filters.titleKeywords?.length) {
    andConditions.push({
      $or: filters.titleKeywords.map(k => ({ title: { $regex: k, $options: 'i' } }))
    });
  }

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  return query;
}

async function getNicheWithJobs(slug: string) {
  await dbConnect();
  const niche = await Niche.findOne({ slug, enabled: true }).lean();
  if (!niche) return null;

  const query = buildNicheQuery(niche.filters || {});

  const jobs = await JobModel.find(query)
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return { niche: JSON.parse(JSON.stringify(niche)), jobs: JSON.parse(JSON.stringify(jobs)) };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { niche: nicheSlug } = await params;
  await dbConnect();
  const niche = await Niche.findOne({ slug: nicheSlug, enabled: true }).lean();

  if (!niche) {
    return { title: 'Not Found' };
  }

  const description = niche.description?.length > 160
    ? niche.description.slice(0, 160).replace(/\s+\S*$/, '') + '...'
    : niche.description;

  return {
    title: `${niche.name} | EUJobs.co`,
    description,
    keywords: niche.keywords?.join(', '),
    openGraph: {
      title: niche.name,
      description,
      type: 'website',
      url: `https://eujobs.co/${nicheSlug}`,
      siteName: 'EUJobs.co',
    },
  };
}

export default async function NichePage({ params }: PageProps) {
  const { niche: nicheSlug } = await params;
  const result = await getNicheWithJobs(nicheSlug);

  if (!result) {
    notFound();
  }

  return <NicheLanding niche={result.niche} jobs={result.jobs} />;
}

// Generate static paths for enabled niches
export async function generateStaticParams() {
  await dbConnect();
  const niches = await Niche.find({ enabled: true }).select('slug').lean();
  return niches.map((n: any) => ({ niche: n.slug }));
}
