import { GoldTitle } from "@/components/global/reusables";
import { BLOG_POST } from "@/lib/data";

export default async function BlogDetail({ params }: { params: Promise<{
    slug: string;
  }> }) {

  const { slug } = await params;
  
  const post = BLOG_POST.find((p) => p.slug === slug);

  if (!post) return <div>Not Found</div>;

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif mb-4"><GoldTitle>{post.title}</GoldTitle></h1>
        <p className="text-gray-400 mb-6 text-xs sm:text-sm">
          {post.author} • {post.date} • {post.readTime}
        </p>

        <img src={post.image} className="rounded-xl mb-6" />

        <div className="my-2">
          <p className="text-muted-foreground font-medium text-xl sm:text-3xl">{post.excerpt}</p>
        </div>

        <article className="prose prose-invert max-w-none">
          {post.content.split("\n").map((p, i) => (
            <p key={i} className="text-gray-400 text-sm sm:text-base">{p}</p>
          ))}
        </article>
      </div>
    </main>
  );
}