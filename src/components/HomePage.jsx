import { Header } from "./Header";
import { Hero } from "./Hero";
import { Description } from "./Description";
import { Contact } from "./Contact";

export function HomePage() {
  const newspaperBg = "https://images.unsplash.com/photo-1661775620245-36fd8d0429e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBiYWNrZ3JvdW5kJTIwdmludGFnZXxlbnwxfHx8fDE3NjY3MjMxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const newspaperTexture = "https://images.unsplash.com/photo-1649433540410-eb607ff25bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBuZXdzcGFwZXIlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2NzA3OTMyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <div className="min-h-screen bg-white relative">
      {/* Newspaper Background */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-50 z-0"
        style={{ backgroundImage: `url(${newspaperTexture})` }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <Hero backgroundImage={newspaperBg} />
        <Description />
        <Contact />
      </div>
    </div>
  );
}