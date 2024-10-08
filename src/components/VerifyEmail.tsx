'use client'

import Link from 'next/link'
import Image from 'next/image'
import { trpc } from '@/trpc/client'
import { Loader2, XCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

interface IVerifyEmail {
  token: string
}

const VerifyEmail = ({ token }: IVerifyEmail) => {
  const { data, isLoading, isError } = trpc.auth.verifyEmail.useQuery({
    token,
  })

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle className="h-8 w-8 text-red-600" />
        <h4 className="font-semibold text-xl">There was a problem.</h4>
        <p className="text-muted-foreground text-sm">
          This token is not valid or might be expired. Please try again.
        </p>
      </div>
    )
  }

  if (data?.success) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative mb-4 h-80 w-80 text-muted-foreground">
          <Image src="/send-email.jpg" fill alt="The email was sent" />
        </div>

        <h3 className="font-semibold text-2xl">You&apos;re all set!</h3>
        <p className="text-muted-foreground">
          Thank you for verifying your email.
        </p>
        <Link href="/sign-in" className={buttonVariants({ className: 'mt-4' })}>
          Sign in
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 text-zinc-300 animate-spin" />
        <h4 className="font-semibold text-xl">Verifying...</h4>
        <p className="text-muted-foreground text-sm">
          This won&apos;t take long.
        </p>
      </div>
    )
  }
}

export default VerifyEmail
