import type { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';
import { GalleryClient } from '@/components/public/GalleryClient';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Explore moments from Sri Chaitanya School - campus, classrooms, sports, events, cultural activities, annual day, and field trips.',
};

export const revalidate = 3600;

async function getGalleryItems() {
  return prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } });
}

export default async function GalleryPage() {
  const items = await getGalleryItems();
  const categories = ['All', 'Campus', 'Classrooms', 'Sports', 'Events', 'Cultural Activities', 'Annual Day', 'Field Trips'];

  return (
    <>
      <Navbar />
      <section className="gradient-hero text-white py-10 sm:py-16">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[1.75rem] font-bold leading-tight sm:text-5xl">School Gallery</h1>
          <p className="mt-3 text-sm text-navy-200 max-w-2xl mx-auto sm:mt-4 sm:text-base">Capturing memorable moments from our school life.</p>
        </div>
      </section>

      <GalleryClient items={items.map(item => ({ id: item.id, title: item.title, category: item.category, imageUrl: item.imageUrl, description: item.description ?? undefined }))} categories={categories} />

      <Footer />
    </>
  );
}
