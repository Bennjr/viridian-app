import { motion } from "framer-motion"

const books = [
  { title: "Book Title 1", author: "Author 1", category: "Fiction" },
  { title: "Book Title 1", author: "Author 1", category: "Fiction" },
  { title: "Book Title 1", author: "Author 1", category: "Fiction" },
  { title: "Book Title 1", author: "Author 1", category: "History" },
  { title: "Book Title 1", author: "Author 1", category: "History" },
  { title: "Book Title 1", author: "Author 1", category: "History" },
  { title: "Book Title 1", author: "Author 1", category: "Factual" },
  { title: "Book Title 1", author: "Author 1", category: "Factual" },
  { title: "Book Title 1", author: "Author 1", category: "Factual" },
  { title: "Book Title 1", author: "Author 1", category: "Factual" },
  { title: "Book Title 1", author: "Author 1", category: "Poetry" },
  { title: "Book Title 1", author: "Author 1", category: "Poetry" },
  { title: "Book Title 1", author: "Author 1", category: "Poetry" },
  { title: "Book Title 1", author: "Author 1", category: "Poetry" },
]

export default function Library() {
  const categories = books.reduce((acc, book) => {
    if (!acc[book.category]) acc[book.category] = [];
    acc[book.category].push(book);
    return acc;
  }, {} as Record<string, typeof books>);

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar p-8 lg:p-12 space-y-12">
      {Object.entries(categories).map(([category, categoryBooks]) => (
        <section key={category}>
          <h2 className="text-xl font-bold text-zinc-100 px-1 tracking-tight">
            {category}
          </h2>

          <div className="flex gap-6 overflow-x-auto scrollbar-hide snap-x">
            {categoryBooks.map((book, index) => (
              <div key={index} className="snap-start shrink-0">
                <LibraryBook title={book.title} author={book.author} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

interface LibraryBookProps {
  title: string;
  author: string;
  coverUrl?: string;
  progress?: number;
}

function LibraryBook({ title, author, coverUrl, progress = 0 }: LibraryBookProps) {
  const imageSrc = coverUrl || "https://les.unibok.no/bookresource/publisher/aschehoug/book/9788203406829/epub/5516/OEBPS/image/Fokus_samfkunnsk/nb/FOKUS_samfunnskunnskap.jpg";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group cursor-pointer flex flex-col w-44"
    >
      <div className="relative aspect-[2/3] w-full rounded-r-lg rounded-l-sm overflow-hidden shadow-md group-hover:shadow-2xl group-hover:shadow-c-brand/20 transition-all duration-300 bg-zinc-800">
        <img
          src={imageSrc}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20 blur-[1px]" />
          <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-white/10" />
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full bg-c-brand"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 px-1 pt-3">
        <h2 className="font-bold text-sm text-zinc-100 leading-tight line-clamp-2 group-hover:text-c-brand transition-colors">
          {title}
        </h2>
        <p className="text-[11px] font-medium text-zinc-500 truncate uppercase tracking-wider">
          {author}
        </p>
      </div>
    </motion.div>
  );
}