import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
};

export default function SEO({ title, description, canonical }: SEOProps) {
  useEffect(() => {
    document.title = title;

    // Description
    let descriptionTag = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.name = "description";
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.content = description;

    // Canonical
    if (canonical) {
      let canonicalTag = document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement | null;

      if (!canonicalTag) {
        canonicalTag = document.createElement("link");
        canonicalTag.rel = "canonical";
        document.head.appendChild(canonicalTag);
      }

      canonicalTag.href = canonical;
    }
  }, [title, description, canonical]);

  return null;
}
