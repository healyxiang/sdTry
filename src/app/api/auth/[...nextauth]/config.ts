import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/lib/prima' // 确保路径正确
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      async profile(profile) {
        console.log('GitHub Profile:', profile)
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
    // 其他提供者...
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // if (token) {
      //   session.user.id = token.id
      // }
      // return session
      // console.log('session:', session)
      // console.log('token:', token)
      return { ...session, test: 3333 }
    },
  },
}
