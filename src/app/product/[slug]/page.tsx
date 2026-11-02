import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import ProductDetailsClient from "@/components/ProductDetailsClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return {
      title: "Product Not Found - Borka Shop",
    };
  }

  return {
    title: `${product.name} - Borka Shop`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

async function getProductData(slug: string): Promise<{ product: Product | undefined; relatedProducts: Product[] }> {
  try {
    const res = await fetch("http://localhost:5000/api/products", { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        const found = data.products.find((p: any) => p.slug === slug);
        if (found) {
          const related = data.products
            .filter((p: any) => p.category === found.category && p.id !== found.id)
            .slice(0, 4);
          return { product: found, relatedProducts: related };
        }
      }
    }
  } catch {}

  const local = PRODUCTS.find((p) => p.slug === slug);
  const localRelated = local
    ? PRODUCTS.filter((p) => p.category === local.category && p.id !== local.id).slice(0, 4)
    : [];
  return { product: local, relatedProducts: localRelated };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const { product, relatedProducts } = await getProductData(slug);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
