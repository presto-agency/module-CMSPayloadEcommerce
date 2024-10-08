'use client'

import Link from 'next/link'
import { trpc } from '@/trpc/client'
import { TQueryValidator } from '@/lib/validators/query-validator'
import { Product } from '@/payload-types'
import ProductListing from '@/components/ProductListing'

interface IProductReel {
  title: string
  subtitle?: string
  href?: string
  query: TQueryValidator
}

const FALLBACK_LIMIT = 4

const ProductReel = (props: IProductReel) => {
  const { title, subtitle, href, query } = props

  const { data: queryResults, isLoading } =
    trpc.getInfiniteProducts.useInfiniteQuery(
      {
        limit: query.limit ?? FALLBACK_LIMIT,
        query,
      },
      { getNextPageParam: (lastPage) => lastPage.nextPage },
    )

  const products = queryResults?.pages.flatMap(
    (page) => page.items,
  ) as unknown as Product[]
  console.log('ProductReel, products ', products)
  let map: (Product | null)[] = []

  if (products && products.length) {
    map = products
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null)
  }

  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl empty:hidden">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground empty:hidden">
            {subtitle}
          </p>
        </div>
        {href ? (
          <Link
            href={href}
            className="hidden text-sm font-medium text-blue-600 hover:to-blue-500 md:block"
          >
            Shop the collection <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {map.map((product, index) => (
              <ProductListing
                product={product}
                index={index}
                key={`product-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductReel
