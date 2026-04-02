"use client";

import { GoldTitle } from "@/components/global/reusables";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BLOG_POST } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif mb-10"><GoldTitle>Insights & Blogs</GoldTitle></h1>

        <Carousel className="w-full">
          <CarouselContent>
            {BLOG_POST.map((post) => (
              <CarouselItem
                key={post.slug}
                className="md:basis-1/2 lg:basis-1/3 p-4"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-[#1B1B20] rounded-xl overflow-hidden hover:scale-[1.02] transition bg-linear-to-b from-transparent via-transparent to-amber-300/10">
                    <Image
                      src={post.image}
                      alt="Blog post image"
                      width={500}
                      height={500}
                      className="h-48 w-full  object-fill"
                    />
                    <div className="p-5">
                      <h2 className="text-lg font-semibold text-amber-400/70">{post.title}</h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {post.author} • {post.date}
                      </p>
                      <p className="text-sm mt-3 text-gray-300 line-clamp-1">
                        {post.excerpt}
                      </p>
                      <p className="text-sm mt-3 text-gray-300 line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </main>
  );
}